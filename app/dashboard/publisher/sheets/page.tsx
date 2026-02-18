import { Upload } from "lucide-react";

export default function PublisherSheetsPage() {
  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">อัปโหลดชีท</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload size={28} className="text-blue-500" />
        </div>
        <h2 className="text-lg font-medium text-gray-800 mb-2">เร็วๆ นี้</h2>
        <p className="text-gray-400 text-sm">
          ฟีเจอร์อัปโหลดชีทจะพร้อมใช้งานในเร็วๆ นี้
        </p>
      </div>
    </div>
  );
}
