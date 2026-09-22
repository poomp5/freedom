"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  FileText,
  Lock,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import Avatar from "@/app/components/Avatar";
import SubjectCover from "@/app/sheets/SubjectCover";
import { getSubjectBadgeClass } from "@/app/sheets/subjectCoverUtils";

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
      .slice(0, 8);
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestSheets.map((sheet) => {
              const isPaid = !sheet.isFree && sheet.price;
              const u = sheet.uploader;
              return (
                <div
                  key={sheet.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="relative">
                    <SubjectCover subject={sheet.subject} />
                    <span
                      className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow-sm ${
                        isPaid ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <Lock className="h-3 w-3" />฿{sheet.price}
                        </>
                      ) : (
                        "ฟรี"
                      )}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div
                      className={`mb-1.5 inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-xs font-medium ${getSubjectBadgeClass(
                        sheet.subject
                      )}`}
                    >
                      <FileText className="h-3 w-3" />
                      {sheet.subject}
                    </div>

                    <h3 className="truncate font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                      {/* Overlay link makes the whole card clickable. */}
                      <Link
                        href={`/sheets/${sheet.id}`}
                        className="before:absolute before:inset-0 before:content-['']"
                      >
                        {sheet.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {sheet.level} · {sheet.examType} {sheet.term}
                    </p>

                    {sheet.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {sheet.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {sheet.averageRating.toFixed(1)}
                      <span className="text-xs text-gray-400">
                        ({sheet.totalRatings} รีวิว)
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-400">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Avatar src={u.image} name={u.name} seed={u.id} size={16} />
                        {u.username ? (
                          <Link
                            href={`/u/${u.username}`}
                            className="relative z-10 truncate hover:text-blue-600 hover:underline"
                          >
                            @{u.username}
                          </Link>
                        ) : (
                          <span className="truncate">{u.name}</span>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
