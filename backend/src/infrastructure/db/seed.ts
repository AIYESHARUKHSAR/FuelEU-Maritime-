import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

async function main() {
  console.log("🧹 Cleaning DB...");

  // Clean in FK-safe order
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();
  await prisma.ship.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creating SYSTEM admin user...");

  const admin = await prisma.user.create({
    data: {
      id: "SYSTEM",
      name: "System Admin",
      email: "admin@example.com",
      passwordHash: hashPassword("admin123"),
      role: "ADMIN"
    }
  });

  console.log("🚢 Inserting ships...");

  await prisma.ship.createMany({
    data: [
      { id: "SHIP-001", name: "Aurora", createdById: admin.id, updatedById: admin.id },
      { id: "SHIP-002", name: "Baltic", createdById: admin.id, updatedById: admin.id },
      { id: "SHIP-003", name: "Calypso", createdById: admin.id, updatedById: admin.id }
    ]
  });

  console.log("🛣️ Inserting routes...");

  await prisma.route.createMany({
    data: [
      { routeId: "R001", shipId: "SHIP-001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true, createdById: admin.id, updatedById: admin.id },
      { routeId: "R002", shipId: "SHIP-002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false, createdById: admin.id, updatedById: admin.id },
      { routeId: "R003", shipId: "SHIP-003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false, createdById: admin.id, updatedById: admin.id },
      { routeId: "R004", shipId: "SHIP-001", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false, createdById: admin.id, updatedById: admin.id },
      { routeId: "R005", shipId: "SHIP-002", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false, createdById: admin.id, updatedById: admin.id }
    ]
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
