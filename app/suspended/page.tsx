"use client";

import { signOut } from "@/lib/auth-client";

export default function SuspendedPage() {
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          บัญชีของคุณถูกระงับชั่วคราว
        </h1>
        <p className="text-gray-500 mb-6">
          บัญชีของคุณถูกระงับการใช้งานโดยผู้ดูแลระบบ
          หากคุณเชื่อว่าเกิดข้อผิดพลาด กรุณาติดต่อทีมงาน
        </p>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
