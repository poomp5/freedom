"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import Avatar from "@/app/components/Avatar";
import type { DonorPage } from "@/lib/donors";

const QUICK_AMOUNTS = [20, 50, 100];

export default function DonateClient({ donor }: { donor: DonorPage }) {
  const [amount, setAmount] = useState("");
  const [confirmed, setConfirmed] = useState("");

  const handleGenerate = (value: string) => {
    const n = Number(value);
    if (!value || isNaN(n) || n <= 0) return;
    setConfirmed(value);
  };

  // promptpay.io renders the QR for us.
  const qrUrl = `https://promptpay.io/${donor.promptPay}/${confirmed}`;

  return (
    <div className="mx-auto max-w-sm">
      <Link href="/donate" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        ผู้จัดทำทั้งหมด
      </Link>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Avatar src={donor.image} name={donor.name} seed={donor.seed} size={80} className="mb-3 ring-4 ring-pink-50" />
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Heart className="h-5 w-5 text-pink-500" />
            โดเนทให้ {donor.name}
          </h1>
          {donor.accountName && <p className="mt-1 text-sm text-gray-500">พร้อมเพย์: {donor.accountName}</p>}
          {donor.role && (
            <span className="mt-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">{donor.role}</span>
          )}
          {donor.profileHref && (
            <Link href={donor.profileHref} className="mt-2 text-sm text-blue-600 hover:underline">
              {donor.username ? `@${donor.username}` : "ดูโปรไฟล์"}
            </Link>
          )}
        </div>

        {!confirmed ? (
          <>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setAmount(String(q));
                    handleGenerate(String(q));
                  }}
                  className="rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
                >
                  ฿{q}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate(amount)}
              placeholder="ระบุจำนวนเงิน (บาท)"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-center text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="button"
              onClick={() => handleGenerate(amount)}
              disabled={!amount || Number(amount) <= 0}
              className="mt-3 w-full rounded-xl bg-pink-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              สร้าง QR พร้อมเพย์
            </button>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-100 p-4 text-center">
              <p className="mb-2 text-sm text-gray-500">
                สแกนเพื่อโอน <span className="font-semibold text-gray-800">{confirmed} บาท</span>
              </p>
              <Image
                src={qrUrl}
                alt="PromptPay QR"
                width={280}
                height={280}
                unoptimized
                className="mx-auto w-full max-w-[260px] rounded-xl border border-gray-100"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmed("");
                setAmount("");
              }}
              className="mt-3 w-full rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              เปลี่ยนจำนวนเงิน
            </button>
          </>
        )}

        <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-400">
          เงินโอนตรงเข้าพร้อมเพย์ของผู้จัดทำ Freedom ไม่หักค่าธรรมเนียม
        </p>
      </div>
    </div>
  );
}
