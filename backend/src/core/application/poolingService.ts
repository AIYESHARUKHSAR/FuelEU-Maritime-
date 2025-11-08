import { prisma } from "../../adapters/outbound/postgres/prismaClient";

export type PoolMemberInput = { shipId: string; year: number };

export async function createPool(year: number, members: PoolMemberInput[]) {
  // Fetch adjusted CB for each ship (snapshot + bank entries)
  const snaps = await Promise.all(members.map(async m => {
    const snap = await prisma.shipCompliance.findUnique({ where: { shipId_year: { shipId: m.shipId, year } }});
    const base = snap?.cbGco2eq ?? 0;
    const bank = await prisma.bankEntry.findMany({ where: { shipId: m.shipId, year }});
    const applied = bank.reduce((s, b) => s + b.amount, 0);
    const adjusted = base + applied;
    return { shipId: m.shipId, cbBefore: adjusted };
  }));

  const sum = snaps.reduce((s, n) => s + n.cbBefore, 0);
  if (sum < 0) throw new Error("Pool sum must be >= 0");

  // Greedy transfer: sort by cb desc (surplus first), then move to deficits
  const surplus = snaps.filter(s => s.cbBefore > 0).sort((a,b) => b.cbBefore - a.cbBefore);
  const deficit = snaps.filter(s => s.cbBefore < 0).sort((a,b) => a.cbBefore - b.cbBefore); // more negative first

  for (const s of surplus) {
    for (const d of deficit) {
      if (s.cbBefore <= 0) break;
      if (d.cbBefore >= 0) continue;

      const transfer = Math.min(s.cbBefore, -d.cbBefore);
      s.cbBefore -= transfer;
      d.cbBefore += transfer;
    }
  }

  // Validate rules:
  // - no deficit ship exits worse
  // - no surplus ship exits negative
  const after = [...surplus, ...deficit];
  for (const a of after) {
    const before = snaps.find(x => x.shipId === a.shipId)!.cbBefore;
    if (before < 0 && a.cbBefore < before) throw new Error("Deficit ship exits worse");
    if (before > 0 && a.cbBefore < 0)    throw new Error("Surplus ship exits negative");
  }

  // Persist pool + members
  const pool = await prisma.pool.create({
    data: {
      year,
      createdById: "SYSTEM",
      updatedById: "SYSTEM",
      members: {
        create: after.map(a => ({
          shipId: a.shipId,
          cbBefore: snaps.find(x => x.shipId === a.shipId)!.cbBefore,
          cbAfter:  a.cbBefore,
          createdById: "SYSTEM",
          updatedById: "SYSTEM",
        }))
      }
    },
    include: { members: true }
  });

  return pool;
}
