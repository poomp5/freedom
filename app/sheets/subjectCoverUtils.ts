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

export function getSubjectCoverSrc(subject: string): string | null {
  const slug = SUBJECT_COVER_SLUGS[subject];
  if (!slug) return null;
  return `/subject-cover/${slug}.png`;
}

export function getSubjectBadgeClass(subject: string) {
  return BADGE_PALETTE[hashString(subject) % BADGE_PALETTE.length];
}
