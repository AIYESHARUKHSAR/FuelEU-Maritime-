export interface BankingPort {
  listBanking(shipId: string, year: number): Promise<{ amount: number; createdAt: string }[]>;
  bank(shipId: string, year: number): Promise<{ cb_before: number; applied: number; cb_after: number }>;
  applyBank(shipId: string, year: number, amount: number): Promise<{ applied: number; available_before: number; available_after: number }>;
}
