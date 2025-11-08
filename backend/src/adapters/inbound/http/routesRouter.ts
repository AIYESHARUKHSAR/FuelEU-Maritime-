import { Router } from "express";
import prisma from "../../outbound/postgres/prismaClient";

// constants
const TARGET_2025 = 89.3368;          // gCO2e/MJ
const ENERGY_PER_TONNE = 41_000;      // MJ per tonne

const router = Router();

/**
 * GET /api/routes
 * Optional filters: vesselType, fuelType, year
 */
router.get("/", async (req, res) => {
  try {
    const { vesselType, fuelType, year } = req.query;

    const routes = await prisma.route.findMany({
      where: {
        ...(vesselType ? { vesselType: String(vesselType) } : {}),
        ...(fuelType ? { fuelType: String(fuelType) } : {}),
        ...(year ? { year: Number(year) } : {}),
      },
      orderBy: { id: "asc" },
    });

    res.json(routes);
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Failed to fetch routes" });
  }
});

/**
 * POST /api/routes/:routeId/baseline
 * Marks this route as baseline, unsets others for the same year/ship.
 */
router.post("/:routeId/baseline", async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await prisma.route.findUnique({ where: { routeId } });
    if (!route) return res.status(404).json({ error: "Route not found" });

    // Unset all baselines for same ship+year
    await prisma.route.updateMany({
      where: { shipId: route.shipId, year: route.year, isBaseline: true },
      data: { isBaseline: false },
    });

    const updated = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });

    res.json({ ok: true, baseline: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Failed to set baseline" });
  }
});

/**
 * GET /api/routes/comparison
 * Returns baseline vs others for same year with percentDiff & compliant.
 */
router.get("/comparison", async (_req, res) => {
  try {
    // pick *a* baseline per (shipId, year)
    const baselines = await prisma.route.findMany({
      where: { isBaseline: true },
    });

    // For each baseline, compare to routes in the same year (all ships)
    const allRoutes = await prisma.route.findMany();

    const rows = baselines.flatMap((base) => {
      const sameYear = allRoutes.filter((r) => r.year === base.year);
      return sameYear.map((r) => {
        const percentDiff = ((r.ghgIntensity / base.ghgIntensity) - 1) * 100;
        const compliant = r.ghgIntensity <= TARGET_2025;
        return {
          year: r.year,
          baselineRouteId: base.routeId,
          comparisonRouteId: r.routeId,
          baselineGHG: base.ghgIntensity,
          comparisonGHG: r.ghgIntensity,
          percentDiff,
          compliant,
        };
      });
    });

    res.json({ target: TARGET_2025, rows });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Failed to compute comparison" });
  }
});

export default router;
