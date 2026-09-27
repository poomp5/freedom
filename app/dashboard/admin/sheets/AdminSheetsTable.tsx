"use client";

import { useState } from "react";
import {
  Search,
  Trash2,
  Pencil,
  Star,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import EditSheetModal from "./EditSheetModal";

const LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const EXAM_TYPES = ["กลางภาค", "ปลายภาค"];
const TERMS = ["เทอม 1", "เทอม 2"];

interface SheetItem {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  examType: string;
  term: string;
  pdfUrl: string;
  uploader: { id: string; name: string; username: string | null; image: string | null };
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
}

export default function AdminSheetsTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const [editingSheet, setEditingSheet] = useState<SheetItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: sheets } = useSuspenseQuery(
    trpc.sheets.allSheets.queryOptions()
  );

  const deleteMutation = useMutation(
    trpc.sheets.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.sheets.allSheets.queryKey(),
        });
      },
    })
  );

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบชีทนี้หรือไม่?")) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync({ id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = sheets.filter((s) => {
    if (levelFilter && s.level !== levelFilter) return false;
    if (examTypeFilter && s.examType !== examTypeFilter) return false;
    if (termFilter && s.term !== termFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q) ||
        s.uploader.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อชีท, วิชา, ผู้อัปโหลด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกระดับชั้น</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={examTypeFilter}
          onChange={(e) => setExamTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกประเภทสอบ</option>
          {EXAM_TYPES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          value={termFilter}
          onChange={(e) => setTermFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกเทอม</option>
          {TERMS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
        แสดง {filtered.length} จาก {sheets.length} ชีท
      </p>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ชื่อชีท</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                  วิชา
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  ระดับชั้น
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                  ประเภท
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                  ผู้อัปโหลด
                </th>
                <th className="text-center px-4 py-3 font-medium">คะแนน</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  วันที่
                </th>
                <th className="text-center px-4 py-3 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((sheet) => (
                <tr
                  key={sheet.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">
                      {sheet.title}
                    </span>
                    <div className="text-xs text-gray-400 sm:hidden mt-0.5">
                      {sheet.subject} · {sheet.level}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {sheet.subject}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {sheet.level}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                    {sheet.examType} {sheet.term}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                    {sheet.uploader.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-700">
                        {sheet.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({sheet.totalRatings})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href={sheet.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                        title="ดู PDF"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setEditingSheet(sheet as SheetItem)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sheet.id)}
                        disabled={deletingId === sheet.id}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors p-1"
                        title="ลบชีท"
                      >
                        {deletingId === sheet.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    ไม่พบชีท
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSheet && (
        <EditSheetModal
          sheet={editingSheet}
          onClose={() => setEditingSheet(null)}
        />
      )}
    </div>
  );
}
