"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface PurchaseModalProps {
  sheetId: string;
  sheetTitle: string;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PurchaseModal({
  sheetId,
  sheetTitle,
  price,
  onClose,
  onSuccess,
}: PurchaseModalProps) {
  const trpc = useTRPC();
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [qrPayload, setQrPayload] = useState("");
  const [method, setMethod] = useState<"slip" | "qr">("slip");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: platformPayment } = useQuery(
    trpc.payments.getPlatformPaymentInfo.queryOptions()
  );
  const purchaseMutation = useMutation(trpc.payments.purchaseSheet.mutationOptions());

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("ไฟล์สลิปมีขนาดเกิน 5MB");
      return;
    }

    setSlipFile(file);
    setErrorMsg("");
    const url = URL.createObjectURL(file);
    setSlipPreview(url);
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setStatus("verifying");

    try {
      if (method === "slip") {
        if (!slipFile) {
          setErrorMsg("กรุณาอัปโหลดสลิป");
          setStatus("idle");
          return;
        }

        const buffer = await slipFile.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        await purchaseMutation.mutateAsync({
          sheetId,
          slipImageBase64: base64,
          slipImageContentType: slipFile.type,
        });
      } else {
        if (!qrPayload.trim()) {
          setErrorMsg("กรุณาระบุ QR payload");
          setStatus("idle");
          return;
        }

        await purchaseMutation.mutateAsync({
          sheetId,
          qrPayload: qrPayload.trim(),
        });
      }

      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">ซื้อชีท</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Sheet Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700">{sheetTitle}</p>
            <p className="text-lg font-bold text-blue-600 mt-1">{price} บาท</p>
          </div>

          {/* Platform Payment Info */}
          {platformPayment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700 mb-2">ข้อมูลการโอนเงิน</p>
              {platformPayment.promptPayNumber && (
                <p className="text-sm text-blue-600">
                  พร้อมเพย์: <span className="font-mono font-medium">{platformPayment.promptPayNumber}</span>
                </p>
              )}
              {platformPayment.bankAccountNumber && (
                <>
                  <p className="text-sm text-blue-600">
                    ธนาคาร: {platformPayment.bankProvider}
                  </p>
                  <p className="text-sm text-blue-600">
                    เลขบัญชี: <span className="font-mono font-medium">{platformPayment.bankAccountNumber}</span>
                  </p>
                  <p className="text-sm text-blue-600">
                    ชื่อบัญชี: {platformPayment.bankAccountName}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Method Toggle */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">วิธียืนยันการชำระเงิน</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod("slip")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  method === "slip"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                อัปโหลดสลิป
              </button>
              <button
                type="button"
                onClick={() => setMethod("qr")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  method === "qr"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                QR Payload
              </button>
            </div>
          </div>

          {/* Slip Upload */}
          {method === "slip" && (
            <div>
              {!slipFile ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">คลิกเพื่อเลือกรูปสลิป</p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG สูงสุด 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleSlipChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  {slipPreview && (
                    <img
                      src={slipPreview}
                      alt="Slip preview"
                      className="w-full rounded-lg border border-gray-200 max-h-48 object-contain bg-gray-50"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSlipFile(null);
                      if (slipPreview) URL.revokeObjectURL(slipPreview);
                      setSlipPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* QR Payload */}
          {method === "qr" && (
            <div>
              <textarea
                value={qrPayload}
                onChange={(e) => setQrPayload(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="วาง QR payload ที่นี่..."
              />
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4" />
              ชำระเงินสำเร็จ! กำลังเปิดชีท...
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={status === "verifying" || status === "success"}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            {status === "verifying" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังตรวจสอบสลิป...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                สำเร็จ
              </>
            ) : (
              "ยืนยันการชำระเงิน"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
