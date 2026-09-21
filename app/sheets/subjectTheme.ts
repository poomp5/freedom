const PALETTE = [
  { gradient: "from-emerald-400 to-teal-500", badge: "bg-emerald-50 text-emerald-700" },
  { gradient: "from-sky-400 to-blue-500", badge: "bg-blue-50 text-blue-700" },
  { gradient: "from-fuchsia-400 to-purple-500", badge: "bg-purple-50 text-purple-700" },
  { gradient: "from-rose-400 to-red-500", badge: "bg-rose-50 text-rose-700" },
  { gradient: "from-amber-400 to-orange-500", badge: "bg-amber-50 text-amber-700" },
  { gradient: "from-indigo-400 to-violet-500", badge: "bg-indigo-50 text-indigo-700" },
  { gradient: "from-cyan-400 to-sky-500", badge: "bg-cyan-50 text-cyan-700" },
  { gradient: "from-lime-400 to-green-500", badge: "bg-lime-50 text-lime-700" },
] as const;

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getSubjectTheme(subject: string) {
  const index = hashString(subject) % PALETTE.length;
  return PALETTE[index];
}
