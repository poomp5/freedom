"use client";

import { useSession } from "@/lib/auth-client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import CommunitySheetCard from "@/app/components/CommunitySheetCard";
import { SHEETS_LIST_STALE_TIME } from "@/app/sheets/queryOptions";

const LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const DEFAULT_LEVEL = "ม.6";
const MAX_CARDS = 8;

/** Sheets for one grade, pulled from the same cached list as /sheets. */
export default function HomeSheetSection() {
  const trpc = useTRPC();
  const { data: session } = useSession();
  const { data: sheets = [], isLoading } = useQuery(
    trpc.sheets.list.queryOptions({}, { staleTime: SHEETS_LIST_STALE_TIME, refetchOnWindowFocus: false })
  );

  const userLevel = useMemo(() => {
    const g = (session?.user as Record<string, unknown> | undefined)?.gradeLevel;
    return typeof g === "number" && g >= 1 && g <= 6 ? `ม.${g}` : null;
  }, [session]);

  // An explicit pick wins; otherwise follow the signed-in user's grade.
  const [pickedLevel, setPickedLevel] = useState<string | null>(null);
  const level = pickedLevel ?? userLevel ?? DEFAULT_LEVEL;

  const levelSheets = useMemo(() => sheets.filter((s) => s.level === level), [sheets, level]);

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <FileText className="h-3.5 w-3.5" />
              {level === userLevel ? `ชั้นของคุณ · ${level}` : level}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">ชีทสรุป {level}</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {session
                ? "เลือกชีทที่ต้องการแล้วกดโหลดได้เลย"
                : "เข้าสู่ระบบเพื่อให้หน้านี้แสดงชีทตรงกับชั้นของคุณ"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!session && (
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                เข้าสู่ระบบ
              </Link>
            )}
            <Link
              href={`/sheets?level=${encodeURIComponent(level)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              ดูชีท {level} ทั้งหมด ({levelSheets.length})
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="เลือกระดับชั้น">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={l === level}
              onClick={() => setPickedLevel(l)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                l === level
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: MAX_CARDS }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
            ))}
          </div>
        ) : levelSheets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">ยังไม่มีชีทสรุป {level}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {levelSheets.slice(0, MAX_CARDS).map((sheet) => (
              <CommunitySheetCard key={sheet.id} sheet={sheet} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
