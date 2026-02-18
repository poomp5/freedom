"use client";

import { useState } from "react";
import UploadSheet from "./UploadSheet";
import MySheets from "./MySheets";

interface SheetItem {
  id: string;
  title: string;
  subject: string;
  level: string;
  examType: string;
  term: string;
  pdfUrl: string;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
}

export default function PublisherSheetsClient({
  initialSheets,
}: {
  initialSheets: SheetItem[];
}) {
  const [key, setKey] = useState(0);
  const [sheets, setSheets] = useState(initialSheets);

  const handleUploaded = async () => {
    // Refetch sheets after upload
    const res = await fetch("/api/sheets?mine=1");
    if (res.ok) {
      // Since the GET doesn't support mine=1, we refresh the page
      window.location.reload();
    }
    setKey((k) => k + 1);
  };

  return (
    <div className="p-6 lg:p-8 w-full space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">อัปโหลดชีท</h1>
      <UploadSheet key={key} onUploaded={handleUploaded} />
      <h2 className="text-xl font-bold text-gray-800">ชีทของฉัน</h2>
      <MySheets initialSheets={sheets} />
    </div>
  );
}
