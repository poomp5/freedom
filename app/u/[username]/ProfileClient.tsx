"use client";

import { FileText, ExternalLink, Lock, Calendar, Star, MessageSquare, GraduationCap } from "lucide-react";
import Avatar from "@/app/components/Avatar";
import SubjectCover from "@/app/sheets/SubjectCover";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const gradeLevelLabels: Record<number, string> = {
  1: "ม.1",
  2: "ม.2",
  3: "ม.3",
  4: "ม.4",
  5: "ม.5",
  6: "ม.6",
};

const SOCIALS_CONFIG = [
  {
    key: "socialIg" as const,
    getHref: (v: string) => `https://instagram.com/${v}`,
    label: "Instagram",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" />
      </svg>
    ),
    color: "text-pink-500 hover:text-pink-600 bg-pink-50 hover:bg-pink-100",
  },
  {
    key: "socialFacebook" as const,
    getHref: (v: string) => (v.startsWith("http") ? v : `https://facebook.com/${v}`),
    label: "Facebook",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100",
  },
  {
    key: "socialLine" as const,
    getHref: (v: string) => `https://line.me/ti/p/~${v}`,
    label: "Line",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.34 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
    color: "text-green-500 hover:text-green-600 bg-green-50 hover:bg-green-100",
  },
  {
    key: "socialDiscord" as const,
    getHref: (v: string) => (v.startsWith("http") ? v : `https://discord.com/users/${v}`),
    label: "Discord",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.1.128 18.11a19.91 19.91 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    color: "text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
  },
  {
    key: "socialX" as const,
    getHref: (v: string) => `https://x.com/${v}`,
    label: "X",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "text-gray-800 hover:text-gray-900 bg-gray-50 hover:bg-gray-100",
  },
] as const;

export default function ProfileClient({ username }: { username: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.users.getPublicProfile.queryOptions({ username }));
  const { user, sheets } = data;

  const gradeLevelLabel = user.gradeLevel ? gradeLevelLabels[user.gradeLevel] : null;

  const socials = SOCIALS_CONFIG.filter((s) => user[s.key]).map((s) => ({
    href: s.getHref(user[s.key]!),
    label: s.label,
    icon: s.icon,
    color: s.color,
  }));

  // Profile-wide stats, averaged only over sheets that actually have ratings so
  // unrated uploads do not drag the score down to zero.
  const ratedSheets = sheets.filter((s) => s.totalRatings > 0);
  const avgRating =
    ratedSheets.length > 0
      ? ratedSheets.reduce((sum, s) => sum + s.averageRating, 0) / ratedSheets.length
      : 0;
  const totalReviews = sheets.reduce((sum, s) => sum + s.totalRatings, 0);
  const joinedYear = new Date(user.createdAt).toLocaleDateString("th-TH", {
    month: "short",
    year: "numeric",
  });

  const stats = [
    { label: "ชีททั้งหมด", value: user._count.sheets, icon: FileText },
    {
      label: "คะแนนเฉลี่ย",
      value: avgRating > 0 ? avgRating.toFixed(1) : "—",
      icon: Star,
    },
    { label: "รีวิว", value: totalReviews, icon: MessageSquare },
  ];

  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="min-h-screen bg-gray-50 pb-24 md:pb-12">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-screen-lg mx-auto px-4 pt-12 pb-20 md:pt-16 md:pb-24">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-7 text-center md:text-left">
              <div className="rounded-full ring-4 ring-white/80 shadow-xl overflow-hidden shrink-0">
                <Avatar src={user.image} name={user.name} seed={user.id} size={112} />
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm truncate">
                  {user.name}
                </h1>
                {user.username && (
                  <p className="text-blue-50/90 text-sm mt-1">@{user.username}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {gradeLevelLabel && (
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {gradeLevelLabel}
                    </span>
                  )}
                  {user.school && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full max-w-[240px]">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{user.school.name}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    เข้าร่วม {joinedYear}
                  </span>
                </div>
              </div>

              {socials.length > 0 && (
                <div className="flex items-center gap-2 shrink-0 pb-1">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      aria-label={s.label}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats (overlapping the hero) ── */}
        <div className="max-w-screen-lg mx-auto px-4 -mt-12 relative z-10">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-4 md:px-5 md:py-5 text-center"
              >
                <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mx-auto mb-1.5" />
                <div className="text-xl md:text-2xl font-bold text-gray-800 leading-none">
                  {stat.value}
                </div>
                <div className="text-[11px] md:text-xs text-gray-400 mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sheets ── */}
        <div className="max-w-screen-lg mx-auto px-4 mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">ชีทที่อัปโหลด</h2>
            {sheets.length > 0 && (
              <span className="text-sm text-gray-400">{sheets.length} ชิ้น</span>
            )}
          </div>

          {sheets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-gray-400">ยังไม่มีชีทที่อัปโหลด</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sheets.map((sheet) => {
                const isPaid = !sheet.isFree && sheet.price;
                return (
                  <a
                    key={sheet.id}
                    href={sheet.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col group overflow-hidden"
                  >
                    <div className="relative">
                      <SubjectCover subject={sheet.subject} className="h-28" />
                      <span
                        className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shadow-sm ${
                          isPaid ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <Lock className="w-3 h-3" />฿{sheet.price}
                          </>
                        ) : (
                          "ฟรี"
                        )}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {sheet.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 mt-0.5 transition-colors" />
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                          {sheet.level}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700">
                          {sheet.subject}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                          {sheet.examType} {sheet.term}
                        </span>
                      </div>

                      {sheet.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {sheet.description}
                        </p>
                      )}

                      <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                        {sheet.totalRatings > 0 ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{sheet.averageRating.toFixed(1)}</span>
                            <span className="text-gray-400 text-xs">({sheet.totalRatings})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">ยังไม่มีรีวิว</span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(sheet.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
