"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Heart } from "lucide-react";
import Avatar from "@/app/components/Avatar";

const QUICK_AMOUNTS = [20, 50, 100];

export default function DonateModal({
  promptPay,
  name,
  image,
  seed,
  onClose,
}: {
  promptPay: string;
  name: string;
  image: string | null;
  seed: string;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [confirmed, setConfirmed] = useState("");

  const handleGenerate = (value: string) => {
    const n = Number(value);
    if (!value || isNaN(n) || n <= 0) return;
    setConfirmed(value);
  };

  // promptpay.io renders the QR for us, same as the /donate pages.
  const qrUrl = `https://promptpay.io/${promptPay}/${confirmed}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="flex items-center gap-2 font-bold text-gray-800">
            <Heart className="h-4 w-4 text-pink-500" />
            สนับสนุนเจ้าของชีท
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <Avatar src={image} name={name} seed={seed} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-400">พร้อมเพย์</p>
          </div>
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
                  className="rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
              placeholder="ระบุจำนวนเงิน (บาท)"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-center text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => handleGenerate(amount)}
              disabled={!amount || Number(amount) <= 0}
              className="mt-3 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              สร้าง QR พร้อมเพย์
            </button>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-100 p-4 text-center">
              <p className="mb-2 text-sm text-gray-500">
                สแกนเพื่อโอน{" "}
                <span className="font-semibold text-gray-800">{confirmed} บาท</span>
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

        <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
          เงินจะโอนตรงเข้าบัญชีพร้อมเพย์ของเจ้าของชีท Freedom ไม่หักค่าธรรมเนียม
        </p>
      </div>
    </div>
  );
}
