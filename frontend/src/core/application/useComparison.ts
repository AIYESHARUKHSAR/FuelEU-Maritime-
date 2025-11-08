import { useEffect, useState } from "react";
import * as api from "../../adapters/infrastructure/routesApi";

export function useComparison() {
  const [data, setData] = useState<{
    baseline: string;
    target: number;
    rows: { routeId: string; baseline: number; comparison: number; percentDiff: number; compliant: boolean }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.fetchComparison().then(setData).catch((e) => {
      setError(e?.response?.data?.error || "Failed to load comparison");
      setData(null);
    });
  }, []);

  return { data, error };
}
