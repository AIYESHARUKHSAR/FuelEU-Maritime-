import { prisma } from "../../adapters/outbound/postgres/prismaClient";

export async function listRoutes(filters?: {
  vesselType?: string; fuelType?: string; year?: number;
}) {
  const where: any = {};
  if (filters?.vesselType) where.vesselType = filters.vesselType;
  if (filters?.fuelType)   where.fuelType   = filters.fuelType;
  if (filters?.year)       where.year       = Number(filters.year);
  return prisma.route.findMany({ where, orderBy: [{ year: "asc" }, { routeId: "asc" }] });
}

export async function setBaseline(routeId: string) {
  const route = await prisma.route.findUnique({ where: { routeId } });
  if (!route) throw new Error("Route not found");

  // Clear other baselines for same ship-year
  await prisma.route.updateMany({
    where: { shipId: route.shipId, year: route.year, isBaseline: true },
    data:  { isBaseline: false }
  });
  // Set this one as baseline
  return prisma.route.update({ where: { routeId }, data: { isBaseline: true } });
}

export async function getComparison() {
  // baseline per ship-year
  const baselines = await prisma.route.findMany({ where: { isBaseline: true }});
  const others    = await prisma.route.findMany({ where: { isBaseline: false }});

  // map baseline key
  const baseKey = (r: any) => `${r.shipId}-${r.year}`;
  const baseMap = new Map(baselines.map(b => [baseKey(b), b]));

  const rows = others.map(o => {
    const key = baseKey(o);
    const b   = baseMap.get(key);
    const baselineVal   = b?.ghgIntensity ?? null;
    const comparisonVal = o.ghgIntensity;
    const percentDiff   = baselineVal ? ((comparisonVal / baselineVal) - 1) * 100 : null;
    const target = 89.3368; // shown in UI too
    const compliant = comparisonVal <= target;
    return {
      shipId: o.shipId,
      year: o.year,
      routeIdBaseline: b?.routeId ?? null,
      routeIdComparison: o.routeId,
      baseline: baselineVal,
      comparison: comparisonVal,
      percentDiff,
      compliant,
    };
  });

  return rows;
}
