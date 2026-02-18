"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function Bottombar() {
    const { data: session } = useSession();
    return (
      <div className="mt-6 block md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="relative grid h-full grid-cols-6 mx-auto">
          <Link href="/" className="w-full">
            <button
              type="button"
              className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              <span className="text-xs text-gray-500 group-hover:text-blue-600">
                หน้าหลัก
              </span>
            </button>
          </Link>
          <Link href="https://www.instagram.com/act.freedom" className="w-full">
            <button
              type="button"
              className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17" cy="7" r="1.5" fill="currentColor" />
              </svg>

              <span className="text-xs text-gray-500 group-hover:text-blue-600">
                ติดต่อ
              </span>
            </button>
          </Link>
          <Link href="/select" className="w-full">
            <button
              type="button"
              className="absolute left-1/2 -translate-x-1/2 -translate-y-3 w-16 h-16 inline-flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-800 group rounded-full shadow-lg"
            >
              <svg
                className="h-full w-full p-3 mb-1 text-white hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                <path d="M3 6l0 13" />
                <path d="M12 6l0 13" />
                <path d="M21 6l0 13" />
              </svg>
            </button>
          </Link>
          <Link href="/sheets" className="w-full">
            <button
              type="button"
              className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-gray-500 group-hover:text-blue-600">
                ชีทชุมชน
              </span>
            </button>
          </Link>
          <Link href="/freedom" className="w-full">
            <button
              type="button"
              className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1"
            >
              <svg
                className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600"
                width="24"
                height="24"
                viewBox="0 0 600 600"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                strokeLinecap="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="50" y="50" width="500" height="500" />
                <rect x="120" y="120" width="360" height="360" />
                <rect
                  x="200"
                  y="200"
                  width="200"
                  height="200"
                  transform="rotate(45 300 300)"
                />
                <line x1="200" y1="200" x2="400" y2="400" />
                <line x1="400" y1="200" x2="200" y2="400" />
                <path d="M240 120 H360" />
                <path d="M240 120 Q300 160 360 120" />
                <path d="M240 480 H360" />
                <path d="M240 480 Q300 440 360 480" />
                <path d="M120 240 V360" />
                <path d="M120 240 Q160 300 120 360" />
                <path d="M480 240 V360" />
                <path d="M480 240 Q440 300 480 360" />
                <line x1="300" y1="50" x2="300" y2="80" />
                <line x1="300" y1="520" x2="300" y2="550" />
                <line x1="50" y1="300" x2="80" y2="300" />
                <line x1="520" y1="300" x2="550" y2="300" />
              </svg>

              <span className="text-xs text-gray-500 group-hover:text-blue-600">
                ยันต์
              </span>
            </button>
          </Link>
          <Link href={session ? "/donate" : "/signin"} className="w-full">
            <button
              type="button"
              className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1"
            >
              {session ? (
                <>
                  <svg
                    className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-blue-600">
                    โปรไฟล์
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-blue-600">
                    เข้าสู่ระบบ
                  </span>
                </>
              )}
            </button>
          </Link>
        </div>
      </div>
    );
}