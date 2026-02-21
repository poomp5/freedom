import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    userId: session?.user?.id || null,
    session,
  };
});

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  const role = getUserRole(session.user as Record<string, unknown>) ?? "user";
  return next({ ctx: { ...ctx, auth: session, role } });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
  }
  return next({ ctx });
});

export const publisherOrAdminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (ctx.role !== "publisher" && ctx.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
    }
    return next({ ctx });
  }
);