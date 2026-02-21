"use client";

import { useState } from "react";
import { Trash2, FileText, Star, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface SheetItem {
  id: string;
  title: string;
  subject: string;
  level: string;
  examType: string;
  term: string;
  pdfUrl: string;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
}

export default function MySheets({
  initialSheets,
}: {
  initialSheets: SheetItem[];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [sheets, setSheets] = useState(initialSheets);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation(
    trpc.sheets.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.sheets.mySheets.queryKey(),
        });
      },
    })
  );

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบชีทนี้หรือไม่?")) return;

    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync({ id });
      setSheets((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  if (sheets.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">ยังไม่มีชีทที่อัปโหลด</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">ชื่อชีท</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">วิชา</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">ระดับชั้น</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">ประเภท</th>
              <th className="text-center px-4 py-3 font-medium">คะแนน</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">วันที่</th>
              <th className="text-center px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sheets.map((sheet) => (
              <tr key={sheet.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <a
                    href={sheet.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {sheet.title}
                  </a>
                  <div className="text-xs text-gray-400 sm:hidden mt-0.5">
                    {sheet.subject} · {sheet.level}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{sheet.subject}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{sheet.level}</td>
                <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                  {sheet.examType} {sheet.term}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-700">{sheet.averageRating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({sheet.totalRatings})</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                  {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-center">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
