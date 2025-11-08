import { prisma } from "../../adapters/outbound/postgres/prismaClient";
import { snapshotCB } from "./complianceService";

export async function bankSurplus(shipId: string, year: number) {
  const snap = await snapshotCB(shipId, year);
  if (snap.cbGco2eq <= 0) {
    throw new Error("CB is not positive; nothing to bank");
  }
  // Record a positive bank entry equal to CB (idempotency: we allow multiple but UI should prevent dupes)
  const entry = await prisma.bankEntry.create({
    data: { shipId, year, amount: snap.cbGco2eq, createdById: "SYSTEM", updatedById: "SYSTEM" }
  });
  return entry;
}

export async function applyBanked(shipId: string, year: number, amount: number) {
  if (amount <= 0) throw new Error("Amount must be > 0");

  // available = sum of all positive bank entries - negative (applied) entries
  const entries = await prisma.bankEntry.findMany({ where: { shipId, year } });
  const available = entries.reduce((s, e) => s + e.amount, 0);
  if (amount > available) throw new Error("Amount exceeds available banked surplus");

  // Store as negative entry (apply)
  return prisma.bankEntry.create({
    data: { shipId, year, amount: -Math.abs(amount), createdById: "SYSTEM", updatedById: "SYSTEM" }
  });
}
