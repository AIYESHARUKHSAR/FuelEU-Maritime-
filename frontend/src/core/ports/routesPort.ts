import { RouteEntity } from "../domain/route";

export interface RoutesPort {
  fetchRoutes(): Promise<RouteEntity[]>;
  setBaseline(routeId: string): Promise<void>;
  fetchComparison(): Promise<{
    baseline: string;
    target: number;
    rows: { routeId: string; baseline: number; comparison: number; percentDiff: number; compliant: boolean }[];
  }>;
}
