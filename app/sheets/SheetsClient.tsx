"use client";

import { useState, useMemo } from "react";
import { FileText, User, Calendar, ExternalLink } from "lucide-react";
import StarRating from "@/app/components/StarRating";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const LEVELS = ["ทั้งหมด", "ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const EXAM_TYPES = ["ทั้งหมด", "กลางภาค", "ปลายภาค"];
const TERMS = ["ทั้งหมด", "เทอม 1", "เทอม 2"];

export default function SheetsClient({
  isLoggedIn,
  userId,
}: {
  isLoggedIn: boolean;
  userId: string | null;
}) {
  const trpc = useTRPC();
  const { data: sheets } = useSuspenseQuery(trpc.sheets.list.queryOptions({}));

  const [levelFilter, setLevelFilter] = useState("ทั้งหมด");
  const [examTypeFilter, setExamTypeFilter] = useState("ทั้งหมด");
  const [termFilter, setTermFilter] = useState("ทั้งหมด");
  const [subjectFilter, setSubjectFilter] = useState("ทั้งหมด");

  const subjects = useMemo(() => {
    const set = new Set(sheets.map((s) => s.subject));
    return ["ทั้งหมด", ...Array.from(set).sort()];
  }, [sheets]);

  const filtered = useMemo(() => {
    return sheets.filter((s) => {
      if (levelFilter !== "ทั้งหมด" && s.level !== levelFilter) return false;
      if (examTypeFilter !== "ทั้งหมด" && s.examType !== examTypeFilter) return false;
      if (termFilter !== "ทั้งหมด" && s.term !== termFilter) return false;
      if (subjectFilter !== "ทั้งหมด" && s.subject !== subjectFilter) return false;
      return true;
    });
  }, [sheets, levelFilter, examTypeFilter, termFilter, subjectFilter]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">ชีทจากชุมชน</h1>
          <p className="text-sm text-gray-500 mb-6">
            ชีทสรุปจากผู้จัดทำในชุมชน Freedom
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l === "ทั้งหมด" ? "ระดับชั้น" : l}</option>
              ))}
            </select>
            <select
              value={examTypeFilter}
              onChange={(e) => setExamTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EXAM_TYPES.map((t) => (
                <option key={t} value={t}>{t === "ทั้งหมด" ? "ประเภทสอบ" : t}</option>
              ))}
            </select>
            <select
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>{t === "ทั้งหมด" ? "เทอม" : t}</option>
              ))}
            </select>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s === "ทั้งหมด" ? "วิชา" : s}</option>
              ))}
            </select>
          </div>

          {/* Sheet grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">ไม่พบชีท</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((sheet) => {
                const userRating = userId
                  ? sheet.ratings.find((r) => r.userId === userId)?.score ?? null
                  : null;

                return (
                  <div
                    key={sheet.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{sheet.title}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {sheet.level}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                            {sheet.subject}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            {sheet.examType} {sheet.term}
                          </span>
                        </div>
                      </div>
                    </div>

                    {sheet.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{sheet.description}</p>
                    )}

                    <div className="mt-3">
                      {isLoggedIn ? (
                        <StarRating
                          sheetId={sheet.id}
                          currentRating={userRating}
                          averageRating={sheet.averageRating}
                          totalRatings={sheet.totalRatings}
                        />
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span className="text-yellow-400">★</span>
                          {sheet.averageRating.toFixed(1)} ({sheet.totalRatings} รีวิว)
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <User className="w-3.5 h-3.5" />
                        <span>{sheet.uploader.name}</span>
                        <span className="mx-1">·</span>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <a
                        href={sheet.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        เปิด PDF
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Bottombar />
    </>
  );
}
