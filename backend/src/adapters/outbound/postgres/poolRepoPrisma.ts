import { PoolRepo, PoolMemberAlloc } from "../../../core/ports/poolRepo";
import { prisma } from "./prismaClient";

export const poolRepoPrisma: PoolRepo = {
  async createPool(year: number, members: PoolMemberAlloc[]) {
    const created = await prisma.pool.create({
      data: {
        year,
        members: { create: members.map(m => ({ shipId: m.shipId, cbBefore: m.cbBefore, cbAfter: m.cbAfter })) }
      }
    });
    return { id: created.id };
  }
};
