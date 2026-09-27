"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function DashboardStats() {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(
    trpc.dashboard.getStats.queryOptions()
  );

  if (!stats.isAdmin) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500">
          ยินดีต้อนรับสู่แดชบอร์ดผู้เผยแพร่ ฟีเจอร์ใหม่จะพร้อมใช้งานเร็วๆ
          นี้
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-500">ผู้ใช้ทั้งหมด</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          {stats.totalUsers}
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-500">คำขอรอดำเนินการ</p>
        <p className="text-3xl font-bold text-orange-600 mt-1">
          {stats.pendingRequests}
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-500">ชีททั้งหมด</p>
        <p className="text-3xl font-bold text-blue-600 mt-1">
          {stats.totalSheets}
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-500">ผู้เผยแพร่ทั้งหมด</p>
        <p className="text-3xl font-bold text-green-600 mt-1">
          {stats.totalPublishers}
        </p>
      </div>
    </div>
  );
}
