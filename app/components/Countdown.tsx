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

function CountdownSkeleton() {
  return (
    <div className="mt-2 kanit text-gray-600 font-bold text-center lg:text-left max-w-screen-sm md:max-w-screen-xl">
      <ul className="inline-flex space-x-2 md:space-x-8">
        {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label) => (
          <li key={label} className="inline-block rounded-lg p-3">
            <span className="inline-block w-10 h-10 bg-gray-100 animate-pulse rounded" />
            <div className="mt-2 font-semibold text-gray-500">{label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Countdown() {
  const trpc = useTRPC();
  const [fallbackTargetTimestamp] = useState(getFallbackTargetTimestamp);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isCountdownOver, setIsCountdownOver] = useState(false);
  const { data: countdownSetting, isPending } = useQuery(
    trpc.settings.getCountdown.queryOptions()
  );

  const isReady = !isPending;
  const targetTimestamp = isReady
    ? countdownSetting?.targetAt
      ? new Date(countdownSetting.targetAt).getTime()
      : fallbackTargetTimestamp
    : null;

  const dbTargetTimestamp = countdownSetting?.targetAt
    ? new Date(countdownSetting.targetAt).getTime()
    : null;

  // #region agent log
  useEffect(() => {
    if (!isReady || targetTimestamp === null) return;

    fetch("http://127.0.0.1:7645/ingest/6c303bc5-ee2f-407a-bde7-e362c1a5a85e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "90ed45",
      },
      body: JSON.stringify({
        sessionId: "90ed45",
        runId: "post-fix",
        hypothesisId: "A,C,E",
        location: "Countdown.tsx:targetTimestamp",
        message: "target source comparison",
        data: {
          isReady,
          hasDbData: !!countdownSetting?.targetAt,
          fallbackTargetTimestamp,
          dbTargetTimestamp,
          activeTargetTimestamp: targetTimestamp,
          fallbackIsPast: getTimeLeft(fallbackTargetTimestamp) === null,
          dbIsPast: dbTargetTimestamp
            ? getTimeLeft(dbTargetTimestamp) === null
            : null,
          activeIsPast: getTimeLeft(targetTimestamp) === null,
          isCountdownOver,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [
    isReady,
    countdownSetting?.targetAt,
    targetTimestamp,
    fallbackTargetTimestamp,
    dbTargetTimestamp,
    isCountdownOver,
  ]);
  // #endregion

  useEffect(() => {
    if (targetTimestamp === null) return;

    const tick = () => {
      const nextTimeLeft = getTimeLeft(targetTimestamp);
      const over = nextTimeLeft === null;
      setIsCountdownOver(over);
      setTimeLeft(nextTimeLeft);
      return nextTimeLeft;
    };

    // #region agent log
    const initialTimeLeft = tick();
    fetch("http://127.0.0.1:7645/ingest/6c303bc5-ee2f-407a-bde7-e362c1a5a85e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "90ed45",
      },
      body: JSON.stringify({
        sessionId: "90ed45",
        runId: "post-fix",
        hypothesisId: "B",
        location: "Countdown.tsx:useEffect",
        message: "immediate sync on target change",
        data: {
          targetTimestamp,
          hasTimeLeft: initialTimeLeft !== null,
          computedIsPast: initialTimeLeft === null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (initialTimeLeft === null) return;

    const id = setInterval(() => {
      const nextTimeLeft = tick();
      // #region agent log
      fetch("http://127.0.0.1:7645/ingest/6c303bc5-ee2f-407a-bde7-e362c1a5a85e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "90ed45",
        },
        body: JSON.stringify({
          sessionId: "90ed45",
          runId: "post-fix",
          hypothesisId: "B,D",
          location: "Countdown.tsx:interval",
          message: "interval tick",
          data: {
            targetTimestamp,
            hasTimeLeft: nextTimeLeft !== null,
            willSetOver: nextTimeLeft === null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      if (nextTimeLeft === null) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [targetTimestamp]);

  const renderVal = (v?: number) =>
    v === undefined || v === null ? (
      <span className="inline-block w-10 h-10 bg-gray-100 animate-pulse rounded" />
    ) : (
      String(v).padStart(2, "0")
    );

  if (!isReady) {
    return (
      <div className="flex flex-col items-center lg:items-start">
        <CountdownSkeleton />
      </div>
    );
  }

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
