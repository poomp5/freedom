// components/var.tsx

// ปีการศึกษา (ไทย)
export const year = "2568";
export const basePath = "midterm2";

// โซนเวลาหลักของโปรเจกต์
export const TIMEZONE = "Asia/Bangkok"; // GMT+7 (ไม่มี DST)
export const TZ_OFFSET_HOURS = 7;

// วัน/เวลาเป้าหมาย (ตามเวลาไทย)
// ถ้าอยาก “วันเดียวกันทุกปี” ให้กำหนด everyYear = true
export const EXAM_TARGET = {
  month: 2, // กันยายน = 9
  day: 23, // วัน
  hour: 8, 
  minute: 30,
  second: 0,
  everyYear: false,
  // ถ้าอยาก fix ปีเดียว ใส่ year: 2025 แล้วตั้ง everyYear=false
} as const;

// เวลาสอบ ม.ปลาย 8:30 น.
// เวลาสอบ ม.ต้น 8:40 น.