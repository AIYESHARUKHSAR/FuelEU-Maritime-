import express from "express";
import { prisma } from "../../outbound/postgres/prismaClient";

const router = express.Router();

router.post("/calc", async (req, res) => {
  try {
    const { routeIds } = req.body;

    if (!routeIds || routeIds.length === 0) {
      return res.status(400).json({ error: "No routeIds provided" });
    }

    // Fetch routes directly by IDs (no composite key)
    const routes = await prisma.route.findMany({
      where: { routeId: { in: routeIds } },
    });

    if (routes.length === 0)
      return res.status(404).json({ error: "Routes not found" });

    // Simple pooling logic → average of ghgIntensity
    const avgIntensity =
      routes.reduce((sum, r) => sum + (r.ghgIntensity ?? 0), 0) /
      routes.length;

    res.json({
      pooledRoutes: routes.map((r) => r.routeId),
      averageGHG: avgIntensity.toFixed(2),
      totalEmissions: routes.reduce(
        (sum, r) => sum + (r.totalEmissions ?? 0),
        0
      ),
    });
  } catch (err: any) {
    console.error("Pooling error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
