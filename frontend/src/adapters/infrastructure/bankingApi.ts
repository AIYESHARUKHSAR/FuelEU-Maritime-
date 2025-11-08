import { api } from "./apiClient";

export async function listBanking(shipId: string, year: number) {
  const { data } = await api.get(`/banking/records`, { params: { shipId, year } });
  return data as { amount: number; createdAt: string }[];
}
export async function bank(shipId: string, year: number) {
  const { data } = await api.post(`/banking/bank`, { shipId, year });
  return data as { cb_before: number; applied: number; cb_after: number };
}
export async function applyBank(shipId: string, year: number, amount: number) {
  const { data } = await api.post(`/banking/apply`, { shipId, year, amount });
  return data as { applied: number; available_before: number; available_after: number };
}
