import { createTRPCRouter, protectedProcedure } from "../init";
import { prisma } from "@/lib/prisma";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.role === "admin";

    if (!isAdmin) {
      return {
        isAdmin: false,
        totalUsers: 0,
        pendingRequests: 0,
        totalSheets: 0,
        totalPublishers: 0,
      };
    }

    const [totalUsers, pendingRequests, totalSheets, totalPublishers] =
      await Promise.all([
        prisma.user.count(),
        prisma.publisherRequest.count({ where: { status: "pending" } }),
        prisma.sheet.count(),
        prisma.user.count({ where: { role: "publisher" } }),
      ]);

    return {
      isAdmin: true,
      totalUsers,
      pendingRequests,
      totalSheets,
      totalPublishers,
    };
  }),
});
