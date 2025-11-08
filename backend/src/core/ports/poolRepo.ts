export type PoolMemberAlloc = { shipId: string; cbBefore: number; cbAfter: number };

export interface PoolRepo {
  createPool(year: number, members: PoolMemberAlloc[]): Promise<{ id: number }>;
}
