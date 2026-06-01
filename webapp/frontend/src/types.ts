// Shared domain types for the Misinformation Detection app.

export type VeracityId =
  | "pants-fire"
  | "false"
  | "barely-true"
  | "half-true"
  | "mostly-true"
  | "true";

export interface PredictResponse {
  prediction: VeracityId;
  prediction_display: string;
  confidence: number;
  probabilities: Record<VeracityId, number>;
  model_used: string;
  latency_ms: number;
  request_id: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
  model_loaded: boolean;
  device: string;
}

export interface ModelMetric {
  accuracy?: number;
  macro_f1?: number;
  weighted_f1?: number;
  f1?: number;
}

export interface MetricsResponse {
  uptime_seconds: number;
  total_requests: number;
  total_predictions: number;
  error_count: number;
  avg_latency_ms: number;
  model_metrics: Record<string, ModelMetric>;
}

export interface ExampleItem {
  statement: string;
  party?: string | null;
}

export interface LabelMeta {
  id: VeracityId;
  label: string;
  color: string;
  bg: string;
  ring: string;
}
