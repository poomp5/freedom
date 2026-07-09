"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  FileText,
  Sparkles,
  Star,
  Upload,
  User,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";

const SUBJECT_ACCENTS = [
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-emerald-50 text-emerald-700 border-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-100",
  "bg-pink-50 text-pink-700 border-pink-100",
  "bg-violet-50 text-violet-700 border-violet-100",
  "bg-cyan-50 text-cyan-700 border-cyan-100",
];

export default function CommunityUpdates() {
  const trpc = useTRPC();
  const { data: sheets = [], isLoading } = useQuery(
    trpc.sheets.list.queryOptions({})
  );

  const latestSheets = useMemo(() => {
    return [...sheets]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [sheets]);

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
              ชีตจากชุมชน
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
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
              ยังไม่มีชีตจากชุมชน
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestSheets.map((sheet, index) => {
              const accent = SUBJECT_ACCENTS[index % SUBJECT_ACCENTS.length];
              return (
                <Link
                  key={sheet.id}
                  href="/sheets"
                  className="group flex min-h-40 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-blue-700">
                          {sheet.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                            {sheet.level}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${accent}`}
                          >
                            {sheet.subject}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!sheet.isFree && sheet.price ? (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                        ฿{sheet.price}
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        ฟรี
                      </span>
                    )}
                  </div>

                  {sheet.description ? (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {sheet.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {sheet.examType} {sheet.term}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 text-xs text-gray-400">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <User className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {sheet.uploader.username
                          ? `@${sheet.uploader.username}`
                          : sheet.uploader.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {sheet.averageRating.toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
