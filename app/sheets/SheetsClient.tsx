"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Calendar, Lock, SlidersHorizontal, Search, X, ChevronRight } from "lucide-react";
import StarRating from "@/app/components/StarRating";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import PurchaseModal from "@/app/components/PurchaseModal";
import { getSubjectTheme } from "./subjectTheme";
import { getSocialLinks, getContactHref } from "./socialIcons";
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
  userId,
}: {
  isLoggedIn: boolean;
  userId: string | null;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: sheets } = useSuspenseQuery(trpc.sheets.list.queryOptions({}));

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

  // Track purchased sheet IDs client-side for immediate UI update
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
            <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600">ชีทจากชุมชน</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">ชีทจากชุมชน</h1>
          <p className="text-sm text-gray-500 mb-6">
            ชีทสรุปจากผู้จัดทำในชุมชน Freedom
          </p>

          {/* Search + mobile filter toggle */}
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
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
              {filterPanel}
            </aside>

            {/* Sheet grid */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-4">พบ {filtered.length} รายการ</p>

              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">ไม่พบชีท</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((sheet) => {
                    const u = sheet.uploader;
                    const userRating = userId
                      ? sheet.ratings.find((r) => r.userId === userId)?.score ?? null
                      : null;
                    const socials = getSocialLinks(u);
                    const contactHref = getContactHref(u, u.mainContact as string | null);
                    const theme = getSubjectTheme(sheet.subject);

                    const isPaid = !sheet.isFree && sheet.price;
                    const alreadyPurchased = purchasedIds.has(sheet.id);

                    const handleCardClick = () => {
                      if (!isPaid || alreadyPurchased) {
                        window.open(sheet.pdfUrl, "_blank", "noopener,noreferrer");
                      } else if (isLoggedIn) {
                        setPurchaseSheet({
                          id: sheet.id,
                          title: sheet.title,
                          price: sheet.price!,
                        });
                      } else {
                        window.location.href = "/auth/login";
                      }
                    };

                    return (
                      <div
                        key={sheet.id}
                        role="link"
                        tabIndex={0}
                        onClick={handleCardClick}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCardClick();
                          }
                        }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col group cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {/* Banner */}
                        <div className={`relative h-28 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
                          <FileText className="w-10 h-10 text-white/70" strokeWidth={1.5} />
                          {isPaid && !alreadyPurchased && (
                            <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-amber-700">
                              <Lock className="w-3 h-3" />
                              ฿{sheet.price}
                            </span>
                          )}
                          {isPaid && alreadyPurchased && (
                            <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-green-700">
                              ซื้อแล้ว
                            </span>
                          )}
                          {!isPaid && (
                            <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-emerald-700">
                              ฟรี
                            </span>
                          )}
                        </div>

                        {/* Body */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className={`inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-xs font-medium mb-1.5 ${theme.badge}`}>
                            <FileText className="w-3 h-3" />
                            {sheet.subject}
                          </div>
                          <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                            {sheet.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {sheet.level} · {sheet.examType} {sheet.term}
                          </p>

                          {sheet.description && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{sheet.description}</p>
                          )}

                          <div className="mt-3" onClick={(e) => e.stopPropagation()}>
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

                          {/* Footer */}
                          <div className="mt-auto pt-3 border-t border-gray-50 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0">
                                {u.image ? (
                                  <Image
                                    src={u.image}
                                    alt={u.name}
                                    width={16}
                                    height={16}
                                    className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-blue-100 flex-shrink-0" />
                                )}
                                {u.username ? (
                                  <Link
                                    href={`/u/${u.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="truncate hover:text-blue-600 hover:underline"
                                  >
                                    @{u.username}
                                  </Link>
                                ) : (
                                  <span className="truncate">{u.name}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </div>
                            </div>

                            {socials.length > 0 && (
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                {socials.map((s) => (
                                  <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={s.label}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {s.icon}
                                  </a>
                                ))}
                              </div>
                            )}

                            {contactHref && (
                              <a
                                href={contactHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="block w-full text-center text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg py-1.5 transition-colors"
                              >
                                ติดต่อเจ้าของชีท
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Bottombar />

      {/* Mobile filter drawer */}
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

      {/* Purchase Modal */}
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
