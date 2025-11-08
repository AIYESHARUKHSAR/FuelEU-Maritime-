import { useEffect, useMemo, useState } from "react";
import type { RouteEntity } from "../domain/route";
import * as api from "../../adapters/infrastructure/routesApi";

export function useRoutes() {
  const [routes, setRoutes] = useState<RouteEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ vesselType: "", fuelType: "", year: "" });

  useEffect(() => {
    setLoading(true);
    api.fetchRoutes().then(setRoutes).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      routes.filter((r) =>
        (!filters.vesselType || r.vesselType === filters.vesselType) &&
        (!filters.fuelType || r.fuelType === filters.fuelType) &&
        (!filters.year || String(r.year) === filters.year)
      ),
    [routes, filters]
  );

  async function markBaseline(routeId: string) {
    await api.setBaseline(routeId);
    setRoutes(await api.fetchRoutes());
  }

  return {
    routes,
    filtered,
    loading,
    filters,
    setFilters,
    vesselTypes: Array.from(new Set(routes.map(r => r.vesselType))),
    fuelTypes: Array.from(new Set(routes.map(r => r.fuelType))),
    years: Array.from(new Set(routes.map(r => r.year))).sort(),
    markBaseline
  };
}
