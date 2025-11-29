export interface SheetData {
  subject: string;
  filename: string;
  term: string;
  level: string;
  examType: string;
  by?: string;
  icon: string;
}

// Map icon ตามวิชา
function getIconBySubject(subject: string): string {
  const s = subject.toLowerCase();
  if (s.includes("คณิต") || s.includes("math")) return "/assets/img/icon/math.png";
  if (s.includes("ฟิสิกส์") || s.includes("phy")) return "/assets/img/icon/physics.png";
  if (s.includes("เคมี") || s.includes("chem")) return "/assets/img/icon/chemistry.png";
  if (s.includes("ชีว") || s.includes("bio")) return "/assets/img/icon/biology.png";
  if (s.includes("วิทย์") || s.includes("sci")) return "/assets/img/icon/sci.png";
  if (s.includes("ไทย") || s.includes("thai")) return "/assets/img/icon/thai.png";
  if (s.includes("สังคม") || s.includes("social")) return "/assets/img/icon/social.png";
  if (s.includes("ประวัติ") || s.includes("history")) return "/assets/img/icon/history.png";
  if (s.includes("อังกฤษ") || s.includes("eng")) return "/assets/img/icon/english.png";
  return "/assets/img/icon/freedomblack.png";
}

// ข้อมูลชีททั้งหมดสำหรับค้นหา
export const allSheets: SheetData[] = [
  // ===== ม.1 =====
  // ม.1 ปลายภาค เทอม 1
  { subject: "วิทยาศาสตร์", filename: "/m1/final1/sci.pdf", term: "เทอม 1", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาไทย", filename: "/m1/final1/thai.pdf", term: "เทอม 1", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("ไทย") },
  { subject: "สังคมศึกษา", filename: "/m1/final1/social.pdf", term: "เทอม 1", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("สังคม") },
  { subject: "ประวัติศาสตร์", filename: "/m1/final1/history.pdf", term: "เทอม 1", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("ประวัติ") },
  { subject: "ภาษาอังกฤษ", filename: "/m1/final1/eng.pdf", term: "เทอม 1", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("อังกฤษ") },

  // ม.1 ปลายภาค เทอม 2
  { subject: "วิทยาศาสตร์", filename: "/m1/final2/sci.pdf", term: "เทอม 2", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาอังกฤษ", filename: "/m1/final2/eng.pdf", term: "เทอม 2", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("อังกฤษ") },
  { subject: "ประวัติศาสตร์", filename: "/m1/final2/history.pdf", term: "เทอม 2", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("ประวัติ") },
  { subject: "สังคมศึกษา", filename: "/m1/final2/social.pdf", term: "เทอม 2", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("สังคม") },
  { subject: "ภาษาไทย", filename: "/m1/final2/thai.pdf", term: "เทอม 2", level: "ม.1", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("ไทย") },

  // ===== ม.2 =====
  // ม.2 กลางภาค เทอม 1
  { subject: "ประวัติศาสตร์", filename: "/m2/midterm1/history.pdf", term: "เทอม 1", level: "ม.2", examType: "กลางภาค", by: "nxtt.ywy", icon: getIconBySubject("ประวัติ") },
  { subject: "สังคมศึกษา", filename: "/m2/midterm1/social.pdf", term: "เทอม 1", level: "ม.2", examType: "กลางภาค", by: "blevrsq", icon: getIconBySubject("สังคม") },
  { subject: "ภาษาอังกฤษ", filename: "/m2/midterm1/english.pdf", term: "เทอม 1", level: "ม.2", examType: "กลางภาค", by: "antnut8778", icon: getIconBySubject("อังกฤษ") },
  { subject: "คณิตศาสตร์", filename: "/m2/midterm1/math.pdf", term: "เทอม 1", level: "ม.2", examType: "กลางภาค", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์", filename: "/m2/midterm1/sci.pdf", term: "เทอม 1", level: "ม.2", examType: "กลางภาค", icon: getIconBySubject("วิทย์") },

  // ม.2 ปลายภาค เทอม 1
  { subject: "คณิตศาสตร์", filename: "/m2/final1/math.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "blevrsq_", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์", filename: "/m2/final1/sci.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "meemmiiimi", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาอังกฤษ", filename: "/m2/final1/eng.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "meemmiiimi", icon: getIconBySubject("อังกฤษ") },
  { subject: "สังคมศึกษา", filename: "/m2/final1/social.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "ม.ลีฟ", icon: getIconBySubject("สังคม") },
  { subject: "ภาษาไทย", filename: "/m2/final1/thai.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("ไทย") },
  { subject: "สไลด์ประวัติศาสตร์ (เกาหลี)", filename: "/m2/final1/korea.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "ม.เต", icon: getIconBySubject("ประวัติ") },
  { subject: "สไลด์ประวัติศาสตร์ (ญี่ปุ่น)", filename: "/m2/final1/japan.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "ม.เต", icon: getIconBySubject("ประวัติ") },
  { subject: "สไลด์ประวัติศาสตร์ (จีน)", filename: "/m2/final1/china.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "ม.เต", icon: getIconBySubject("ประวัติ") },
  { subject: "สไลด์ประวัติศาสตร์ (อินเดีย)", filename: "/m2/final1/india.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "ม.เต", icon: getIconBySubject("ประวัติ") },
  { subject: "สไลด์ประวัติศาสตร์ (อาหรับ)", filename: "/m2/final1/arab.pdf", term: "เทอม 1", level: "ม.2", examType: "ปลายภาค", by: "ม.เต", icon: getIconBySubject("ประวัติ") },

  // ม.2 กลางภาค เทอม 2
  { subject: "วิทยาศาสตร์", filename: "/m2/midterm2/sci.pdf", term: "เทอม 2", level: "ม.2", examType: "กลางภาค", by: "meemmiiimi", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาไทย", filename: "/m2/midterm2/thai.pdf", term: "เทอม 2", level: "ม.2", examType: "กลางภาค", by: "zong_angpao", icon: getIconBySubject("ไทย") },
  { subject: "สังคมศึกษา", filename: "/m2/midterm2/social.pdf", term: "เทอม 2", level: "ม.2", examType: "กลางภาค", by: "zong_angpao", icon: getIconBySubject("สังคม") },
  { subject: "ประวัติศาสตร์", filename: "/m2/midterm2/history.pdf", term: "เทอม 2", level: "ม.2", examType: "กลางภาค", by: "zong_angpao", icon: getIconBySubject("ประวัติ") },
  { subject: "คณิตศาสตร์", filename: "/m2/midterm2/math.pdf", term: "เทอม 2", level: "ม.2", examType: "กลางภาค", by: "meemmiiimi", icon: getIconBySubject("คณิต") },

  // ม.2 ปลายภาค เทอม 2
  { subject: "คณิตศาสตร์ (ใหม่)", filename: "/m2/final2/math_new.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "meemmiiimi", icon: getIconBySubject("คณิต") },
  { subject: "คณิตศาสตร์", filename: "/m2/final2/math.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์ (ใหม่)", filename: "/m2/final2/sci_new.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "meemmiiimi", icon: getIconBySubject("วิทย์") },
  { subject: "วิทยาศาสตร์ (2566)", filename: "/m2/final2/sci_66.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("วิทย์") },
  { subject: "วิทยาศาสตร์", filename: "/m2/final2/sci.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาไทย (2566)", filename: "/m2/final2/thai.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("ไทย") },
  { subject: "ภาษาไทย", filename: "/m2/final2/thai_old.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("ไทย") },
  { subject: "สังคมศึกษา (ทวีปยุโรป)", filename: "/m2/final2/social_europe.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "blevrsq_", icon: getIconBySubject("สังคม") },
  { subject: "สังคมศึกษา (2566)", filename: "/m2/final2/social_66.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("สังคม") },
  { subject: "สังคมศึกษา", filename: "/m2/final2/social.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("สังคม") },
  { subject: "ภาษาอังกฤษ (ใหม่)", filename: "/m2/final2/eng_new2.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "meemmiiimi", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ (ใหม่)", filename: "/m2/final2/eng_new.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "resoo0_", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ (2566)", filename: "/m2/final2/eng_66.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ", filename: "/m2/final2/eng.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("อังกฤษ") },
  { subject: "ประวัติศาสตร์", filename: "/m2/final2/history.pdf", term: "เทอม 2", level: "ม.2", examType: "ปลายภาค", icon: getIconBySubject("ประวัติ") },

  // ===== ม.3 =====
  // ม.3 กลางภาค เทอม 1
  { subject: "คณิตศาสตร์", filename: "/m3/midterm1/math67.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "nxmnuxng_q", icon: getIconBySubject("คณิต") },
  { subject: "คณิตศาสตร์", filename: "/m3/midterm1/math.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์ (2567)", filename: "/m3/midterm1/sci67.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "nxmnuxng_q", icon: getIconBySubject("วิทย์") },
  { subject: "วิทยาศาสตร์ (ม.ปอนด์)", filename: "/m3/midterm1/sci.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาไทย", filename: "/m3/midterm1/thai68.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "ger_nakub", icon: getIconBySubject("ไทย") },
  { subject: "ภาษาไทย", filename: "/m3/midterm1/thai67.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "nxmnuxng_q", icon: getIconBySubject("ไทย") },
  { subject: "ภาษาไทย", filename: "/m3/midterm1/thai.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", icon: getIconBySubject("ไทย") },
  { subject: "สังคมศึกษา", filename: "/m3/midterm1/social68.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "antnut8778", icon: getIconBySubject("สังคม") },
  { subject: "สังคมศึกษา (One Page)", filename: "/m3/midterm1/social_onepage.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "blevrsq", icon: getIconBySubject("สังคม") },
  { subject: "สังคมศึกษา (2567)", filename: "/m3/midterm1/social67.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "nxmnuxng_q", icon: getIconBySubject("สังคม") },
  { subject: "สังคมศึกษา (2566)", filename: "/m3/midterm1/social.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", icon: getIconBySubject("สังคม") },
  { subject: "ประวัติศาสตร์", filename: "/m3/midterm1/history.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "ger_nakub", icon: getIconBySubject("ประวัติ") },
  { subject: "ประวัติศาสตร์ (One Page)", filename: "/m3/midterm1/history_onepage.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "blevrsq", icon: getIconBySubject("ประวัติ") },
  { subject: "ประวัติศาสตร์ (2567)", filename: "/m3/midterm1/history67.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "nxmnuxng_q", icon: getIconBySubject("ประวัติ") },
  { subject: "ภาษาอังกฤษ", filename: "/m3/midterm1/english68.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "ger_nakub", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ (2567)", filename: "/m3/midterm1/english67.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", by: "nxmnuxng_q", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ (2566)", filename: "/m3/midterm1/eng.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษเพิ่มเติม", filename: "/m3/midterm1/iep.pdf", term: "เทอม 1", level: "ม.3", examType: "กลางภาค", icon: "/assets/img/icon/iepicon.png" },

  // ม.3 ปลายภาค เทอม 1
  { subject: "คณิตศาสตร์", filename: "/m3/final1/math-new.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", by: "blevrsq", icon: getIconBySubject("คณิต") },
  { subject: "คณิตศาสตร์ (2567)", filename: "/m3/final1/math.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์", filename: "/m3/final1/sci-chemis.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", by: "antnut8778", icon: getIconBySubject("วิทย์") },
  { subject: "วิทยาศาสตร์ (2567)", filename: "/m3/final1/sci-nana.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", by: "jirariin", icon: getIconBySubject("วิทย์") },
  { subject: "วิทยาศาสตร์ (2566)", filename: "/m3/final1/sci.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาไทย", filename: "/m3/final1/thai.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("ไทย") },
  { subject: "สังคมศึกษา", filename: "/m3/final1/social.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("สังคม") },
  { subject: "ประวัติศาสตร์", filename: "/m3/final1/history-new.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", by: "antnut8778", icon: getIconBySubject("ประวัติ") },
  { subject: "ประวัติศาสตร์ (2567)", filename: "/m3/final1/history.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("ประวัติ") },
  { subject: "ภาษาอังกฤษ", filename: "/m3/final1/eng.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ", filename: "/m3/final1/eng-new.pdf", term: "เทอม 1", level: "ม.3", examType: "ปลายภาค", by: "blevrsq", icon: getIconBySubject("อังกฤษ") },

  // ม.3 ปลายภาค เทอม 2
  { subject: "คณิตศาสตร์", filename: "/m3/final2/math.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์", filename: "/m3/final2/sci.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("วิทย์") },
  { subject: "ภาษาไทย (เนื้อหาวิจัย)", filename: "/m3/final2/thai_new.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", by: "ขบวนการมะ", icon: getIconBySubject("ไทย") },
  { subject: "ภาษาไทย", filename: "/m3/final2/thai.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("ไทย") },
  { subject: "สังคมศึกษา", filename: "/m3/final2/social.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("สังคม") },
  { subject: "ประวัติศาสตร์ (ใหม่)", filename: "/m3/final2/history_new.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", by: "nxmnuxng_q", icon: getIconBySubject("ประวัติ") },
  { subject: "ประวัติศาสตร์", filename: "/m3/final2/history.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("ประวัติ") },
  { subject: "ภาษาอังกฤษ (ใหม่)", filename: "/m3/final2/eng_new.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ", filename: "/m3/final2/eng.pdf", term: "เทอม 2", level: "ม.3", examType: "ปลายภาค", icon: getIconBySubject("อังกฤษ") },

  // ===== ม.4 =====
  // ม.4 กลางภาค เทอม 1
  { subject: "ภาษาไทย", filename: "/m4/midterm1/thai.pdf", term: "เทอม 1", level: "ม.4", examType: "กลางภาค", by: "cholemie", icon: getIconBySubject("ไทย") },
  { subject: "ภาษาอังกฤษ", filename: "/m4/midterm1/english.pdf", term: "เทอม 1", level: "ม.4", examType: "กลางภาค", by: "cholemie", icon: getIconBySubject("อังกฤษ") },
  { subject: "ประวัติศาสตร์", filename: "/m4/midterm1/history.pdf", term: "เทอม 1", level: "ม.4", examType: "กลางภาค", by: "cholemie", icon: getIconBySubject("ประวัติ") },
  { subject: "สังคมศึกษา", filename: "/m4/midterm1/social.pdf", term: "เทอม 1", level: "ม.4", examType: "กลางภาค", by: "cholemie", icon: getIconBySubject("สังคม") },
  { subject: "สังคมศึกษา (2567)", filename: "/m4/midterm1/social2567.pdf", term: "เทอม 1", level: "ม.4", examType: "กลางภาค", by: "มิสเกม", icon: getIconBySubject("สังคม") },

  // ม.4 ปลายภาค เทอม 1
  { subject: "ภาษาไทย (ย่อความ)", filename: "/m4/final1/thai.pdf", term: "เทอม 1", level: "ม.4", examType: "ปลายภาค", by: "mxyaaxce", icon: getIconBySubject("ไทย") },
  { subject: "คณิตศาสตร์ พื้นฐาน (ใหม่)", filename: "/m4/final1/math-new.pdf", term: "เทอม 1", level: "ม.4", examType: "ปลายภาค", by: "kenmary_15", icon: getIconBySubject("คณิต") },
  { subject: "คณิตศาสตร์ พื้นฐาน (2567)", filename: "/m4/final1/math.pdf", term: "เทอม 1", level: "ม.4", examType: "ปลายภาค", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์ (ห้องศิลป์)", filename: "/m4/final1/sci.pdf", term: "เทอม 1", level: "ม.4", examType: "ปลายภาค", icon: getIconBySubject("วิทย์") },
  { subject: "ชีววิทยา (ห้องสายวิทย์)", filename: "/m4/final1/biology.pdf", term: "เทอม 1", level: "ม.4", examType: "ปลายภาค", by: "มิสบีม", icon: getIconBySubject("ชีว") },
  { subject: "ภาษาอังกฤษ", filename: "/m4/final1/eng.pdf", term: "เทอม 1", level: "ม.4", examType: "ปลายภาค", by: "creammyeiieee__", icon: getIconBySubject("อังกฤษ") },

  // ม.4 กลางภาค เทอม 2
  { subject: "คณิตศาสตร์", filename: "/m4/midterm2/math.pdf", term: "เทอม 2", level: "ม.4", examType: "กลางภาค", by: "d3w4r_zz", icon: getIconBySubject("คณิต") },

  // ม.4 ปลายภาค เทอม 2
  { subject: "คณิตศาสตร์", filename: "/m4/final2/math.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "d3w4r_zz", icon: getIconBySubject("คณิต") },
  { subject: "คณิตศาสตร์ (เพิ่มเติม)", filename: "/m4/final2/math_extra.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "torgor_xlt.09", icon: getIconBySubject("คณิต") },
  { subject: "ชีววิทยา", filename: "/m4/final2/biology.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "torgor_xlt.09", icon: getIconBySubject("ชีว") },
  { subject: "เคมี", filename: "/m4/final2/chemistry.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "torgor_xlt.09", icon: getIconBySubject("เคมี") },
  { subject: "วิทยาศาสตร์", filename: "/m4/final2/sci_new.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "d3w4r_zz", icon: getIconBySubject("วิทย์") },
  { subject: "สังคมศึกษา", filename: "/m4/final2/social.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "มิสเกม", icon: getIconBySubject("สังคม") },
  { subject: "ฟิสิกส์", filename: "/m4/final2/physics2.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "torgor_xlt.09", icon: getIconBySubject("ฟิสิกส์") },
  { subject: "ภาษาอังกฤษ", filename: "/m4/final2/eng.pdf", term: "เทอม 2", level: "ม.4", examType: "ปลายภาค", by: "creammyeiieee__", icon: getIconBySubject("อังกฤษ") },

  // ===== ม.5 =====
  // ม.5 กลางภาค เทอม 1
  { subject: "วิทยาศาสตร์", filename: "/m5/midterm1/sci.pdf", term: "เทอม 1", level: "ม.5", examType: "กลางภาค", by: "มาสเตอร์พสิษฐ์", icon: getIconBySubject("วิทย์") },
  { subject: "สังคมศึกษา", filename: "/m5/midterm1/social.pdf", term: "เทอม 1", level: "ม.5", examType: "กลางภาค", by: "มาสเตอร์ตุ๊ต๊ะ", icon: getIconBySubject("สังคม") },
  { subject: "ประวัติศาสตร์", filename: "/m5/midterm1/history.pdf", term: "เทอม 1", level: "ม.5", examType: "กลางภาค", by: "มาสเตอร์เขม", icon: getIconBySubject("ประวัติ") },
  { subject: "ประวัติศาสตร์ (นเรศวร)", filename: "/m5/midterm1/history_naresuan.pdf", term: "เทอม 1", level: "ม.5", examType: "กลางภาค", by: "มาสเตอร์เขม", icon: getIconBySubject("ประวัติ") },
  { subject: "ชีววิทยา", filename: "/m5/midterm1/biology.pdf", term: "เทอม 1", level: "ม.5", examType: "กลางภาค", by: "torgor_xlt.09", icon: getIconBySubject("ชีว") },
  { subject: "ชีววิทยา (Plant tissue)", filename: "/m5/midterm1/biology_plant.pdf", term: "เทอม 1", level: "ม.5", examType: "กลางภาค", by: "torgor_xlt.09", icon: getIconBySubject("ชีว") },
  { subject: "คณิตศาสตร์", filename: "/m5/midterm1/math.pdf", term: "เทอม 1", level: "ม.5", examType: "กลางภาค", by: "d3w4r_zz", icon: getIconBySubject("คณิต") },

  // ม.5 ปลายภาค เทอม 1
  { subject: "ภาษาอังกฤษ", filename: "/m5/final1/eng-dewar.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "d3w4r_zz", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาอังกฤษ (สไลด์)", filename: "/m5/final1/eng.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "มิสโมนา", icon: getIconBySubject("อังกฤษ") },
  { subject: "ภาษาไทย", filename: "/m5/final1/thai-tiger.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "torgor_xlt.09", icon: getIconBySubject("ไทย") },
  { subject: "ภาษาไทย", filename: "/m5/final1/thai.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "foko._", icon: getIconBySubject("ไทย") },
  { subject: "คณิตศาสตร์ (พื้นฐาน)", filename: "/m5/final1/math.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "d3w4r_zz", icon: getIconBySubject("คณิต") },
  { subject: "วิทยาศาสตร์ (ห้องศิลป์)", filename: "/m5/final1/sci-dewar.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "d3w4r_zz", icon: getIconBySubject("วิทย์") },
  { subject: "วิทยาศาสตร์ (ห้องศิลป์)", filename: "/m5/final1/sci.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "มาสเตอร์พสิษฐ์", icon: getIconBySubject("วิทย์") },
  { subject: "เคมี (พื้นฐาน)", filename: "/m5/final1/chemis.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "bosssu_p", icon: getIconBySubject("เคมี") },
  { subject: "เคมี (GIFTED)", filename: "/m5/final1/chemis_gifted.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "iammaylyyyy", icon: "/assets/img/icon/elec-chemi.png" },
  { subject: "ชีววิทยา (ใหม่)", filename: "/m5/final1/biology-tiger.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "torgor_xlt.09", icon: getIconBySubject("ชีว") },
  { subject: "ฟิสิกส์", filename: "/m5/final1/physics.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "มาสเตอร์ปอนด์", icon: getIconBySubject("ฟิสิกส์") },
  { subject: "ฟิสิกส์", filename: "/m5/final1/physics-pai.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "kongphobbb.007", icon: getIconBySubject("ฟิสิกส์") },
  { subject: "ชีววิทยา (2567)", filename: "/m5/final1/biology-oil.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "cotarincy_", icon: getIconBySubject("ชีว") },
  { subject: "ชีววิทยา (2567)", filename: "/m5/final1/biology.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "bosssu_p", icon: getIconBySubject("ชีว") },
  { subject: "ประวัติศาสตร์", filename: "/m5/final1/history.pdf", term: "เทอม 1", level: "ม.5", examType: "ปลายภาค", by: "มาสเตอร์เขม", icon: getIconBySubject("ประวัติ") },

  // ม.5 ปลายภาค เทอม 2
  { subject: "ภาษาไทย", filename: "/m5/final2/thai.pdf", term: "เทอม 2", level: "ม.5", examType: "ปลายภาค", by: "bosssu_p", icon: getIconBySubject("ไทย") },
  { subject: "ภาษาอังกฤษ", filename: "/m5/final2/eng.pdf", term: "เทอม 2", level: "ม.5", examType: "ปลายภาค", by: "creammyeiieee__", icon: getIconBySubject("อังกฤษ") },

  // ===== ม.6 =====
  // ม.6 กลางภาค เทอม 1
  { subject: "ชีววิทยา", filename: "/m6/midterm1/biology.pdf", term: "เทอม 1", level: "ม.6", examType: "กลางภาค", by: "bosssu_p", icon: getIconBySubject("ชีว") },

  // ม.6 ปลายภาค เทอม 1
  { subject: "ชีววิทยา (เรื่อง ประชากร)", filename: "/m6/final1/biology.pdf", term: "เทอม 1", level: "ม.6", examType: "ปลายภาค", by: "cotarincy_", icon: getIconBySubject("ชีว") },
];

export function searchSheets(query: string): SheetData[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  return allSheets.filter((sheet) => {
    const searchText = `${sheet.subject} ${sheet.level} ${sheet.term} ${sheet.examType} ${sheet.by || ""}`.toLowerCase();
    return searchText.includes(lowerQuery);
  }).slice(0, 10);
}
