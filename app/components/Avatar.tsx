"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Avatar with a deterministic placeholder.
 *
 * Some users have no `image` (signed in before the picture was stored, or the
 * Google fetch is unavailable). Instead of a blank circle, fall back to the
 * user's initial on a color picked from their id/name, so the same person keeps
 * the same color everywhere and different people stay tellable apart.
 *
 * Remote avatars are rendered with `unoptimized` on purpose: list pages show
 * dozens at once, and routing every one through /_next/image made them fail to
 * load under load. Google/R2 already serve these pre-sized (=s96-c).
 * A URL that 404s (e.g. a deleted R2 upload) falls back to the placeholder.
 */

const PLACEHOLDER_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
] as const;

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColor(seed: string) {
  return PLACEHOLDER_COLORS[hashString(seed) % PLACEHOLDER_COLORS.length];
}

/** First character of the name, or "?" for names we cannot read an initial from. */
function getInitial(name: string) {
  const trimmed = name?.trim() ?? "";
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

export default function Avatar({
  src,
  name,
  size = 32,
  seed,
  className = "",
}: {
  src?: string | null;
  name: string;
  /** Rendered pixel size; also drives the initial's font size. */
  size?: number;
  /** Stable color seed — pass the user id so the color survives a rename. */
  seed?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 ${className}`}
        referrerPolicy="no-referrer"
        unoptimized
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      aria-label={name}
      role="img"
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.4) }}
      className={`rounded-full shrink-0 flex items-center justify-center font-medium text-white select-none ${getAvatarColor(
        seed || name || "?"
      )} ${className}`}
    >
      {getInitial(name)}
    </div>
  );
}
