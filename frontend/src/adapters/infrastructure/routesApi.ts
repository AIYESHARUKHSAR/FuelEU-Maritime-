import { api } from "./apiClient";
import { RouteEntity } from "../../core/domain/route";

export async function fetchRoutes(): Promise<RouteEntity[]> {
  const { data } = await api.get("/routes");
  return data;
}
export async function setBaseline(routeId: string) {
  await api.post(`/routes/${routeId}/baseline`);
}
export async function fetchComparison() {
  const { data } = await api.get("/routes/comparison");
  return data as {
    baseline: string;
    target: number;
    rows: { routeId: string; baseline: number; comparison: number; percentDiff: number; compliant: boolean }[];
  };
}
