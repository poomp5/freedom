"use client";

import { Fragment, useMemo, useState } from "react";
import Avatar from "@/app/components/Avatar";
import { Search, ChevronDown, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown, Star, FileText, RefreshCw } from "lucide-react";
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

type SortKey = "name" | "email" | "sheets" | "role" | "createdAt";
type SortDir = "asc" | "desc";

/** Numbers and dates read best biggest/newest first; text reads best A→Z. */
const DEFAULT_DIR: Record<SortKey, SortDir> = {
  name: "asc",
  email: "asc",
  sheets: "desc",
  role: "asc",
  createdAt: "desc",
};

const COLUMN_COUNT = 7;

function SortHeader({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (column: SortKey) => void;
}) {
  const active = sortKey === column;
  const Icon = !active ? ChevronsUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      className="px-4 py-3 text-left font-medium text-gray-500"
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1 rounded-md transition-colors hover:text-gray-900 ${
          active ? "text-gray-900" : ""
        }`}
      >
        {label}
        <Icon size={14} className={active ? "text-blue-600" : "text-gray-300"} />
      </button>
    </th>
  );
}

/** Avatar with an admin-only button that re-pulls the picture from Google. */
function UserAvatar({
  userId,
  name,
  image,
}: {
  userId: string;
  name: string;
  image: string | null;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const refreshMutation = useMutation(
    trpc.users.refreshGoogleImage.mutationOptions({
      onSuccess: () => {
        setError(null);
        queryClient.invalidateQueries({ queryKey: trpc.users.list.queryKey() });
      },
      onError: (err) => setError(err.message),
    })
  );

  return (
    <div className="flex items-center gap-2">
      <Avatar src={image} name={name} seed={userId} size={32} />

      <button
        type="button"
        title={error ?? "ดึงรูปโปรไฟล์จาก Google"}
        onClick={(e) => {
          e.stopPropagation();
          setError(null);
          refreshMutation.mutate({ userId });
        }}
        disabled={refreshMutation.isPending}
        className={`shrink-0 rounded-full p-1 transition-colors disabled:opacity-50 ${
          error
            ? "text-red-500 hover:bg-red-50"
            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        <RefreshCw
          size={13}
          className={refreshMutation.isPending ? "animate-spin" : ""}
        />
      </button>
    </div>
  );
}

/** Admin editor for a user's donation PromptPay number. */
function DonatePromptPayRow({
  userId,
  initial,
}: {
  userId: string;
  initial: string | null;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(initial ?? "");
  const [saved, setSaved] = useState(false);

  const mutation = useMutation(
    trpc.users.setDonatePromptPay.mutationOptions({
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
        queryClient.invalidateQueries({ queryKey: trpc.users.list.queryKey() });
      },
    })
  );

  return (
    <tr className="bg-gray-50">
      <td colSpan={COLUMN_COUNT} className="px-0 py-0">
        <div className="ml-8 mr-4 mt-3 rounded-xl border border-gray-200 bg-white p-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            พร้อมเพย์สำหรับรับโดเนท (เบอร์โทร 10 หลัก หรือเลขบัตรประชาชน 13 หลัก)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="เว้นว่างเพื่อปิดการรับโดเนท"
              className="min-w-[220px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                mutation.mutate({ userId, donatePromptPay: value });
              }}
              disabled={mutation.isPending}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            >
              {saved ? "บันทึกแล้ว" : mutation.isPending ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
          {mutation.error && (
            <p className="mt-2 text-sm text-red-600">{mutation.error.message}</p>
          )}
        </div>
      </td>
    </tr>
  );
}

function UserSheetRows({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const { data: sheets, isLoading } = useQuery(
    trpc.users.getUserSheets.queryOptions({ userId })
  );

  if (isLoading) {
    return (
      <tr>
        <td colSpan={COLUMN_COUNT} className="px-8 py-4 bg-gray-50 text-center text-gray-400 text-sm">
          กำลังโหลด...
        </td>
      </tr>
    );
  }

  if (!sheets || sheets.length === 0) {
    return (
      <tr>
        <td colSpan={COLUMN_COUNT} className="px-8 py-4 bg-gray-50 text-center text-gray-400 text-sm">
          ไม่มีชีท
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className="bg-gray-50">
        <td colSpan={COLUMN_COUNT} className="px-0 py-0">
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

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (column: SortKey) => {
    if (column === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column);
      setSortDir(DEFAULT_DIR[column]);
    }
  };

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of users) counts[u.role ?? "user"] = (counts[u.role ?? "user"] ?? 0) + 1;
    return counts;
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = users.filter((u) => {
      if (roleFilter !== "all" && (u.role ?? "user") !== roleFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.username ?? "").toLowerCase().includes(q)
      );
    });

    const value = (u: (typeof users)[number]): string | number => {
      switch (sortKey) {
        case "name":
          return u.name.toLowerCase();
        case "email":
          return u.email.toLowerCase();
        case "sheets":
          return u._count?.sheets ?? 0;
        case "role":
          return ROLE_LABELS[u.role ?? "user"] ?? u.role ?? "";
        case "createdAt":
          return new Date(u.createdAt).getTime();
      }
    };

    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "th");
      // Ties fall back to newest first so the order is stable.
      return cmp * dir || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [users, search, roleFilter, sortKey, sortDir]);

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

  // Every row expands: even a user with no sheets has a PromptPay field to edit.
  const toggleExpand = (userId: string) => {
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
          placeholder="ค้นหาชื่อ, @username หรืออีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", ...ROLES].map((r) => {
          const count = r === "all" ? users.length : roleCounts[r] ?? 0;
          const active = roleFilter === r;
          return (
            <button
              key={r}
              type="button"
              aria-pressed={active}
              onClick={() => setRoleFilter(r)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              {r === "all" ? "ทั้งหมด" : ROLE_LABELS[r]}
              <span className={`tabular-nums ${active ? "text-blue-100" : "text-gray-400"}`}>{count}</span>
            </button>
          );
        })}
        <span className="ml-auto text-xs text-gray-400">แสดง {filtered.length} คน</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-8"></th>
                <SortHeader label="ชื่อ" column="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="อีเมล" column="email" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="ชีท" column="sheets" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="บทบาท" column="role" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortHeader label="สมัครเมื่อ" column="createdAt" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
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
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpand(user.id)}
                    >
                      <td className="pl-3 py-3 text-gray-400">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            userId={user.id}
                            name={user.name}
                            image={user.image}
                          />
                          <div className="min-w-0">
                            <p>{user.name}</p>
                            {user.username && (
                              <p className="text-xs font-normal text-gray-400">@{user.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
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
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
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
                    {isExpanded && (
                      <DonatePromptPayRow
                        userId={user.id}
                        initial={user.donatePromptPay ?? null}
                      />
                    )}
                    {isExpanded && sheetCount > 0 && <UserSheetRows userId={user.id} />}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={COLUMN_COUNT} className="px-4 py-8 text-center text-gray-400">
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
