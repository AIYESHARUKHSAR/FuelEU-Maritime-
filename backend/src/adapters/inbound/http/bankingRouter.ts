import express from "express";
import { prisma } from "../../outbound/postgres/prismaClient";

const router = express.Router();

router.post("/calc", async (req, res) => {
  try {
    const { routeId } = req.body;
    if (!routeId) return res.status(400).json({ error: "routeId required" });

    const route = await prisma.route.findUnique({ where: { routeId } });
    if (!route) return res.status(404).json({ error: "Route not found" });

    // Simple logic: banking = baseline - totalEmissions
    const baseline = 4500;
    const balance = baseline - (route.totalEmissions ?? 0);

    res.json({
      routeId,
      baseline,
      totalEmissions: route.totalEmissions,
      balance,
      status: balance >= 0 ? "Credits Earned" : "Debits Owed",
    });
  } catch (err: any) {
    console.error("Banking error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
