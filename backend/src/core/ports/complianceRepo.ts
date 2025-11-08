import { CBRecord } from "../domain/compliance";

export interface ComplianceRepo {
  upsertCB(record: CBRecord): Promise<CBRecord>;
  getCB(shipId: string, year: number): Promise<CBRecord | null>;
}
