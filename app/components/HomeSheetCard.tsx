"use client";

import Link from "next/link";
import Image from "next/image";
import { Download, User } from "lucide-react";

/**
 * Card for a sheet from the static `allSheets` catalog, styled to match the
 * community cards on the landing page (the grade section used to be a table).
 */
export default function HomeSheetCard({
  subject,
  filename,
  icon,
  level,
  term,
  examType,
  by,
}: {
  subject: string;
  filename: string;
  icon: string;
  level: string;
  term: string;
  examType: string;
  by?: string;
}) {
  return (
    <Link
      href={filename}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
          <Image src={icon} alt={subject} fill className="object-contain p-1.5" sizes="44px" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-blue-700">
            {subject}
          </h3>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {level}
            </span>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              {examType}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {term}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 text-xs text-gray-400">
        {by ? (
          <a
            href={`https://instagram.com/${by}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-0 items-center gap-1.5 text-purple-700 hover:underline"
          >
            <User className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{by}</span>
          </a>
        ) : (
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Freedom
          </span>
        )}

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 transition-colors group-hover:bg-emerald-100">
          <Download className="h-3.5 w-3.5" />
          ดาวน์โหลด
        </span>
      </div>
    </Link>
  );
}
