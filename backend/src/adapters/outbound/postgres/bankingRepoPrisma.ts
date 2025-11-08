import { BankingRepo } from "../../../core/ports/bankingRepo";
import { prisma } from "./prismaClient";

export const bankingRepoPrisma: BankingRepo = {
  async getBanked(shipId, year) {
    const entries = await prisma.bankEntry.findMany({ where: { shipId, year }});
    return entries.reduce((s,e)=>s+e.amount, 0);
  },
  async addBank(shipId, year, amount) {
    await prisma.bankEntry.create({ data: { shipId, year, amount }});
  },
  async applyBank(shipId, year, amount) {
    await prisma.bankEntry.create({ data: { shipId, year, amount: -Math.abs(amount) }});
  },
  async listRecords(shipId, year) {
    const list = await prisma.bankEntry.findMany({ where: { shipId, year }, orderBy: { createdAt: 'desc' }});
    return list.map(l => ({ amount: l.amount, createdAt: l.createdAt }));
  }
};
