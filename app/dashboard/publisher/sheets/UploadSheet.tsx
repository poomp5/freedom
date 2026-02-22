"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Link from "next/link";

const SUBJECTS = [
  "คณิตศาสตร์",
  "วิทยาศาสตร์",
  "ภาษาไทย",
  "ภาษาอังกฤษ",
  "สังคมศึกษา",
  "สุขศึกษา",
  "ศิลปะ",
  "การงานอาชีพ",
  "ฟิสิกส์",
  "เคมี",
  "ชีววิทยา",
  "อื่นๆ",
];

const LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const EXAM_TYPES = ["กลางภาค", "ปลายภาค"];
const TERMS = ["เทอม 1", "เทอม 2"];

type UploadStatus = "idle" | "compressing" | "uploading" | "saving" | "done" | "error";

export default function UploadSheet({ onUploaded }: { onUploaded: () => void }) {
  const trpc = useTRPC();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [level, setLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [term, setTerm] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: bankAccount } = useQuery(trpc.users.getBankAccount.queryOptions());
  const hasBankAccount = !!(bankAccount?.paymentMethod && (bankAccount.bankAccountNumber || bankAccount.promptPayNumber));

  const presignMutation = useMutation(trpc.upload.presign.mutationOptions());
  const createSheetMutation = useMutation(trpc.sheets.create.mutationOptions());

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("รองรับเฉพาะไฟล์ PDF เท่านั้น");
      return;
    }

    if (selected.size > 25 * 1024 * 1024) {
      setError("ไฟล์มีขนาดเกิน 25MB");
      return;
    }

    setError("");
    setFile(selected);
    setStatus("compressing");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const compressedBytes = await pdfDoc.save();
      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setCompressedBlob(blob);

      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setStatus("idle");
    } catch {
      setCompressedBlob(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      setStatus("idle");
    }
  };

  const clearFile = () => {
    setFile(null);
    setCompressedBlob(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const finalSubject = subject === "อื่นๆ" ? customSubject.trim() : subject;
    if (!title || !finalSubject || !level || !examType || !term) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (!isFree && (!price || parseInt(price) <= 0)) {
      setError("กรุณาระบุราคาชีท");
      return;
    }

    if (!compressedBlob || !file) {
      setError("กรุณาเลือกไฟล์ PDF");
      return;
    }

    try {
      // 1. Get presigned URL
      setStatus("uploading");
      const { uploadUrl, publicUrl, key } = await presignMutation.mutateAsync({
        fileName: file.name,
        contentType: "application/pdf" as const,
        fileSize: compressedBlob.size,
      });

      // 2. Upload to R2
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: compressedBlob,
      });

      if (!uploadRes.ok) {
        throw new Error("อัปโหลดไฟล์ไม่สำเร็จ");
      }

      // 3. Save sheet metadata
      setStatus("saving");
      await createSheetMutation.mutateAsync({
        title,
        description,
        subject: subject === "อื่นๆ" ? customSubject.trim() : subject,
        level,
        examType,
        term,
        pdfUrl: publicUrl,
        pdfKey: key,
        isFree,
        price: isFree ? undefined : parseInt(price),
      });

      setStatus("done");
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setSubject("");
        setCustomSubject("");
        setLevel("");
        setExamType("");
        setTerm("");
        setIsFree(true);
        setPrice("");
        clearFile();
        setStatus("idle");
        onUploaded();
      }, 1500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  };

  const isSubmitting = status === "uploading" || status === "saving" || status === "compressing";
  const priceNum = parseInt(price) || 0;
  const commission = Math.round(priceNum * 0.1);
  const publisherEarnings = priceNum - commission;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">อัปโหลดชีทใหม่</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อชีท <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="เช่น สรุปคณิต ม.3 บทที่ 1-5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            คำอธิบาย
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="อธิบายเนื้อหาในชีท (ไม่บังคับ)"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วิชา <span className="text-red-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setCustomSubject(""); }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">เลือกวิชา</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {subject === "อื่นๆ" && (
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ระบุชื่อวิชา"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ระดับชั้น <span className="text-red-500">*</span>
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">เลือกชั้น</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทสอบ <span className="text-red-500">*</span>
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">เลือกประเภท</option>
              {EXAM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เทอม <span className="text-red-500">*</span>
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">เลือกเทอม</option>
              {TERMS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Free/Paid Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ประเภทชีท
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setIsFree(true); setPrice(""); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                isFree
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              ฟรี
            </button>
            <button
              type="button"
              onClick={() => setIsFree(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                !isFree
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              เสียเงิน
            </button>
          </div>
        </div>

        {/* Price Input (shown when paid) */}
        {!isFree && (
          <div className="space-y-2">
            {!hasBankAccount && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-amber-700 font-medium">ยังไม่ได้ตั้งค่าบัญชีรับเงิน</p>
                  <p className="text-amber-600 mt-0.5">
                    กรุณา{" "}
                    <Link href="/dashboard/publisher/settings" className="underline font-medium">
                      ตั้งค่าบัญชีธนาคาร
                    </Link>{" "}
                    ก่อนเผยแพร่ชีทแบบเสียเงิน
                  </p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ราคา (บาท) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="เช่น 29"
              />
            </div>
            {priceNum > 0 && (
              <p className="text-xs text-gray-500">
                คุณจะได้รับ <span className="font-medium text-green-600">{publisherEarnings} บาท</span>{" "}
                (หักค่าคอมมิชชัน 10% = {commission} บาท)
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ไฟล์ PDF <span className="text-red-500">*</span>
          </label>

          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">คลิกเพื่อเลือกไฟล์ PDF</p>
                <p className="text-xs text-gray-400 mt-1">สูงสุด 25MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>ต้นฉบับ: {formatSize(file.size)}</span>
                {compressedBlob && (
                  <span>หลังบีบอัด: {formatSize(compressedBlob.size)}</span>
                )}
              </div>
              {previewUrl && (
                <iframe
                  src={previewUrl}
                  className="w-full h-48 mt-2 rounded border border-gray-200"
                  title="PDF Preview"
                />
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || status === "done" || (!isFree && !hasBankAccount)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          {status === "compressing" && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังบีบอัด...
            </>
          )}
          {status === "uploading" && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังอัปโหลด...
            </>
          )}
          {status === "saving" && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังบันทึก...
            </>
          )}
          {status === "done" && (
            <>
              <CheckCircle className="w-4 h-4" />
              อัปโหลดสำเร็จ!
            </>
          )}
          {(status === "idle" || status === "error") && (
            <>
              <Upload className="w-4 h-4" />
              อัปโหลดชีท
            </>
          )}
        </button>
      </form>
    </div>
  );
}
