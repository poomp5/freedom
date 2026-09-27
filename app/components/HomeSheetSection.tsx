"use client";

import { useSession } from "@/lib/auth-client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import HomeSheetCard from "@/app/components/HomeSheetCard";
import { allSheets } from "@/app/components/searchData";
import { basePath } from "@/app/components/config";

const GRADE_MAP: Record<number, string> = {
  1: "ม.1", 2: "ม.2", 3: "ม.3", 4: "ม.4", 5: "ม.5", 6: "ม.6",
};

export default function HomeSheetSection() {
  const { data: session, isPending } = useSession();

  const gradeLevel = useMemo(() => {
    if (!session) return null;
    const g = (session.user as Record<string, unknown>).gradeLevel as number | undefined;
    return g ?? null;
  }, [session]);

  const levelLabel = gradeLevel ? GRADE_MAP[gradeLevel] : null;

  // If user has a grade, show sheets for that level; otherwise show m3 default
  const targetLevel = levelLabel ?? "ม.3";

  // Map basePath → examType + term filters
  const pathExamType = basePath.startsWith("midterm") ? "กลางภาค" : "ปลายภาค";
  const pathTerm = basePath.endsWith("1") ? "เทอม 1" : "เทอม 2";

  const sheets = useMemo(() => {
    return allSheets.filter(s => s.level === targetLevel && s.examType === pathExamType && s.term === pathTerm);
  }, [targetLevel, pathExamType, pathTerm]);

  const levelNum = gradeLevel ?? 3;
  const mPrefix = `m${levelNum}`;

  if (isPending) {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <FileText className="h-3.5 w-3.5" />
              {targetLevel}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ชีทสรุป {targetLevel}
            </h2>
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
              href={`/${mPrefix}/${basePath}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              ดูชีททั้งหมด
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {sheets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">ไม่พบชีทในหมวดนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sheets.map((sheet, i) => (
              <HomeSheetCard
                key={i}
                subject={sheet.subject}
                filename={sheet.filename}
                level={targetLevel}
                term={sheet.term}
                examType={sheet.examType}
                by={sheet.by}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
