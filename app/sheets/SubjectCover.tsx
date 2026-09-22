"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import { getSubjectCoverSrc } from "./subjectCoverUtils";

export default function SubjectCover({
  subject,
  className = "h-28",
  fit = "cover",
}: {
  subject: string;
  className?: string;
  /** "contain" shows the whole cover without cropping (detail page). */
  fit?: "cover" | "contain";
}) {
  const src = getSubjectCoverSrc(subject);
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div
        className={`relative bg-gray-100 flex items-center justify-center overflow-hidden ${className}`}
      >
        <div className="flex flex-col items-center gap-1.5 text-gray-400 px-3">
          <FileText className="w-9 h-9" strokeWidth={1.5} />
          <span className="text-[11px] font-medium text-center line-clamp-2 leading-tight">
            {subject}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={subject}
        fill
        className={fit === "contain" ? "object-contain" : "object-cover"}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
