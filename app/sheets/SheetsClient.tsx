"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, SlidersHorizontal, Search, X, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import PurchaseModal from "@/app/components/PurchaseModal";
import SheetCard, { type SheetListItem } from "./SheetCard";
import { SHEETS_LIST_STALE_TIME } from "./queryOptions";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const EXAM_TYPES = ["กลางภาค", "ปลายภาค"];
const TERMS = ["เทอม 1", "เทอม 2"];

function toggleInSet(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function SheetsClient({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
  userId: string | null;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: sheets } = useSuspenseQuery(trpc.sheets.list.queryOptions({}));

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7282/ingest/1a575717-14f9-41b2-8db3-8c3597fa5908", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "878a11",
      },
      body: JSON.stringify({
        sessionId: "878a11",
        location: "app/sheets/SheetsClient.tsx",
        message: "sheets client hydrated",
        data: { sheetCount: sheets.length },
        timestamp: Date.now(),
        hypothesisId: "B",
      }),
    }).catch(() => {});
  }, [sheets.length]);
  // #endregion

  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilters, setLevelFilters] = useState<Set<string>>(new Set());
  const [examTypeFilters, setExamTypeFilters] = useState<Set<string>>(new Set());
  const [termFilters, setTermFilters] = useState<Set<string>>(new Set());
  const [subjectFilters, setSubjectFilters] = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [purchaseSheet, setPurchaseSheet] = useState<{
    id: string;
    title: string;
    price: number;
  } | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());

  const subjects = useMemo(() => {
    const set = new Set(sheets.map((s) => s.subject));
    return Array.from(set).sort();
  }, [sheets]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sheets.filter((s) => {
      if (levelFilters.size > 0 && !levelFilters.has(s.level)) return false;
      if (examTypeFilters.size > 0 && !examTypeFilters.has(s.examType)) return false;
      if (termFilters.size > 0 && !termFilters.has(s.term)) return false;
      if (subjectFilters.size > 0 && !subjectFilters.has(s.subject)) return false;
      if (q) {
        const hay = `${s.title} ${s.subject} ${s.description ?? ""} ${s.uploader.name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [sheets, levelFilters, examTypeFilters, termFilters, subjectFilters, searchQuery]);

  const activeFilterCount =
    levelFilters.size + examTypeFilters.size + termFilters.size + subjectFilters.size;

  const clearFilters = () => {
    setLevelFilters(new Set());
    setExamTypeFilters(new Set());
    setTermFilters(new Set());
    setSubjectFilters(new Set());
  };

  // Cards open the sheet's detail page; buying/opening the PDF happens there.
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
        <div className="space-y-1.5">
          {LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={levelFilters.has(level)}
                onChange={() => setLevelFilters((prev) => toggleInSet(prev, level))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">ประเภทสอบ</p>
        <div className="space-y-1.5">
          {EXAM_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={examTypeFilters.has(type)}
                onChange={() => setExamTypeFilters((prev) => toggleInSet(prev, type))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">เทอม</p>
        <div className="space-y-1.5">
          {TERMS.map((term) => (
            <label key={term} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={termFilters.has(term)}
                onChange={() => setTermFilters((prev) => toggleInSet(prev, term))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {term}
            </label>
          ))}
        </div>
      </div>

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
            <span className="text-gray-600">ชีทจากชุมชน</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">ชีทจากชุมชน</h1>
          <p className="text-sm text-gray-500 mb-6">
            ชีทสรุปจากผู้จัดทำในชุมชน Freedom
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
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
              {filterPanel}
            </aside>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-4">พบ {filtered.length} รายการ</p>

              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">ไม่พบชีท</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((sheet) => (
                    <SheetCard
                      key={sheet.id}
                      sheet={sheet}
                      isLoggedIn={isLoggedIn}
                      alreadyPurchased={purchasedIds.has(sheet.id)}
                      onOpen={() => handleOpenSheet(sheet)}
                    />
                  ))}
                </div>
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

      {purchaseSheet && (
        <PurchaseModal
          sheetId={purchaseSheet.id}
          sheetTitle={purchaseSheet.title}
          price={purchaseSheet.price}
          onClose={() => setPurchaseSheet(null)}
          onSuccess={() => {
            setPurchasedIds((prev) => new Set([...prev, purchaseSheet.id]));
            queryClient.invalidateQueries({ queryKey: trpc.sheets.list.queryOptions({}).queryKey });
          }}
        />
      )}
    </>
  );
}
