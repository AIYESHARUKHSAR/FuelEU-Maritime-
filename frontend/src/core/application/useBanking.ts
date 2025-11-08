import { useEffect, useState } from "react";
import * as compliance from "../../adapters/infrastructure/complianceApi";
import * as banking from "../../adapters/infrastructure/bankingApi";

export function useBanking(initialShipId = "SHIP-001", initialYear = 2025) {
  const [shipId, setShipId] = useState(initialShipId);
  const [year, setYear] = useState(initialYear);
  const [cb, setCb] = useState<number | null>(null);
  const [adjusted, setAdjusted] = useState<number | null>(null);
  const [records, setRecords] = useState<{ amount: number; createdAt: string }[]>([]);

  async function refresh() {
    const c = await compliance.fetchCB(shipId, year);
    setCb(c.cb);
    const adj = await compliance.fetchAdjustedCB(shipId, year);
    setAdjusted(adj.adjusted_cb);
    setRecords(await banking.listBanking(shipId, year));
  }

  useEffect(() => { refresh(); }, [shipId, year]);

  async function doBank() {
    await banking.bank(shipId, year);
    await refresh();
  }
  async function doApply(amount: number) {
    await banking.applyBank(shipId, year, amount);
    await refresh();
  }

  return { shipId, setShipId, year, setYear, cb, adjusted, records, refresh, doBank, doApply };
}
