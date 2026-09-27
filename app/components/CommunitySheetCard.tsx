"use client";

import Link from "next/link";
import { Calendar, FileText, Lock, Star } from "lucide-react";
import Avatar from "@/app/components/Avatar";
import SubjectCover from "@/app/sheets/SubjectCover";
import { getSubjectBadgeClass } from "@/app/sheets/subjectCoverUtils";
import type { SheetListItem } from "@/app/sheets/SheetCard";

/**
 * Compact sheet card for the home page sections.
 *
 * The card is a <div>, not a <Link>: the uploader credit is its own link, and
 * nesting <a> inside <a> is invalid HTML and breaks hydration. The whole card
 * stays clickable via the overlay link on the title.
 */
export default function CommunitySheetCard({ sheet }: { sheet: SheetListItem }) {
  const isPaid = !sheet.isFree && sheet.price;
  const u = sheet.uploader;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
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
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">{sheet.description}</p>
        )}

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {sheet.averageRating.toFixed(1)}
          <span className="text-xs text-gray-400">({sheet.totalRatings} รีวิว)</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-400">
          <div className="flex min-w-0 items-center gap-1.5">
            <Avatar src={u.image} name={u.name} seed={u.id} size={16} />
            <Link
              href={`/u/${u.username ?? u.id}`}
              className="relative z-10 truncate hover:text-blue-600 hover:underline"
            >
              {u.username ? `@${u.username}` : u.name}
            </Link>
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
}
