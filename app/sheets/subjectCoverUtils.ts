/** Maps Thai subject names to cover image slugs in /public/subject-cover/ */
const SUBJECT_COVER_SLUGS: Record<string, string> = {
  คณิตศาสตร์: "math",
  วิทยาศาสตร์: "science",
  ภาษาไทย: "thai",
  "ภาษาไทยและวรรณคดี": "thai",
  ภาษาอังกฤษ: "english",
  อังกฤษ: "english",
  สังคมศึกษา: "social",
  ประวัติศาสตร์: "history",
  สุขศึกษา: "health",
  ศิลปะ: "art",
  การงานอาชีพ: "career",
  ฟิสิกส์: "physics",
  เคมี: "chemistry",
  ชีววิทยา: "biology",
};

const BADGE_PALETTE = [
  "bg-emerald-50 text-emerald-700",
  "bg-blue-50 text-blue-700",
  "bg-purple-50 text-purple-700",
  "bg-rose-50 text-rose-700",
  "bg-amber-50 text-amber-700",
  "bg-indigo-50 text-indigo-700",
  "bg-cyan-50 text-cyan-700",
  "bg-lime-50 text-lime-700",
] as const;

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Reduce a subject to the one the cover map knows about.
 *
 * The static catalog still carries qualifiers the database no longer has
 * ("ประวัติศาสตร์ (One Page)", "คณิตศาสตร์ พื้นฐาน (2567)", "สไลด์ประวัติศาสตร์ (จีน)"),
 * so match on an exact name first, then on the name with its trailing
 * parenthetical stripped, then on the leading word.
 */
function normalizeSubject(subject: string): string | null {
  const s = subject.trim().replace(/\s+/g, " ");
  if (SUBJECT_COVER_SLUGS[s]) return s;

  const stripped = s.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (SUBJECT_COVER_SLUGS[stripped]) return stripped;

  // "สไลด์ประวัติศาสตร์ (จีน)" -> "ประวัติศาสตร์"
  if (stripped.startsWith("สไลด์")) {
    const base = stripped.replace(/^สไลด์/, "").trim();
    if (SUBJECT_COVER_SLUGS[base]) return base;
  }

  // "คณิตศาสตร์ พื้นฐาน (2567)" -> "คณิตศาสตร์"
  const firstWord = stripped.split(" ")[0];
  if (SUBJECT_COVER_SLUGS[firstWord]) return firstWord;

  // "ภาษาอังกฤษเพิ่มเติม" -> "ภาษาอังกฤษ"
  const prefixMatch = Object.keys(SUBJECT_COVER_SLUGS).find((k) =>
    stripped.startsWith(k)
  );
  return prefixMatch ?? null;
}

export function getSubjectCoverSrc(subject: string): string | null {
  const key = normalizeSubject(subject);
  if (!key) return null;
  return `/subject-cover/${SUBJECT_COVER_SLUGS[key]}.png`;
}

export function getSubjectBadgeClass(subject: string) {
  // Colour by the normalized subject so variants share one colour.
  const key = normalizeSubject(subject) ?? subject;
  return BADGE_PALETTE[hashString(key) % BADGE_PALETTE.length];
}
