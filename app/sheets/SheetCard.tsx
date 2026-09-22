"use client";

import { memo } from "react";
import Link from "next/link";
import { FileText, Calendar, Lock } from "lucide-react";
import StarRating from "@/app/components/StarRating";
import Avatar from "@/app/components/Avatar";
import SubjectCover from "./SubjectCover";
import { getSubjectBadgeClass } from "./subjectCoverUtils";
import { getSocialLinks, getContactHref } from "./socialIcons";

export type SheetListItem = {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  examType: string;
  term: string;
  pdfUrl: string;
  isFree: boolean;
  price: number | null;
  uploader: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
    socialIg: string | null;
    socialFacebook: string | null;
    socialLine: string | null;
    socialDiscord: string | null;
    socialX: string | null;
    mainContact: string | null;
  };
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
  createdAt: Date;
};

type SheetCardProps = {
  sheet: SheetListItem;
  isLoggedIn: boolean;
  alreadyPurchased: boolean;
  onOpen: () => void;
};

function SheetCard({
  sheet,
  isLoggedIn,
  alreadyPurchased,
  onOpen,
}: SheetCardProps) {
  const u = sheet.uploader;
  const socials = getSocialLinks(u);
  const contactHref = getContactHref(u, u.mainContact);
  const badgeClass = getSubjectBadgeClass(sheet.subject);
  const isPaid = !sheet.isFree && sheet.price;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col group cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="relative">
        <SubjectCover subject={sheet.subject} />
        {isPaid && !alreadyPurchased && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-amber-700 shadow-sm">
            <Lock className="w-3 h-3" />
            ฿{sheet.price}
          </span>
        )}
        {isPaid && alreadyPurchased && (
          <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-green-700 shadow-sm">
            ซื้อแล้ว
          </span>
        )}
        {!isPaid && (
          <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-emerald-700 shadow-sm">
            ฟรี
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div
          className={`inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-xs font-medium mb-1.5 ${badgeClass}`}
        >
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
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {sheet.description}
          </p>
        )}

        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          {isLoggedIn ? (
            <StarRating
              sheetId={sheet.id}
              currentRating={sheet.userRating}
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

        <div className="mt-auto pt-3 border-t border-gray-50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0">
              <Avatar src={u.image} name={u.name} seed={u.id} size={16} />
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
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
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
}

export default memo(SheetCard);
