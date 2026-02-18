"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import { useSession } from "@/lib/auth-client";

type UploadItem = {
  id: string;
  originalName: string;
  fileSize: number;
  sheetName: string | null;
  rowCount: number;
  columnCount: number;
  createdAt: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const canUpload = useMemo(() => !isUploading && file !== null, [isUploading, file]);

  async function loadUploads() {
    const res = await fetch("/api/dashboard/spreadsheets", {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to load uploads");
    }

    const data = await res.json();
    setUploads(data.uploads ?? []);
  }

  useEffect(() => {
    if (!session) return;

    loadUploads().catch(() => {
      setError("โหลดประวัติการอัปโหลดไม่สำเร็จ");
    });
  }, [session]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/dashboard/spreadsheets", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(`อัปโหลดสำเร็จ: ${data.upload.originalName}`);
      setFile(null);
      await loadUploads();
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "อัปโหลดไฟล์ไม่สำเร็จ";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navbar />
        <main className="max-w-screen-xl mx-auto p-6">
          <div className="h-48 rounded-2xl bg-white shadow-sm animate-pulse" />
        </main>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />
      <Bottombar />
      <main className="max-w-screen-xl mx-auto p-4 md:p-6 pb-24 md:pb-8">
        <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 md:p-7 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
          <p className="text-gray-500">อัปโหลดไฟล์ Spreadsheet ของคุณ (.xlsx, .xls, .csv)</p>
        </section>

        <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 md:p-7 mb-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">เลือกไฟล์</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-gray-300 p-3 text-sm"
            />
            <p className="text-xs text-gray-500">ขนาดสูงสุด 10MB</p>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={!canUpload}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium"
            >
              {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์"}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 md:p-7">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ประวัติการอัปโหลด</h2>

          {uploads.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีข้อมูลการอัปโหลด</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4">ไฟล์</th>
                    <th className="py-2 pr-4">Sheet</th>
                    <th className="py-2 pr-4">Rows</th>
                    <th className="py-2 pr-4">Columns</th>
                    <th className="py-2 pr-4">ขนาด</th>
                    <th className="py-2 pr-4">เวลา</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 text-gray-700">
                      <td className="py-2 pr-4 font-medium">{item.originalName}</td>
                      <td className="py-2 pr-4">{item.sheetName || "-"}</td>
                      <td className="py-2 pr-4">{item.rowCount}</td>
                      <td className="py-2 pr-4">{item.columnCount}</td>
                      <td className="py-2 pr-4">{formatSize(item.fileSize)}</td>
                      <td className="py-2 pr-4">{new Date(item.createdAt).toLocaleString("th-TH")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
