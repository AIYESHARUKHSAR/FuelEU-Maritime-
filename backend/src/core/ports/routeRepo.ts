import { RouteEntity } from "../domain/route";

export interface RouteRepo {
  getAll(): Promise<RouteEntity[]>;
  setBaseline(routeId: string): Promise<void>;
  getBaseline(): Promise<RouteEntity | null>;
}
