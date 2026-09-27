import { headers } from "next/headers";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";
import { prefetch, trpc, HydrateClient } from "@/trpc/server";
import Avatar from "@/app/components/Avatar";
import DashboardStats from "./DashboardStats";
import DashboardAnalytics from "./DashboardAnalytics";

const ROLE_LABELS: Record<string, string> = {
  admin: "ผู้ดูแลระบบ",
  publisher: "ผู้เผยแพร่",
  user: "ผู้ใช้งาน",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session!.user as NonNullable<typeof session>["user"] & { username?: string | null };
  const role = getUserRole(user as Record<string, unknown>) ?? "user";

  await Promise.all([
    prefetch(trpc.dashboard.getStats.queryOptions()),
    prefetch(trpc.analytics.overview.queryOptions({ days: 30 })),
  ]);

  return (
    <div className="p-6 lg:p-8 w-full">
      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6 flex flex-wrap items-center gap-4">
        <Avatar src={user.image} name={user.name} seed={user.id} size={64} className="ring-4 ring-blue-50" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
            สวัสดี, {user.name}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
              {ROLE_LABELS[role] ?? role}
            </span>
            {user.username && <span>@{user.username}</span>}
            <span className="truncate">{user.email}</span>
          </div>
        </div>
        <Link
          href={`/u/${user.username ?? user.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          ดูโปรไฟล์สาธารณะ
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <HydrateClient>
        <DashboardStats />
        <DashboardAnalytics />
      </HydrateClient>
    </div>
  );
}
