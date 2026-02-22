"use client";

import { Fragment, useState } from "react";
import { Search, ChevronDown, ChevronRight, Star, FileText } from "lucide-react";
import { useSuspenseQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

function UserSheetRows({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const { data: sheets, isLoading } = useQuery(
    trpc.users.getUserSheets.queryOptions({ userId })
  );

  if (isLoading) {
    return (
      <tr>
        <td colSpan={6} className="px-8 py-4 bg-gray-50 text-center text-gray-400 text-sm">
          กำลังโหลด...
        </td>
      </tr>
    );
  }

  if (!sheets || sheets.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-8 py-4 bg-gray-50 text-center text-gray-400 text-sm">
          ไม่มีชีท
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className="bg-gray-50">
        <td colSpan={6} className="px-0 py-0">
          <div className="ml-8 mr-4 my-3 rounded-xl border border-gray-200 overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">ชื่อชีท</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">วิชา</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">ระดับ</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">ประเภท</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">คะแนน</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {sheets.map((sheet) => (
                  <tr key={sheet.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-2">
                      <a
                        href={sheet.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FileText size={14} />
                        {sheet.title}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{sheet.subject}</td>
                    <td className="px-4 py-2 text-gray-600">ม.{sheet.level}</td>
                    <td className="px-4 py-2 text-gray-600">{sheet.examType} / เทอม {sheet.term}</td>
                    <td className="px-4 py-2 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        {sheet.averageRating} ({sheet.totalRatings})
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-400 text-xs">
                      {new Date(sheet.createdAt).toLocaleDateString("th-TH")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
}

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
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

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

  const toggleExpand = (userId: string, sheetCount: number) => {
    if (sheetCount === 0) return;
    setExpandedUserId((prev) => (prev === userId ? null : userId));
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
                <th className="w-8"></th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">ชื่อ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">อีเมล</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">ชีท</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">บทบาท</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">เปลี่ยนบทบาท</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const sheetCount = user._count?.sheets ?? 0;
                const isExpanded = expandedUserId === user.id;
                return (
                  <Fragment key={user.id}>
                    <tr
                      className={`border-b border-gray-50 hover:bg-gray-50 ${sheetCount > 0 ? "cursor-pointer" : ""}`}
                      onClick={() => toggleExpand(user.id, sheetCount)}
                    >
                      <td className="pl-3 py-3 text-gray-400">
                        {sheetCount > 0 ? (
                          isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                      <td className="px-4 py-3 text-gray-500">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {sheetCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            <FileText size={12} />
                            {sheetCount}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${ROLE_COLORS[user.role ?? "user"] || "bg-gray-100 text-gray-700"}`}
                        >
                          {ROLE_LABELS[user.role ?? "user"] || user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
                    {isExpanded && <UserSheetRows userId={user.id} />}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
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
