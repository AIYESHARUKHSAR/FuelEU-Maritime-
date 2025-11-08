export interface CompliancePort {
  fetchCB(shipId: string, year: number): Promise<{ shipId: string; year: number; cb: number }>;
  fetchAdjustedCB(shipId: string, year: number): Promise<{ shipId: string; year: number; cb_before: number; adjusted_cb: number }>;
}
