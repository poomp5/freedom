"use client";

import Link from "next/link";
import { FileText, Download, User } from "lucide-react";
import SubjectCover from "@/app/sheets/SubjectCover";
import { getSubjectBadgeClass } from "@/app/sheets/subjectCoverUtils";

/**
 * Card for a sheet from the static `allSheets` catalog, matching the cards on
 * /sheets (cover image, subject pill, meta line, footer).
 *
 * The catalog has no title/description/rating — those come from the database —
 * so the subject doubles as the title and the rating row is omitted.
 *
 * The card is a <div>, not a <Link>: the author credit is its own external
 * link, and nesting <a> inside <a> is invalid HTML and breaks hydration.
 * The whole card stays clickable via the overlay link on the title.
 */
export default function HomeSheetCard({
  subject,
  filename,
  level,
  term,
  examType,
  by,
}: {
  subject: string;
  filename: string;
  level: string;
  term: string;
  examType: string;
  by?: string;
}) {
  const badgeClass = getSubjectBadgeClass(subject);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      <div className="relative">
        <SubjectCover subject={subject} />
        <span className="absolute right-2 top-2 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-emerald-700 shadow-sm">
          ฟรี
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div
          className={`mb-1.5 inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          <FileText className="h-3 w-3" />
          {subject}
        </div>

        <h3 className="truncate font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
          {/* Overlay link: makes the whole card clickable without wrapping it. */}
          <Link href={filename} className="before:absolute before:inset-0 before:content-['']">
            {subject}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-gray-400">
          {level} · {examType} {term}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
          {by ? (
            <a
              href={`https://instagram.com/${by}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex min-w-0 items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 hover:underline"
            >
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{by}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <User className="h-3.5 w-3.5" />
              Freedom
            </span>
          )}

          <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 transition-colors group-hover:bg-emerald-100">
            <Download className="h-3.5 w-3.5" />
            ดาวน์โหลด
          </span>
        </div>
      </div>
    </div>
  );
}
