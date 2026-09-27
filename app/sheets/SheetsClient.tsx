"use client";

import { useState, useMemo, useCallback, useEffect, useDeferredValue, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, SlidersHorizontal, Search, X, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import SheetCard, { type SheetListItem } from "./SheetCard";
import { SHEETS_LIST_STALE_TIME } from "./queryOptions";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useSession } from "@/lib/auth-client";

const LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const EXAM_TYPES = ["กลางภาค", "ปลายภาค"];
const TERMS = ["เทอม 1", "เทอม 2"];

/** Cards rendered per batch; more are added as the user scrolls. */
const PAGE_SIZE = 24;

function toggleInSet(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/** URL params accept both the Thai labels and ASCII forms ("m2", "midterm", "1"). */
function parseLevel(value: string) {
  const m = value.match(/^m([1-6])$/i);
  return m ? `ม.${m[1]}` : value;
}
function parseExam(value: string) {
  return ({ midterm: "กลางภาค", final: "ปลายภาค" } as Record<string, string>)[value] ?? value;
}
function parseTerm(value: string) {
  return /^[12]$/.test(value) ? `เทอม ${value}` : value;
}

/**
 * Left/right segmented toggle with an explicit "ทั้งหมด" option, so it is
 * always clear whether the filter is on — unlike two checkboxes where
 * "both ticked" and "none ticked" mean the same thing.
 */
function SegmentedToggle({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const all = ["", ...options];
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid rounded-xl bg-gray-100 p-1"
        style={{ gridTemplateColumns: `repeat(${all.length}, minmax(0, 1fr))` }}
      >
        {all.map((option) => {
          const active = value === option;
          return (
            <button
              key={option || "all"}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {option || "ทั้งหมด"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SheetsClient() {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const { data: sheets } = useSuspenseQuery(
    trpc.sheets.list.queryOptions({}, { staleTime: SHEETS_LIST_STALE_TIME, refetchOnWindowFocus: false })
  );
  const { data: myRatings } = useQuery({
    ...trpc.sheets.myRatings.queryOptions(),
    enabled: isLoggedIn,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [levelFilters, setLevelFilters] = useState<Set<string>>(new Set());
  const [examType, setExamType] = useState("");
  const [term, setTerm] = useState("");
  const [subjectFilters, setSubjectFilters] = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filtersReady = useRef(false);

  // Filters come from the URL (?level=ม.2&exam=กลางภาค&term=เทอม 1&q=...), which
  // is also where the old /m2/midterm1 links are redirected. Read on mount so
  // the page itself can stay statically rendered.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const levels = params.getAll("level").flatMap((v) => v.split(",")).map(parseLevel);
    const exam = parseExam(params.get("exam") ?? "");
    const t = parseTerm(params.get("term") ?? "");
    const q = params.get("q") ?? "";
    const id = window.setTimeout(() => {
      if (levels.length) setLevelFilters(new Set(levels.filter((l) => LEVELS.includes(l))));
      if (EXAM_TYPES.includes(exam)) setExamType(exam);
      if (TERMS.includes(t)) setTerm(t);
      if (q) setSearchQuery(q);
      filtersReady.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    if (!filtersReady.current) return;
    const params = new URLSearchParams();
    if (levelFilters.size) params.set("level", [...levelFilters].join(","));
    if (examType) params.set("exam", examType);
    if (term) params.set("term", term);
    if (deferredQuery.trim()) params.set("q", deferredQuery.trim());
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/sheets?${qs}` : "/sheets");
  }, [levelFilters, examType, term, deferredQuery]);

  const subjects = useMemo(() => {
    const set = new Set(sheets.map((s) => s.subject));
    return Array.from(set).sort();
  }, [sheets]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return sheets.filter((s) => {
      if (levelFilters.size > 0 && !levelFilters.has(s.level)) return false;
      if (examType && s.examType !== examType) return false;
      if (term && s.term !== term) return false;
      if (subjectFilters.size > 0 && !subjectFilters.has(s.subject)) return false;
      if (q) {
        const hay = `${s.title} ${s.subject} ${s.description ?? ""} ${s.uploader.name} ${
          s.uploader.username ?? ""
        } ${s.level} ${s.examType} ${s.term}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [sheets, levelFilters, examType, term, subjectFilters, deferredQuery]);

  // Start from the first batch whenever the result set changes.
  useEffect(() => {
    const id = window.setTimeout(() => setVisibleCount(PAGE_SIZE), 0);
    return () => window.clearTimeout(id);
  }, [filtered]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < filtered.length;
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisibleCount((c) => c + PAGE_SIZE);
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  const activeFilterCount =
    levelFilters.size + (examType ? 1 : 0) + (term ? 1 : 0) + subjectFilters.size;

  const clearFilters = () => {
    setLevelFilters(new Set());
    setExamType("");
    setTerm("");
    setSubjectFilters(new Set());
  };

  const handleOpenSheet = useCallback(
    (sheet: SheetListItem) => {
      router.push(`/sheets/${sheet.id}`);
    },
    [router]
  );

  const filterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-semibold text-gray-800">
          <SlidersHorizontal className="w-4 h-4" />
          ตัวกรอง
        </h2>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">
            ล้างทั้งหมด
          </button>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">ระดับชั้น</p>
        <div className="grid grid-cols-3 gap-1.5">
          {LEVELS.map((level) => {
            const active = levelFilters.has(level);
            return (
              <button
                key={level}
                type="button"
                aria-pressed={active}
                onClick={() => setLevelFilters((prev) => toggleInSet(prev, level))}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-700"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      <SegmentedToggle label="ประเภทสอบ" options={EXAM_TYPES} value={examType} onChange={setExamType} />
      <SegmentedToggle label="เทอม" options={TERMS} value={term} onChange={setTerm} />

      {subjects.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">วิชา</p>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {subjects.map((subject) => (
              <label key={subject} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subjectFilters.has(subject)}
                  onChange={() => setSubjectFilters((prev) => toggleInSet(prev, subject))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {subject}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
            <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600">ชีทสรุป</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">ชีทสรุป</h1>
          <p className="text-sm text-gray-500 mb-6">
            ชีทสรุป ม.1–ม.6 จากผู้จัดทำในชุมชน Freedom
          </p>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden relative flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              aria-label="เปิดตัวกรอง"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อชีท, วิชา, ผู้อัปโหลด..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="ล้างคำค้นหา"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              {filterPanel}
            </aside>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-4">พบ {filtered.length} รายการ</p>

              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">ไม่พบชีท</p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="mt-3 text-sm text-blue-600 hover:underline">
                      ล้างตัวกรอง
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.slice(0, visibleCount).map((sheet) => (
                      <SheetCard
                        key={sheet.id}
                        sheet={sheet}
                        isLoggedIn={isLoggedIn}
                        userRating={myRatings?.[sheet.id] ?? null}
                        onOpen={() => handleOpenSheet(sheet)}
                      />
                    ))}
                  </div>
                  {hasMore && <div ref={sentinelRef} className="h-10" aria-hidden="true" />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Bottombar />

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto w-80 max-w-[85vw] h-full bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-800">ตัวกรอง</span>
              <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              ดูผลลัพธ์ ({filtered.length})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
