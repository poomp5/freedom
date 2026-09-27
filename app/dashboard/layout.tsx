import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";
import DashboardSidebar from "./components/DashboardSidebar";

export const metadata = {
  title: "แดชบอร์ด | FREEDOM",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Middleware handles redirect for unauthenticated/unauthorized users.
  // Session is fetched here only for sidebar data.
  const role = getUserRole(session!.user as Record<string, unknown>) ?? "user";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role={role} userName={session!.user.name} />
      <main className="flex-1 min-h-screen pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
