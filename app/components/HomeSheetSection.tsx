"use client";

import { useSession } from "@/lib/auth-client";
import { useMemo } from "react";
import Link from "next/link";
import SheetRow from "@/app/components/SheetRow";
import PaginationFooter from "@/app/components/PaginationFooter";
import { allSheets } from "@/app/components/searchData";
import { basePath } from "@/app/components/config";

const GRADE_MAP: Record<number, string> = {
  1: "ม.1", 2: "ม.2", 3: "ม.3", 4: "ม.4", 5: "ม.5", 6: "ม.6",
};

const LEVEL_COLORS: Record<string, string> = {
  "ม.1": "from-rose-500 to-pink-500",
  "ม.2": "from-orange-500 to-amber-500",
  "ม.3": "from-emerald-500 to-teal-500",
  "ม.4": "from-cyan-500 to-blue-500",
  "ม.5": "from-violet-500 to-purple-500",
  "ม.6": "from-fuchsia-500 to-pink-500",
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

  const sheets = useMemo(() => {
    return allSheets.filter(s => s.level === targetLevel && s.examType === "กลางภาค" && s.term === "เทอม 2");
  }, [targetLevel]);

  const levelNum = gradeLevel ?? 3;
  const mPrefix = `m${levelNum}`;
  const gradientClass = levelLabel ? LEVEL_COLORS[levelLabel] : LEVEL_COLORS["ม.3"];

  if (isPending) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-blue-50/50">
        <div className="px-4 mx-auto max-w-screen-xl md:mb-[4vh] mb-[12vh]">
          <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-blue-50/50">
      <div className="px-4 mx-auto max-w-screen-xl md:mb-[4vh] mb-[12vh]">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-800">ชีทสรุป {targetLevel}</h2>
              {levelLabel && (
                <span className={`px-2.5 py-0.5 rounded-full text-white text-xs font-medium bg-gradient-to-r ${gradientClass}`}>
                  ชั้นของคุณ
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {!session && !isPending
                ? "เข้าสู่ระบบเพื่อปรับแต่งหน้าหลักของคุณ"
                : "เลือกชีทที่ต้องการแล้วกดโหลดได้เลย"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!session && !isPending && (
              <Link
                href="/signin"
                className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            )}
            <Link
              href={`/${mPrefix}/${basePath}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ดูทั้งหมด →
            </Link>
          </div>
        </div>

        {sheets.length === 0 ? (
          <div className="w-full overflow-hidden rounded-2xl shadow-lg border border-blue-100 bg-white">
            <div className="py-12 text-center text-gray-400 text-sm">ไม่พบชีทในหมวดนี้</div>
            <PaginationFooter
              leftArrow={{ label: "เทอม 1", href: `/${mPrefix}/midterm1` }}
              rightArrow={{ label: "เทอม 2", href: `/${mPrefix}/midterm2` }}
              links={[
                { label: "กลางภาค", href: `/${mPrefix}/midterm2`, isActive: true },
                { label: "ปลายภาค", href: `/${mPrefix}/final2`, isActive: false },
              ]}
            />
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-2xl shadow-lg border border-blue-100 bg-white">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <th className="px-4 py-4">ชื่อวิชา</th>
                    <th className="px-4 py-4 whitespace-nowrap">รายละเอียด</th>
                    <th className="px-4 py-4">ไฟล์</th>
                    <th className="px-2 py-4">วันที่</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {sheets.map((sheet, i) => (
                    <SheetRow
                      key={i}
                      subject={sheet.subject}
                      filename={sheet.filename}
                      icon={sheet.icon}
                      date={""}
                      term={`${targetLevel} ${sheet.term}`}
                      examType={sheet.examType === "กลางภาค" ? "สอบกลางภาค" : "สอบปลายภาค"}
                      by={sheet.by ? { name: sheet.by, url: `https://instagram.com/${sheet.by}` } : undefined}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationFooter
              leftArrow={{ label: "เทอม 1", href: `/${mPrefix}/midterm1` }}
              rightArrow={{ label: "เทอม 2", href: `/${mPrefix}/midterm2` }}
              links={[
                { label: "กลางภาค", href: `/${mPrefix}/midterm2`, isActive: true },
                { label: "ปลายภาค", href: `/${mPrefix}/final2`, isActive: false },
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
}
