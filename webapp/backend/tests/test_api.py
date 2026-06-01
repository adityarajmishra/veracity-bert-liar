"""
Smoke tests for the API.

Run with:  pytest -q
These tests load the real model, so they require the trained weights in
models/. They validate the contract of each endpoint.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["model_loaded"] is True


def test_labels(client):
    r = client.get("/labels")
    assert r.status_code == 200
    assert len(r.json()) == 6


def test_predict_basic(client):
    r = client.post("/predict", json={"statement": "The economy grew by three percent last year."})
    assert r.status_code == 200
    body = r.json()
    assert body["prediction"] in [
        "pants-fire", "false", "barely-true", "half-true", "mostly-true", "true"
    ]
    assert 0.0 <= body["confidence"] <= 1.0
    assert abs(sum(body["probabilities"].values()) - 1.0) < 1e-3
    assert "request_id" in body


def test_predict_with_metadata(client):
    r = client.post("/predict", json={
        "statement": "Crime has increased by 500 percent in two years.",
        "party": "republican",
    })
    assert r.status_code == 200
    assert r.json()["model_used"] == "BERT + Metadata Fusion"


def test_predict_validation_error(client):
    r = client.post("/predict", json={"statement": "ab"})  # too short
    assert r.status_code == 422


def test_metrics(client):
    r = client.get("/metrics")
    assert r.status_code == 200
    assert "total_requests" in r.json()


def test_api_info(client):
    r = client.get("/api-info")
    assert r.status_code == 200
    body = r.json()
    assert body["license"] == "MIT"
    assert "rate_limits" in body
    assert "usage_policy" in body


def test_security_headers(client):
    r = client.get("/health")
    assert r.headers.get("X-Content-Type-Options") == "nosniff"
    assert r.headers.get("X-Frame-Options") == "DENY"
