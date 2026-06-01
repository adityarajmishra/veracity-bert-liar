// Typed API client for the Misinformation Detection backend.
import type {
  ExampleItem,
  HealthResponse,
  MetricsResponse,
  PredictResponse,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* ignore parse errors */
    }
    throw new ApiError(detail, res.status);
  }
  return res.json() as Promise<T>;
}

export function predict(
  statement: string,
  party?: string | null,
  creditHistory?: number[] | null
): Promise<PredictResponse> {
  return request<PredictResponse>("/predict", {
    method: "POST",
    body: JSON.stringify({
      statement,
      party: party || null,
      credit_history: creditHistory || null,
    }),
  });
}

export const getHealth = () => request<HealthResponse>("/health");
export const getMetrics = () => request<MetricsResponse>("/metrics");
export const getExamples = () => request<ExampleItem[]>("/examples");

export { API_URL, ApiError };
