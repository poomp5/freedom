"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";

function formatBangkokInput(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(" ", "T");
}

function parseBangkokInput(value: string) {
  return new Date(`${value}:00+07:00`);
}

export default function CountdownSettingsForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(trpc.settings.getCountdown.queryOptions());
  const [targetAtInput, setTargetAtInput] = useState(() =>
    formatBangkokInput(new Date(data.targetAt))
  );
  const [saved, setSaved] = useState(false);

  const updateMutation = useMutation(
    trpc.settings.updateCountdown.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.settings.getCountdown.queryKey(),
        });
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2500);
      },
    })
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);

    const targetAt = parseBangkokInput(targetAtInput);
    if (Number.isNaN(targetAt.getTime())) {
      alert("วันที่ไม่ถูกต้อง");
      return;
    }

    try {
      await updateMutation.mutateAsync({ targetAt });
    } catch (err) {
      alert(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Countdown หน้าแรก
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          ตั้งวันที่และเวลาสอบตามเวลาไทย ระบบหน้าแรกจะอัปเดตตามค่านี้
        </p>
      </div>

      <label
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor="countdown-target"
      >
        วันและเวลาเป้าหมาย
      </label>
      <input
        id="countdown-target"
        type="datetime-local"
        value={targetAtInput}
        onChange={(event) => setTargetAtInput(event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <p className="mt-2 text-xs text-gray-400">
        Timezone: Asia/Bangkok (GMT+7)
      </p>

      {data.updatedAt && (
        <p className="mt-4 text-xs text-gray-500">
          อัปเดตล่าสุด:{" "}
          {new Date(data.updatedAt).toLocaleString("th-TH", {
            timeZone: "Asia/Bangkok",
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          บันทึก
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            บันทึกแล้ว
          </span>
        )}
      </div>
    </form>
  );
}
