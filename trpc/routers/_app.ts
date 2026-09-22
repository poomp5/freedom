import { createTRPCRouter } from "../init";
import { sheetsRouter } from "./sheets";
import { schoolsRouter } from "./schools";
import { usersRouter } from "./users";
import { publisherRequestsRouter } from "./publisher-requests";
import { dashboardRouter } from "./dashboard";
import { uploadRouter } from "./upload";
import { paymentsRouter } from "./payments";
import { settingsRouter } from "./settings";
import { commentsRouter } from "./comments";

export const appRouter = createTRPCRouter({
  sheets: sheetsRouter,
  schools: schoolsRouter,
  users: usersRouter,
  publisherRequests: publisherRequestsRouter,
  dashboard: dashboardRouter,
  upload: uploadRouter,
  payments: paymentsRouter,
  settings: settingsRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
