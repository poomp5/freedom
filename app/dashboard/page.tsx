import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";
import { prefetch, trpc, HydrateClient } from "@/trpc/server";
import DashboardStats from "./DashboardStats";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = getUserRole(session!.user as Record<string, unknown>) ?? "user";

  await prefetch(trpc.dashboard.getStats.queryOptions());

  return (
    <div className="p-6 lg:p-8 w-full">
      {/* Welcome */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          สวัสดี, {session!.user.name}
        </h1>
        <p className="text-gray-500 mt-1">
          บทบาท:{" "}
          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium capitalize">
            {role}
          </span>
        </p>
      </div>

      <HydrateClient>
        <DashboardStats />
      </HydrateClient>
    </div>
  );
}
