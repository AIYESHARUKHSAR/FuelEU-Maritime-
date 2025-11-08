import { ComplianceRepo } from "../../../core/ports/complianceRepo";
import { prisma } from "./prismaClient";

export const complianceRepoPrisma: ComplianceRepo = {
  async upsertCB({ shipId, year, cb }) {
    const rec = await prisma.shipCompliance.upsert({
      where: { shipId_year: { shipId, year } },
      update: { cbGco2eq: cb },
      create: { shipId, year, cbGco2eq: cb }
    });
    return { shipId, year, cb: rec.cbGco2eq };
  },
  async getCB(shipId, year) {
    const r = await prisma.shipCompliance.findFirst({ where: { shipId, year }});
    return r ? { shipId, year, cb: r.cbGco2eq } : null;
  }
};
