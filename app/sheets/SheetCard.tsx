"use client";

import { User, Calendar, ExternalLink, FileText, Eye } from "lucide-react";
import StarRating from "@/app/components/StarRating";

type SheetUploader = {
  id: string;
  name: string;
  image: string | null;
  socialIg: string | null;
  socialFacebook: string | null;
  socialLine: string | null;
  socialDiscord: string | null;
  socialX: string | null;
};

type SheetData = {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  examType: string;
  term: string;
  pdfUrl: string;
  uploader: SheetUploader;
  averageRating: number;
  totalRatings: number;
  ratings: { score: number; userId: string }[];
  createdAt: Date;
};

type SheetCardProps = {
  sheet: SheetData;
  isLoggedIn: boolean;
  userId: string | null;
};

const SOCIALS_CONFIG = [
  {
    key: "socialIg" as const,
    getHref: (v: string) => `https://instagram.com/${v}`,
    label: "Instagram",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" />
      </svg>
    ),
    color: "text-pink-500 hover:text-pink-600",
  },
  {
    key: "socialFacebook" as const,
    getHref: (v: string) => (v.startsWith("http") ? v : `https://facebook.com/${v}`),
    label: "Facebook",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: "text-blue-600 hover:text-blue-700",
  },
  {
    key: "socialLine" as const,
    getHref: (v: string) => `https://line.me/ti/p/~${v}`,
    label: "Line",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.34 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
    color: "text-green-500 hover:text-green-600",
  },
  {
    key: "socialDiscord" as const,
    getHref: (v: string) => (v.startsWith("http") ? v : `https://discord.com/users/${v}`),
    label: "Discord",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.1.128 18.11a19.91 19.91 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    color: "text-indigo-500 hover:text-indigo-600",
  },
  {
    key: "socialX" as const,
    getHref: (v: string) => `https://x.com/${v}`,
    label: "X",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "text-gray-800 hover:text-gray-900",
  },
] as const;

export default function SheetCard({ sheet, isLoggedIn, userId }: SheetCardProps) {
  const u = sheet.uploader;
  const userRating = userId
    ? sheet.ratings.find((r) => r.userId === userId)?.score ?? null
    : null;

  const socials = SOCIALS_CONFIG.filter((s) => u[s.key]).map((s) => ({
    href: s.getHref(u[s.key]!),
    label: s.label,
    icon: s.icon,
    color: s.color,
  }));

  return (
    <a
      href={sheet.pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col group overflow-hidden"
    >
      {/* Preview */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-14 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
              {sheet.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100/80 text-blue-700">
                {sheet.level}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100/80 text-purple-700">
                {sheet.subject}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100/80 text-green-700">
                {sheet.examType} {sheet.term}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 ml-2 transition-colors" />
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Eye className="w-3.5 h-3.5" />
          <span>คลิกเพื่อเปิดดูชีท PDF</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {sheet.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{sheet.description}</p>
        )}

        <div onClick={(e) => e.preventDefault()}>
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
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User className="w-3.5 h-3.5" />
            <span>{u.name}</span>
            <span className="mx-1">·</span>
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          {socials.length > 0 && (
            <div className="flex items-center gap-1.5" onClick={(e) => e.preventDefault()}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className={`${s.color} transition-colors`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
