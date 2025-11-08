import { RouteRepo } from "../../../core/ports/routeRepo";
import { prisma } from "./prismaClient";

export const routeRepoPrisma: RouteRepo = {
  async getAll() { return prisma.route.findMany(); },
  async getBaseline() { return prisma.route.findFirst({ where: { isBaseline: true }}); },
  async setBaseline(routeId: string) {
    await prisma.route.updateMany({ data: { isBaseline: false }, where: { isBaseline: true }});
    await prisma.route.update({ where: { routeId }, data: { isBaseline: true }});
  }
};
