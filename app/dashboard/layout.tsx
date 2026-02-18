import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessDashboard, getUserRole } from "@/lib/roles";
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

  if (!session) {
    redirect("/signin");
  }

  const role = getUserRole(session.user as Record<string, unknown>) ?? "user";

  if (!canAccessDashboard(role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role={role} userName={session.user.name} />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}
