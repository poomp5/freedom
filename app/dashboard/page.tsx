import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdmin, getUserRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = getUserRole(session!.user as Record<string, unknown>) ?? "user";
  const admin = isAdmin(role);

  let totalUsers = 0;
  let pendingRequests = 0;

  if (admin) {
    [totalUsers, pendingRequests] = await Promise.all([
      prisma.user.count(),
      prisma.publisherRequest.count({ where: { status: "pending" } }),
    ]);
  }

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

      {admin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">ผู้ใช้ทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {totalUsers}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">คำขอรอดำเนินการ</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">
              {pendingRequests}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500">
            ยินดีต้อนรับสู่แดชบอร์ดผู้เผยแพร่ ฟีเจอร์ใหม่จะพร้อมใช้งานเร็วๆ
            นี้
          </p>
        </div>
      )}
    </div>
  );
}
