"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, Sparkles, Upload } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import CommunitySheetCard from "@/app/components/CommunitySheetCard";
import { SHEETS_LIST_STALE_TIME } from "@/app/sheets/queryOptions";

export default function CommunityUpdates() {
  const trpc = useTRPC();
  const { data: sheets = [], isLoading } = useQuery(
    trpc.sheets.list.queryOptions({}, { staleTime: SHEETS_LIST_STALE_TIME, refetchOnWindowFocus: false })
  );

  // The list is already sorted newest first.
  const latestSheets = useMemo(() => sheets.slice(0, 8), [sheets]);

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              New updates
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ชีทใหม่ล่าสุด
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              อัปเดตล่าสุดจากผู้เผยแพร่ใน Freedom เลือกดูตามชั้น วิชา และเทอมได้ในหน้าชีททั้งหมด
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/publisher/sheets"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Upload className="h-4 w-4" />
              อัปโหลดชีท
            </Link>
            <Link
              href="/sheets"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              ดูชีททั้งหมด
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-40 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        ) : latestSheets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              ยังไม่มีชีทสรุป
            </p>
            <Link
              href="/dashboard/publisher/sheets"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              เริ่มอัปโหลดชีทแรก
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestSheets.map((sheet) => (
              <CommunitySheetCard key={sheet.id} sheet={sheet} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
