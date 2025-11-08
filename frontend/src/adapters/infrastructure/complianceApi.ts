import { api } from "./apiClient";

export async function fetchCB(shipId: string, year: number) {
  const { data } = await api.get(`/compliance/cb`, { params: { shipId, year } });
  return data as { shipId: string; year: number; cb: number };
}

export async function fetchAdjustedCB(shipId: string, year: number) {
  const { data } = await api.get(`/compliance/adjusted-cb`, { params: { shipId, year } });
  return data as { shipId: string; year: number; cb_before: number; adjusted_cb: number };
}
