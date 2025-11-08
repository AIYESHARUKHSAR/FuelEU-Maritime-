import { useState } from "react";
import * as api from "../../adapters/infrastructure/poolingApi";

export function usePooling() {
  const [year, setYear] = useState(2025);
  const [members, setMembers] = useState<{ shipId: string; cb: number }[]>([
    { shipId: "S1", cb: 1_000_000 },
    { shipId: "S2", cb: -600_000 },
    { shipId: "S3", cb: -300_000 }
  ]);

  const sum = members.reduce((s, m) => s + m.cb, 0);
  const valid = sum >= 0;

  async function create() {
    return api.createPool(year, members);
  }

  return { year, setYear, members, setMembers, sum, valid, create };
}
