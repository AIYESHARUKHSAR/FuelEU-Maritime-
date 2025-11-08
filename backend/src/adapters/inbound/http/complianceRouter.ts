import express from "express";
import { prisma } from "../../outbound/postgres/prismaClient";

const router = express.Router();

/**
 * ✅ Get all compliance records
 * Example: GET http://localhost:4000/api/compliance
 */
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.shipCompliance.findMany();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching compliance:", err);
    res.status(500).json({ error: "Failed to fetch compliance data" });
  }
});

/**
 * ✅ Compare compliance data with a baseline
 * Example: GET http://localhost:4000/api/compliance/compare
 */
router.get("/compare", async (_req, res) => {
  try {
    const BASELINE = 90;

    const complianceData = await prisma.shipCompliance.findMany();

    const comparison = complianceData.map((record) => {
      const difference = record.ghgIntensity - BASELINE;

      return {
        shipId: record.shipId,
        year: record.year,
        ghgIntensity: record.ghgIntensity,
        baselineDifference: difference,
        status:
          difference > 0
            ? "Above Baseline"
            : difference < 0
            ? "Below Baseline"
            : "At Baseline",
      };
    });

    res.json(comparison);
  } catch (err) {
    console.error("❌ Error in compare route:", err);
    res.status(500).json({ error: "Failed to compare compliance data" });
  }
});

export default router;
