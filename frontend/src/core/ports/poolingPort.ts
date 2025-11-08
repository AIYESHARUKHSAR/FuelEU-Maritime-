export interface PoolingPort {
  createPool(year: number, members: { shipId: string; cb: number }[]): Promise<{
    poolId: number;
    members: { shipId: string; cbBefore: number; cbAfter: number }[];
    poolSum: number;
  }>;
}
