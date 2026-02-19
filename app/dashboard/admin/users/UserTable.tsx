"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const ROLES = ["user", "admin", "publisher", "suspended", "pending_publisher"] as const;

const ROLE_LABELS: Record<string, string> = {
  user: "ผู้ใช้",
  admin: "ผู้ดูแล",
  publisher: "ผู้เผยแพร่",
  suspended: "ระงับ",
  pending_publisher: "รอการอนุมัติ",
};

const ROLE_COLORS: Record<string, string> = {
  user: "bg-gray-100 text-gray-700",
  admin: "bg-blue-100 text-blue-700",
  publisher: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  pending_publisher: "bg-orange-100 text-orange-700",
};

export default function UserTable({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: users } = useSuspenseQuery(trpc.users.list.queryOptions());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const updateRoleMutation = useMutation(
    trpc.users.updateRole.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.queryKey(),
        });
      },
    })
  );

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUserId) return;
    setLoading(userId);
    try {
      await updateRoleMutation.mutateAsync({
        userId,
        role: newRole as (typeof ROLES)[number],
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="ค้นหาชื่อหรืออีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">ชื่อ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">อีเมล</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">บทบาท</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">เปลี่ยนบทบาท</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${ROLE_COLORS[user.role ?? "user"] || "bg-gray-100 text-gray-700"}`}
                    >
                      {ROLE_LABELS[user.role ?? "user"] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.id === currentUserId ? (
                      <span className="text-xs text-gray-400">คุณ</span>
                    ) : (
                      <select
                        value={user.role ?? "user"}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={loading === user.id}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    ไม่พบผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
