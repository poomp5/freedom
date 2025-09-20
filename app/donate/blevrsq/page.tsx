"use client";

import { useState } from "react";
import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
export default function DonatePage() {
  const [amountInput, setAmountInput] = useState("");
  const [amountToDonate, setAmountToDonate] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => {
    const amount = amountInput.trim();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("กรุณากรอกจำนวนเงินให้ถูกต้อง");
      return;
    }
    setAmountToDonate(amount); // เซ็ตค่าจริงตอนกด
    setShowQR(true);
  };
  const qrUrl = `https://promptpay.io/0641566647/${amountToDonate}`;

  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="mt-8 h-screen overflow-y-auto">
        <div className="container px-4 lg:px-8 mx-auto text-center">
          <h1 className="mb-4 font-extrabold tracking-tight leading-none text-3xl md:text-4xl lg:text-5xl text-gray-700">
            โดเนทให้กับ <span className="text-pink-400">blevrsq</span>
          </h1>
          <p className="text-gray-500 mb-6">
            Kbank (<span className="font-semibold">รัศมิ์ลภัส รติสุขพิมล</span>)
          </p>

          <div className="max-w-sm mx-auto flex flex-col gap-4">
            <input
              type="number"
              min="1"
              placeholder="กรอกจำนวนเงิน (บาท)"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400 text-center"
            />

            <button
              onClick={handleGenerateQR}
              className="w-full px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-md transition"
            >
              โดเนท
            </button>

            {showQR && (
              <div className="border rounded-2xl p-4 bg-white shadow-md">
                <p className="mb-2 text-gray-600">
                  QR พร้อมเพย์ (จำนวน {amountToDonate} บาท)
                </p>
                <div className="relative w-64 h-64 mx-auto">
                  <Image
                    src={qrUrl}
                    alt="PromptPay QR Code"
                    className="w-full h-full rounded-md border"
                    width={300}
                    height={300}
                  />
                  <Image
                    src={'/assets/img/donatelogo.png'}
                    alt="Logo"
                    className="absolute inset-0 m-auto w-12 h-12 pointer-events-none rounded-xl"
                    style={{ objectFit: "contain" }}
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
