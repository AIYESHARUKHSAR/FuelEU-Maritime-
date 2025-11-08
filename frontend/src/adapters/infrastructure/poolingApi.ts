import { api } from "./apiClient";

export async function createPool(year: number, members: { shipId: string; cb: number }[]) {
  const { data } = await api.post(`/pools`, { year, members });
  return data as {
    poolId: number;
    members: { shipId: string; cbBefore: number; cbAfter: number }[];
    poolSum: number;
  };
}
