/**
 * Canonical subject list. Kept in one place so the upload form, the admin edit
 * modal and the tRPC validators cannot drift apart.
 *
 * Free-text subjects used to be allowed, which produced dozens of near-duplicate
 * values ("ประวัติศาสตร์ (One Page)", "คณิตศาสตร์ พื้นฐาน (2567)", "อังกฤษ" ...)
 * that broke subject filtering and cover-image lookup. Uploads now must pick from
 * this list; anything that does not fit goes under "อื่นๆ".
 */
export const SUBJECTS = [
  "คณิตศาสตร์",
  "วิทยาศาสตร์",
  "ภาษาไทย",
  "ภาษาอังกฤษ",
  "สังคมศึกษา",
  "ประวัติศาสตร์",
  "สุขศึกษา",
  "ศิลปะ",
  "การงานอาชีพ",
  "ฟิสิกส์",
  "เคมี",
  "ชีววิทยา",
  "อื่นๆ",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export function isValidSubject(value: string): value is Subject {
  return (SUBJECTS as readonly string[]).includes(value);
}
