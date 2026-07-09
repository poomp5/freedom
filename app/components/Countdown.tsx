"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { EXAM_TARGET, TZ_OFFSET_HOURS } from "./config";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function getFallbackTargetTimestamp() {
  const makeTargetTimestampUTC = (y: number) =>
    Date.UTC(
      y,
      EXAM_TARGET.month - 1,
      EXAM_TARGET.day,
      EXAM_TARGET.hour - TZ_OFFSET_HOURS,
      EXAM_TARGET.minute,
      EXAM_TARGET.second,
      0
    );

  const nowUTC = Date.now();
  let targetYear: number;

  if (EXAM_TARGET.everyYear) {
    const thisYear = new Date().getFullYear();
    const thisYearTs = makeTargetTimestampUTC(thisYear);
    targetYear = nowUTC > thisYearTs ? thisYear + 1 : thisYear;
  } else {
    // @ts-expect-error year may be absent by design
    targetYear = EXAM_TARGET.year ?? new Date().getFullYear();
  }

  return makeTargetTimestampUTC(targetYear);
}

function getTimeLeft(targetTimestamp: number): TimeLeft | null {
  const diff = targetTimestamp - Date.now();

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
  };
}

export default function Countdown() {
  const trpc = useTRPC();
  const [fallbackTargetTimestamp] = useState(getFallbackTargetTimestamp);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft(fallbackTargetTimestamp)
  );
  const [isCountdownOver, setIsCountdownOver] = useState(
    () => getTimeLeft(fallbackTargetTimestamp) === null
  );
  const { data: countdownSetting } = useQuery(
    trpc.settings.getCountdown.queryOptions()
  );

  const targetTimestamp = countdownSetting?.targetAt
    ? new Date(countdownSetting.targetAt).getTime()
    : fallbackTargetTimestamp;

  useEffect(() => {
    const id = setInterval(() => {
      const nextTimeLeft = getTimeLeft(targetTimestamp);
      if (!nextTimeLeft) {
        setIsCountdownOver(true);
        setTimeLeft(null);
        clearInterval(id);
        return;
      }

      setIsCountdownOver(false);
      setTimeLeft(nextTimeLeft);
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
    <div className="flex flex-col items-center lg:items-start">
      {isCountdownOver ? (
        <div className="text-center lg:text-left text-3xl font-bold text-green-600">
          เริ่มสอบแล้ว 🎉
        </div>
      ) : (
        <>
          <div className="mt-2 kanit text-gray-600 font-bold text-center lg:text-left max-w-screen-sm md:max-w-screen-xl">
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
