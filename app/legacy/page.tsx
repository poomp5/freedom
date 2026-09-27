"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import { allSheets } from "@/app/components/searchData";
import { FileText, ExternalLink } from "lucide-react";

const LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const EXAM_TYPES = ["ทั้งหมด", "กลางภาค", "ปลายภาค"];
const TERMS = ["ทั้งหมด", "เทอม 1", "เทอม 2"];

const LEVEL_COLORS: Record<string, string> = {
  "ม.1": "from-rose-500 to-pink-600",
  "ม.2": "from-orange-500 to-amber-600",
  "ม.3": "from-emerald-500 to-teal-600",
  "ม.4": "from-cyan-500 to-blue-600",
  "ม.5": "from-violet-500 to-purple-600",
  "ม.6": "from-fuchsia-500 to-pink-600",
};

const LEVEL_BG: Record<string, string> = {
  "ม.1": "bg-rose-50 text-rose-700 border-rose-200",
  "ม.2": "bg-orange-50 text-orange-700 border-orange-200",
  "ม.3": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "ม.4": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "ม.5": "bg-violet-50 text-violet-700 border-violet-200",
  "ม.6": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};

export default function LegacyPage() {
  const [activeLevel, setActiveLevel] = useState("ม.1");
  const [examType, setExamType] = useState("ทั้งหมด");
  const [term, setTerm] = useState("ทั้งหมด");
  const levelTabsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return allSheets.filter(s => {
      if (s.level !== activeLevel) return false;
      if (examType !== "ทั้งหมด" && s.examType !== examType) return false;
      if (term !== "ทั้งหมด" && s.term !== term) return false;
      return true;
    });
  }, [activeLevel, examType, term]);

  const handleLevelChange = (level: string) => {
    setActiveLevel(level);
    setExamType("ทั้งหมด");
    setTerm("ทั้งหมด");
  };

  const currentIndex = LEVELS.indexOf(activeLevel);
  const prevLevel = currentIndex > 0 ? LEVELS[currentIndex - 1] : null;
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">ชีทสรุป (คลังเก่า)</h1>
          <p className="text-sm text-gray-500 mb-4">ชีทสรุปจากทีมงาน Freedom ปีการศึกษา 2565-2568</p>

          {/* Level Tabs */}
          <div className="relative mb-4">
            <div ref={levelTabsRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeLevel === level
                      ? `bg-gradient-to-r ${LEVEL_COLORS[level]} text-white shadow-md`
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Type + Term filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
              {EXAM_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setExamType(t)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    examType === t ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
              {TERMS.map(t => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    term === t ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sheet Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">ไม่พบชีทในหมวดนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((sheet, i) => (
                <a
                  key={i}
                  href={sheet.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-4 flex flex-col group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 flex-shrink-0 relative">
                      <Image src={sheet.icon} alt={sheet.subject} fill className="object-contain" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors leading-tight">
                      {sheet.subject}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-auto">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${LEVEL_BG[sheet.level]}`}>
                      {sheet.level}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                      {sheet.examType}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                      {sheet.term}
                    </span>
                  </div>
                  {sheet.by && (
                    <p className="text-xs text-gray-400 mt-2 truncate">@{sheet.by}</p>
                  )}
                  <div className="flex items-center justify-end mt-1">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Prev/Next Level Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {prevLevel ? (
              <button
                onClick={() => handleLevelChange(prevLevel)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {prevLevel}
              </button>
            ) : <div />}
            {nextLevel ? (
              <button
                onClick={() => handleLevelChange(nextLevel)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                {nextLevel}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : <div />}
          </div>

          {/* Back to select */}
          <div className="text-center mt-4">
            <Link href="/select" className="text-sm text-blue-600 hover:text-blue-700">
              ← กลับหน้าเลือกระดับชั้น
            </Link>
          </div>
        </div>
      </div>
      <Bottombar />
    </>
  );
}
