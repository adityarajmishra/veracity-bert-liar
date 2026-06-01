"""
Neural model architectures.

These mirror the architectures trained in the project notebook so that the
serialized weights (models/*.pt) load without modification.

Memory note: at inference time we do NOT need the pretrained BERT weights —
they are overwritten by our fine-tuned checkpoint. Constructing the encoder
from a *config* (random init) instead of `from_pretrained` avoids a wasteful
second copy of ~440 MB in RAM and skips downloading the base checkpoint.
"""
from __future__ import annotations

import torch
import torch.nn as nn
from transformers import BertConfig, BertModel


def _build_encoder(encoder: str, pretrained: bool) -> BertModel:
    if pretrained:
        return BertModel.from_pretrained(encoder)
    # Config-only construction: tiny download (config.json), no weight load.
    config = BertConfig.from_pretrained(encoder)
    return BertModel(config)


class BertClassifier(nn.Module):
    """BERT-base encoder with a linear classification head on the [CLS] token."""

    def __init__(self, num_classes: int = 6, dropout: float = 0.1,
                 encoder: str = "bert-base-uncased", pretrained: bool = False) -> None:
        super().__init__()
        self.bert = _build_encoder(encoder, pretrained)
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_classes)

    def forward(self, input_ids, attention_mask, metadata=None):
        out = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls = out.last_hidden_state[:, 0, :]
        return self.classifier(self.dropout(cls))


class BertMetadataFusionModel(nn.Module):
    """Dual-stream model fusing the BERT [CLS] embedding with speaker metadata."""

    def __init__(self, metadata_dim: int, num_classes: int = 6,
                 dropout: float = 0.3, encoder: str = "bert-base-uncased",
                 pretrained: bool = False) -> None:
        super().__init__()
        self.bert = _build_encoder(encoder, pretrained)
        hidden = self.bert.config.hidden_size
        self.metadata_net = nn.Sequential(
            nn.Linear(metadata_dim, 128), nn.ReLU(), nn.Dropout(dropout)
        )
        self.fusion = nn.Sequential(
            nn.Linear(hidden + 128, 256), nn.ReLU(), nn.Dropout(dropout)
        )
        self.classifier = nn.Linear(256, num_classes)

    def forward(self, input_ids, attention_mask, metadata):
        cls = self.bert(input_ids=input_ids,
                        attention_mask=attention_mask).last_hidden_state[:, 0, :]
        meta = self.metadata_net(metadata)
        return self.classifier(self.fusion(torch.cat([cls, meta], dim=1)))
