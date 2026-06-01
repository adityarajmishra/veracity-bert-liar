"""
Inference service.

Encapsulates model loading and prediction behind a clean interface. The service
is initialized once at application startup and reused for all requests.
"""
from __future__ import annotations

import json
import os
import time
import unicodedata
from typing import Dict, List, Optional

import numpy as np
import torch
import torch.nn.functional as F
from transformers import BertTokenizer

from app.core.config import Settings
from app.core.logging_config import get_logger
from app.services.models import BertClassifier, BertMetadataFusionModel

logger = get_logger(__name__)

LABEL_ORDER = ["pants-fire", "false", "barely-true", "half-true", "mostly-true", "true"]
LABEL_DISPLAY = {
    "pants-fire": "Pants on Fire",
    "false": "False",
    "barely-true": "Barely True",
    "half-true": "Half True",
    "mostly-true": "Mostly True",
    "true": "True",
}


def _select_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    if torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


class PredictionResult(dict):
    """Lightweight typed dict for prediction output."""


class VeracityPredictor:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.device = _select_device()
        self.models_dir = settings.models_dir
        self.max_length = settings.max_sequence_length
        self._loaded = False
        self.tokenizer: Optional[BertTokenizer] = None
        self.text_model: Optional[BertClassifier] = None
        self.fusion_model: Optional[BertMetadataFusionModel] = None
        self.config: Dict = {}
        self.party2id: Dict[str, int] = {}
        self.metadata_dim: int = 29

    # ------------------------------------------------------------------ load
    def load(self) -> None:
        """Load tokenizer, config, and model weights. Called once on startup."""
        t0 = time.perf_counter()
        logger.info("Loading models from %s (device=%s)", self.models_dir, self.device)

        self.tokenizer = BertTokenizer.from_pretrained(self.settings.base_encoder)

        cfg_path = os.path.join(self.models_dir, "model_config.json")
        if os.path.exists(cfg_path):
            with open(cfg_path) as f:
                self.config = json.load(f)
            self.party2id = self.config.get("party2id", {})
            self.metadata_dim = int(self.config.get("metadata_dim", 29))
        else:
            logger.warning("model_config.json not found; using defaults")

        # Text-only model (primary)
        self.text_model = BertClassifier(num_classes=len(LABEL_ORDER),
                                         encoder=self.settings.base_encoder)
        self._load_weights(self.text_model, "bert_text_only.pt")
        self.text_model.to(self.device).eval()

        # Fusion model (optional)
        fusion_path = os.path.join(self.models_dir, "bert_metadata_fusion.pt")
        if os.path.exists(fusion_path):
            self.fusion_model = BertMetadataFusionModel(
                metadata_dim=self.metadata_dim,
                num_classes=len(LABEL_ORDER),
                encoder=self.settings.base_encoder,
            )
            self._load_weights(self.fusion_model, "bert_metadata_fusion.pt")
            self.fusion_model.to(self.device).eval()
        else:
            logger.warning("Fusion model not found; metadata requests will use text model")

        self._loaded = True
        logger.info("Models loaded in %.1fs", time.perf_counter() - t0)

    def _load_weights(self, model: torch.nn.Module, fname: str) -> None:
        path = os.path.join(self.models_dir, fname)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model weights not found: {path}")
        state = torch.load(path, map_location=self.device)
        # strict=False tolerates legacy buffer keys (e.g. position_ids).
        missing, unexpected = model.load_state_dict(state, strict=False)
        if missing:
            logger.debug("Missing keys for %s: %s", fname, missing)

    @property
    def is_ready(self) -> bool:
        return self._loaded

    # --------------------------------------------------------------- predict
    @staticmethod
    def _clean(text: str) -> str:
        return unicodedata.normalize("NFD", str(text)).lower().strip()

    def _encode_metadata(self, party: Optional[str],
                         credit_history: Optional[List[float]]) -> np.ndarray:
        n_parties = len(self.party2id)
        vec = np.zeros(self.metadata_dim, dtype=np.float32)
        if party and party in self.party2id:
            idx = self.party2id[party]
            if 0 <= idx < n_parties:
                vec[idx] = 1.0
        if credit_history and len(credit_history) == 5:
            credit = np.asarray(credit_history, dtype=np.float32)
            norm = float(np.linalg.norm(credit))
            if norm > 0:
                credit = credit / norm
            vec[n_parties:n_parties + 5] = credit
        return vec

    @torch.no_grad()
    def predict(self, statement: str, party: Optional[str] = None,
                credit_history: Optional[List[float]] = None) -> PredictionResult:
        if not self._loaded:
            raise RuntimeError("Predictor not initialized")

        t0 = time.perf_counter()
        text = self._clean(statement)
        enc = self.tokenizer(text, max_length=self.max_length, padding="max_length",
                             truncation=True, return_tensors="pt")
        input_ids = enc["input_ids"].to(self.device)
        attention_mask = enc["attention_mask"].to(self.device)

        use_fusion = (
            self.fusion_model is not None
            and (party or (credit_history and any(credit_history)))
        )

        if use_fusion:
            meta = torch.tensor(
                self._encode_metadata(party, credit_history),
                dtype=torch.float32,
            ).unsqueeze(0).to(self.device)
            logits = self.fusion_model(input_ids, attention_mask, meta)
            model_used = "BERT + Metadata Fusion"
        else:
            logits = self.text_model(input_ids, attention_mask)
            model_used = "BERT (text-only)"

        probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()
        pred_idx = int(np.argmax(probs))
        latency_ms = (time.perf_counter() - t0) * 1000.0

        return PredictionResult(
            prediction=LABEL_ORDER[pred_idx],
            prediction_display=LABEL_DISPLAY[LABEL_ORDER[pred_idx]],
            confidence=float(probs[pred_idx]),
            probabilities={LABEL_ORDER[i]: float(probs[i]) for i in range(len(LABEL_ORDER))},
            model_used=model_used,
            latency_ms=round(latency_ms, 2),
        )
