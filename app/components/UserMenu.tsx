"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { User, LayoutDashboard, BadgePlus, Clock3, LogOut } from "lucide-react";
import PublisherRequestModal from "./PublisherRequestModal";

export default function UserMenu() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <a
        href="/signin"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        เข้าสู่ระบบ
      </a>
    );
  }

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const role = (session.user as Record<string, unknown>).role as
    | string
    | undefined;

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {session.user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              โปรไฟล์
            </Link>

            {/* Role-based menu items */}
            {(role === "admin" || role === "publisher") && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                แดชบอร์ด
              </Link>
            )}

            {role === "user" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowRequestModal(true);
                }}
                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <BadgePlus className="w-4 h-4" />
                สมัครเป็นผู้เผยแพร่
              </button>
            )}

            {role === "pending_publisher" && (
              <div className="px-4 py-2.5 text-sm text-gray-400 flex items-center gap-2">
                <Clock3 className="w-4 h-4" />
                รอการอนุมัติ
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>

      <PublisherRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </>
  );
}
