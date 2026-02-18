"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SchoolSearch from "@/app/components/SchoolSearch";

interface School {
  id: string;
  name: string;
  province: string;
  district: string;
  schoolType: string;
}

const gradeLevels = [
  { level: 1, label: "ม.1", color: "from-rose-500 to-pink-600" },
  { level: 2, label: "ม.2", color: "from-orange-500 to-amber-600" },
  { level: 3, label: "ม.3", color: "from-emerald-500 to-teal-600" },
  { level: 4, label: "ม.4", color: "from-cyan-500 to-blue-600" },
  { level: 5, label: "ม.5", color: "from-violet-500 to-purple-600" },
  { level: 6, label: "ม.6", color: "from-fuchsia-500 to-pink-600" },
];

export default function SchoolOnboarding() {
  const router = useRouter();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/user/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: selectedSchool?.id ?? null,
          gradeLevel: selectedGrade,
        }),
      });
      router.push("/");
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/img/freedom.svg"
            width={160}
            height={48}
            alt="Freedom Logo"
            className="h-12 w-auto"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            เลือกโรงเรียนของคุณ
          </h1>
          <p className="text-center text-gray-500 mb-8">
            ช่วยให้เราแนะนำชีทที่เหมาะกับคุณ
          </p>

          {/* School Search */}
          <div className="mb-8">
            <SchoolSearch
              onSelect={setSelectedSchool}
              selected={selectedSchool}
            />
          </div>

          {/* Grade Level Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ระดับชั้น
            </label>
            <div className="grid grid-cols-3 gap-3">
              {gradeLevels.map((grade) => (
                <button
                  key={grade.level}
                  onClick={() => setSelectedGrade(grade.level)}
                  className={`relative p-4 rounded-xl text-center font-bold transition-all duration-200 ${
                    selectedGrade === grade.level
                      ? `bg-gradient-to-br ${grade.color} text-white shadow-lg scale-105`
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {grade.label}
                  {selectedGrade === grade.level && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm"
          >
            {isSubmitting ? "กำลังบันทึก..." : "ดำเนินการต่อ"}
          </button>

          {/* Skip Link */}
          <div className="text-center mt-4">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ข้ามขั้นตอนนี้
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
