export interface BankingRepo {
  getBanked(shipId: string, year: number): Promise<number>;
  addBank(shipId: string, year: number, amount: number): Promise<void>;
  applyBank(shipId: string, year: number, amount: number): Promise<void>;
  listRecords(shipId: string, year: number): Promise<{amount: number; createdAt: Date}[]>;
}
