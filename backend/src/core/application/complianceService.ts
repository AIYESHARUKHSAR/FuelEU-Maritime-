import { prisma } from "../../adapters/outbound/postgres/prismaClient";
import { TARGET_INTENSITY_2025, ENERGY_PER_TONNE_MJ } from "./constants";

export function computeCB(actualIntensity: number, fuelTonnes: number, target = TARGET_INTENSITY_2025) {
  const energy = fuelTonnes * ENERGY_PER_TONNE_MJ;
  // Positive = surplus, Negative = deficit
  return (target - actualIntensity) * energy;
}

export async function getShipYearCB(shipId: string, year: number) {
  // If there are multiple routes for ship/year, aggregate energy-weighted average intensity
  const routes = await prisma.route.findMany({ where: { shipId, year } });
  if (routes.length === 0) return { shipId, year, cb: 0, details: [] };

  const totalEnergy = routes.reduce((s, r) => s + r.fuelConsumption * ENERGY_PER_TONNE_MJ, 0);
  const weightedIntensity = routes.reduce(
    (s, r) => s + r.ghgIntensity * (r.fuelConsumption * ENERGY_PER_TONNE_MJ),
    0
  ) / totalEnergy;

  const cb = computeCB(weightedIntensity, routes.reduce((s, r) => s + r.fuelConsumption, 0));
  return { shipId, year, cb, details: routes };
}

export async function snapshotCB(shipId: string, year: number) {
  const calc = await getShipYearCB(shipId, year);
  // upsert snapshot
  const snap = await prisma.shipCompliance.upsert({
    where: { shipId_year: { shipId, year } },
    update: { cbGco2eq: calc.cb },
    create: { shipId, year, cbGco2eq: calc.cb, createdById: "SYSTEM", updatedById: "SYSTEM" }
  });
  return snap;
}

export async function getAdjustedCB(shipId: string, year: number) {
  // base CB from snapshot (or compute if missing)
  let snap = await prisma.shipCompliance.findUnique({ where: { shipId_year: { shipId, year } }});
  if (!snap) snap = await snapshotCB(shipId, year);

  // add all bankEntries of that year for this ship
  const bank = await prisma.bankEntry.findMany({ where: { shipId, year } });
  const applied = bank.reduce((s, b) => s + b.amount, 0);
  return {
    shipId, year,
    cbBefore: snap.cbGco2eq,
    applied,
    cbAfter: snap.cbGco2eq + applied
  };
}
