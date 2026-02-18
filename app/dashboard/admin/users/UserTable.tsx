"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
}

const ROLES = ["user", "admin", "publisher", "suspended", "pending_publisher"];

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
  users: initialUsers,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUserId) return;
    setLoading(userId);
    try {
      const res = await fetch(`/api/dashboard/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {/* Search */}
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  ชื่อ
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  อีเมล
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  บทบาท
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  เปลี่ยนบทบาท
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"}`}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.id === currentUserId ? (
                      <span className="text-xs text-gray-400">คุณ</span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
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
