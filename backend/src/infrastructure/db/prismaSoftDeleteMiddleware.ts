import type { Prisma } from "@prisma/client";

const SOFT_DELETE_MODELS = new Set(["Ship", "Route", "Pool"]);

export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    // Auto-exclude soft-deleted rows from reads
    if (
      (params.action === "findMany" || params.action === "findFirst" || params.action === "count") &&
      SOFT_DELETE_MODELS.has(params.model!)
    ) {
      const where = (params.args?.where ?? {}) as Record<string, any>;
      if (where.deletedAt === undefined) {
        params.args = { ...params.args, where: { AND: [{ deletedAt: null }, where] } };
      }
    }

    // Transform delete → soft delete (update deletedAt)
    if (params.action === "delete" && SOFT_DELETE_MODELS.has(params.model!)) {
      params.action = "update";
      params.args["data"] = { ...(params.args["data"] ?? {}), deletedAt: new Date() };
    }

    // Transform deleteMany → soft delete (updateMany)
    if (params.action === "deleteMany" && SOFT_DELETE_MODELS.has(params.model!)) {
      params.action = "updateMany";
      params.args["data"] = { ...(params.args["data"] ?? {}), deletedAt: new Date() };
    }

    return next(params);
  };
}
