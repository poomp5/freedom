"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Download, Eye, FileText, MousePointerClick, Upload, Users } from "lucide-react";
import { useTRPC } from "@/trpc/client";

type Days = 7 | 30 | 90;
type SeriesKey = "pageViews" | "sheetViews" | "downloads" | "uploads";
type TotalKey = SeriesKey | "visitors";

const RANGES: { value: Days; label: string }[] = [
  { value: 7, label: "7 วัน" },
  { value: 30, label: "30 วัน" },
  { value: 90, label: "90 วัน" },
];

const METRICS: {
  key: TotalKey;
  label: string;
  icon: typeof Eye;
  adminOnly?: boolean;
  /** Visitors are only available as a period total, not per day. */
  chartable: boolean;
}[] = [
  { key: "pageViews", label: "การเข้าชมเว็บ", icon: MousePointerClick, adminOnly: true, chartable: true },
  { key: "visitors", label: "ผู้เข้าชม (ไม่ซ้ำ)", icon: Users, adminOnly: true, chartable: false },
  { key: "sheetViews", label: "เปิดดูชีท", icon: Eye, chartable: true },
  { key: "downloads", label: "โหลดชีท", icon: Download, chartable: true },
  { key: "uploads", label: "อัปโหลด", icon: Upload, chartable: true },
];

const nf = new Intl.NumberFormat("th-TH");

function formatDay(date: string, style: "short" | "long" = "short") {
  return new Date(`${date}T00:00:00+07:00`).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    ...(style === "long" ? { weekday: "short" } : {}),
    timeZone: "Asia/Bangkok",
  });
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return <span className="text-xs text-gray-400">{current > 0 ? "ใหม่ในช่วงนี้" : "—"}</span>;
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {up ? "+" : ""}
      {pct}%<span className="ml-1 font-normal text-gray-400">จากช่วงก่อน</span>
    </span>
  );
}

function BarChart({ data, metric, label }: { data: { date: string; value: number }[]; metric: string; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  // A "nice" rounded top so the grid lines land on readable numbers.
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const top = Math.ceil(max / magnitude) * magnitude;
  const ticks = [top, top / 2, 0];
  const labelEvery = Math.ceil(data.length / 7);
  const active = hover != null ? data[hover] : null;

  return (
    <figure aria-label={`${label} รายวัน`}>
      <div className="relative flex gap-2">
        {/* y axis */}
        <div className="flex h-48 w-8 shrink-0 flex-col justify-between text-right text-[10px] text-gray-400">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
              {nf.format(t)}
            </span>
          ))}
        </div>

        <div className="relative h-48 flex-1">
          {/* recessive grid */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden="true">
            {ticks.map((t) => (
              <div key={t} className="border-t border-dashed border-gray-100 last:border-solid last:border-gray-200" />
            ))}
          </div>

          <div className="absolute inset-0 flex items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
            {data.map((d, i) => (
              <button
                key={d.date}
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${formatDay(d.date, "long")}: ${nf.format(d.value)} ${metric}`}
                className="group flex h-full flex-1 items-end focus:outline-none"
              >
                <span
                  className={`block w-full rounded-t-[4px] transition-colors ${
                    hover === i ? "bg-blue-700" : "bg-blue-500 group-focus-visible:bg-blue-700"
                  }`}
                  style={{ height: d.value > 0 ? `max(2px, ${(d.value / top) * 100}%)` : 0 }}
                />
              </button>
            ))}
          </div>

          {active && hover != null && (
            <div
              role="status"
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
              style={{ left: `clamp(48px, ${((hover + 0.5) / data.length) * 100}%, calc(100% - 48px))` }}
            >
              <p className="text-gray-300">{formatDay(active.date, "long")}</p>
              <p className="font-semibold">
                {nf.format(active.value)} {metric}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* x axis */}
      <div className="ml-10 mt-2 flex gap-[2px] text-[10px] text-gray-400" aria-hidden="true">
        {data.map((d, i) => (
          <span key={d.date} className="flex-1 overflow-visible whitespace-nowrap text-center">
            {i % labelEvery === 0 ? formatDay(d.date) : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}

export default function DashboardAnalytics() {
  const trpc = useTRPC();
  const [days, setDays] = useState<Days>(30);
  const { data, isLoading, isError } = useQuery({
    ...trpc.analytics.overview.queryOptions({ days }),
    placeholderData: (prev) => prev,
  });

  const metrics = METRICS.filter((m) => !m.adminOnly || data?.isAdmin);
  const [selected, setSelected] = useState<SeriesKey | null>(null);
  const chartKey: SeriesKey = selected ?? (data?.isAdmin ? "pageViews" : "downloads");
  const chartMetric = METRICS.find((m) => m.key === chartKey)!;

  return (
    <section className="mt-6 space-y-4" aria-labelledby="analytics-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="analytics-heading" className="text-lg font-bold text-gray-800">
            สถิติ{data && !data.isAdmin ? "ชีทของคุณ" : "การใช้งาน"}
          </h2>
          <p className="text-sm text-gray-500">
            {data?.isAdmin ? "ภาพรวมทั้งเว็บไซต์" : "การเข้าชมและการโหลดชีทที่คุณอัปโหลด"} · เวลาไทย
          </p>
        </div>
        <div role="radiogroup" aria-label="ช่วงเวลา" className="inline-flex rounded-xl bg-gray-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={days === r.value}
              onClick={() => setDays(r.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                days === r.value ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          โหลดสถิติไม่สำเร็จ กรุณารีเฟรชหน้า
        </div>
      ) : isLoading || !data ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-2 gap-3 ${metrics.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-3"}`}>
            {metrics.map((m) => {
              const total = data.totals[m.key];
              const isActive = m.chartable && chartKey === m.key;
              const Icon = m.icon;
              const content = (
                <>
                  <p className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {m.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">{nf.format(total.current)}</p>
                  <div className="mt-1">
                    <Delta current={total.current} previous={total.previous} />
                  </div>
                </>
              );
              const base = "rounded-2xl border bg-white p-4 text-left shadow-sm transition-colors";
              return m.chartable ? (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelected(m.key as SeriesKey)}
                  className={`${base} ${isActive ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100 hover:border-blue-200"}`}
                >
                  {content}
                </button>
              ) : (
                <div key={m.key} className={`${base} border-gray-100`}>
                  {content}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-baseline justify-between gap-2">
              <h3 className="font-semibold text-gray-800">{chartMetric.label} รายวัน</h3>
              <span className="text-xs text-gray-400">กดการ์ดด้านบนเพื่อเปลี่ยนกราฟ</span>
            </div>
            <BarChart
              data={data.series.map((d) => ({ date: d.date, value: d[chartKey] }))}
              metric={chartKey === "uploads" ? "ชีท" : "ครั้ง"}
              label={chartMetric.label}
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-800">ชีทยอดนิยม ({days} วันล่าสุด)</h3>
            {data.topSheets.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">ยังไม่มีข้อมูลการเข้าชมในช่วงนี้</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                      <th className="py-2 pr-3 font-medium">ชีท</th>
                      <th className="py-2 pr-3 text-right font-medium">เปิดดู</th>
                      <th className="py-2 text-right font-medium">โหลด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topSheets.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-2.5 pr-3">
                          <Link href={`/sheets/${s.id}`} className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
                            <FileText className="h-4 w-4 shrink-0 text-gray-300" aria-hidden="true" />
                            <span className="truncate">{s.title}</span>
                            <span className="shrink-0 text-xs text-gray-400">
                              {s.subject} · {s.level}
                            </span>
                          </Link>
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-gray-600">{nf.format(s.views)}</td>
                        <td className="py-2.5 text-right tabular-nums text-gray-600">{nf.format(s.downloads)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
