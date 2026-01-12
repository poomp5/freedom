"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { searchSheets, SheetData } from "./searchData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SheetData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    setResults(searchSheets(query));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container - คลิกข้างนอกปิด */}
      <div
        className="relative min-h-screen flex items-start justify-center pt-20 px-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4">
            <div className="flex items-center px-4 bg-gray-100 rounded-full">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="ค้นหาชีท... (ชื่อวิชา, ระดับชั้น, ชื่อคนทำ)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-3 bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none focus:ring-0"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                ไม่พบผลลัพธ์สำหรับ &quot;{query}&quot;
              </div>
            )}

            {results.length > 0 && (
              <ul className="py-2">
                {results.map((sheet, i) => (
                  <li key={i}>
                    <Link
                      href={sheet.filename}
                      target="_blank"
                      onClick={onClose}
                      className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Image
                          src={sheet.icon}
                          alt={sheet.subject}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          {sheet.subject}
                        </div>
                        <div className="text-xs text-gray-500">
                          {sheet.level} • {sheet.term} • {sheet.examType}
                          {sheet.by && <span className="text-blue-500"> • @{sheet.by}</span>}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!query && (
              <div className="px-4 py-6">
                <div className="text-xs font-medium text-gray-400 uppercase mb-3">ค้นหาด่วน</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "คณิตศาสตร์", icon: "/assets/img/icon/math.png" },
                    { label: "ฟิสิกส์", icon: "/assets/img/icon/physics.png" },
                    { label: "เคมี", icon: "/assets/img/icon/chemistry.png" },
                    { label: "ชีววิทยา", icon: "/assets/img/icon/biology.png" },
                    { label: "ภาษาไทย", icon: "/assets/img/icon/thai.png" },
                    { label: "ภาษาอังกฤษ", icon: "/assets/img/icon/english.png" },
                  ].map((tag) => (
                    <button
                      key={tag.label}
                      onClick={() => setQuery(tag.label)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Image src={tag.icon} alt={tag.label} width={16} height={16} className="w-4 h-4" />
                      {tag.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6", "กลางภาค", "ปลายภาค"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
            <span>กด ESC เพื่อปิด</span>
            <span>{results.length} ผลลัพธ์</span>
          </div>
        </div>
      </div>
    </div>
  );
}
