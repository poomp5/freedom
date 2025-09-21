"use client";
import { useEffect, useMemo, useState } from "react";
import { EXAM_TARGET, TZ_OFFSET_HOURS } from "./config";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isCountdownOver, setIsCountdownOver] = useState(false);

  // สร้าง timestamp ของเป้าหมายในรูป UTC จากเวลาไทย
  const targetTimestamp = useMemo(() => {
    const makeTargetTimestampUTC = (y: number) =>
      Date.UTC(
        y,
        EXAM_TARGET.month - 1,
        EXAM_TARGET.day,
        EXAM_TARGET.hour - TZ_OFFSET_HOURS, // แปลงเวลาไทย -> UTC
        EXAM_TARGET.minute,
        EXAM_TARGET.second,
        0
      );

    const nowUTC = Date.now();

    // กำหนดปีเป้าหมาย
    let targetYear: number;
    if (EXAM_TARGET.everyYear) {
      const thisYear = new Date().getFullYear();
      const thisYearTs = makeTargetTimestampUTC(thisYear);
      targetYear = nowUTC > thisYearTs ? thisYear + 1 : thisYear;
    } else {
      // ถ้าระบุปีตายตัว (เพิ่ม field year ใน EXAM_TARGET)
      // @ts-expect-error year may be absent by design
      targetYear = EXAM_TARGET.year ?? new Date().getFullYear();
    }

    return makeTargetTimestampUTC(targetYear);
  }, []);

  useEffect(() => {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;

    const tick = (): TimeLeft | null => {
      const now = Date.now();
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        setIsCountdownOver(true);
        return null;
      }

      return {
        days: Math.floor(diff / DAY),
        hours: Math.floor((diff % DAY) / HOUR),
        minutes: Math.floor((diff % HOUR) / MINUTE),
        seconds: Math.floor((diff % MINUTE) / SECOND),
      };
    };

    // initial
    const init = tick();
    if (init) setTimeLeft(init);

    const id = setInterval(() => {
      const t = tick();
      if (!t) clearInterval(id);
      else setTimeLeft(t);
    }, 1000);

    return () => clearInterval(id);
  }, [targetTimestamp]);

  const renderVal = (v?: number) =>
    v === undefined || v === null ? (
      <span className="inline-block w-10 h-10 bg-gray-100 animate-pulse rounded" />
    ) : (
      String(v).padStart(2, "0")
    );

  return (
    <div className="flex flex-col items-center justify-center">
      {isCountdownOver ? (
        <div className="text-center text-3xl font-bold text-green-600">
          เริ่มสอบแล้ว 🎉
        </div>
      ) : (
        <>
          <div className="mt-2 kanit text-gray-600 font-bold text-center max-w-screen-sm md:max-w-screen-xl">
            <ul className="inline-flex space-x-2 md:space-x-8">
              {[
                { label: "DAYS", value: timeLeft?.days },
                { label: "HOURS", value: timeLeft?.hours },
                { label: "MINUTES", value: timeLeft?.minutes },
                { label: "SECONDS", value: timeLeft?.seconds },
              ].map(({ label, value }) => (
                <li key={label} className="inline-block rounded-lg p-3">
                  <span className="text-4xl text-gray-600 countdown-span">
                    {renderVal(value)}
                  </span>
                  <div className="mt-2 font-semibold text-gray-500">
                    {label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
