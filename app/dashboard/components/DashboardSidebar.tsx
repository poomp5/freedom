"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import {
  Home,
  Users,
  FileCheck,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Building2,
  DollarSign,
} from "lucide-react";

interface SidebarProps {
  role: string;
  userName: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardSidebar({ role, userName }: SidebarProps) {
  const trpc = useTRPC();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: pendingPublisherRequests = [] } = useQuery({
    ...trpc.publisherRequests.listPending.queryOptions(),
    enabled: role === "admin",
  });

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const publisherItems: MenuItem[] =
    role === "publisher" || role === "admin"
      ? [
          {
            label: "ตั้งค่าบัญชี",
            href: "/dashboard/publisher/settings",
            icon: <Building2 size={20} />,
          },
          {
            label: "รายได้",
            href: "/dashboard/publisher/earnings",
            icon: <DollarSign size={20} />,
          },
        ]
      : [];

  const userItems: MenuItem[] = [
    {
      label: "หน้าหลัก",
      href: "/dashboard",
      icon: <Home size={20} />,
    },
    {
      label: "อัปโหลดชีท",
      href: "/dashboard/publisher/sheets",
      icon: <Upload size={20} />,
    },
  ];

  const adminItems: MenuItem[] =
    role === "admin"
      ? [
          {
            label: "จัดการผู้ใช้",
            href: "/dashboard/admin/users",
            icon: <Users size={20} />,
          },
          {
            label: "คำขอผู้เผยแพร่",
            href: "/dashboard/admin/requests",
            icon: <FileCheck size={20} />,
          },
          {
            label: "จัดการชีท",
            href: "/dashboard/admin/sheets",
            icon: <FileText size={20} />,
          },
        ]
      : [];

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const renderSidebarContent = ({
    compact,
    mobile = false,
  }: {
    compact: boolean;
    mobile?: boolean;
  }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!compact && (
          <Link href="/" className="text-lg font-bold text-blue-600">
            FREEDOM
          </Link>
        )}
        <div className="flex items-center">
          {mobile ? (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100"
              aria-label="ปิดเมนูแดชบอร์ด"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              {compact ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* User info */}
      {!compact && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800 truncate">
            {userName}
          </p>
          <p className="text-xs text-gray-500 capitalize">{role}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-3">
        {adminItems.length > 0 && (
          <div className="space-y-1">
            {!compact && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Admin
              </p>
            )}
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                } ${compact ? "justify-center" : ""}`}
                title={compact ? item.label : undefined}
              >
                {item.icon}
                {!compact && <span>{item.label}</span>}
                {item.href === "/dashboard/admin/requests" &&
                  pendingPublisherRequests.length > 0 && (
                    <span
                      className={`ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      } ${compact ? "ml-0" : ""}`}
                    >
                      {pendingPublisherRequests.length}
                    </span>
                  )}
              </Link>
            ))}
          </div>
        )}

        {publisherItems.length > 0 && (
          <div className="space-y-1">
            {!compact && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                ผู้เผยแพร่
              </p>
            )}
            {publisherItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                } ${compact ? "justify-center" : ""}`}
                title={compact ? item.label : undefined}
              >
                {item.icon}
                {!compact && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        )}

        <div className="space-y-1">
          {!compact && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              ผู้ใช้งาน
            </p>
          )}
          {userItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              } ${compact ? "justify-center" : ""}`}
              title={compact ? item.label : undefined}
            >
              {item.icon}
              {!compact && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full ${
            compact ? "justify-center" : ""
          }`}
          title={compact ? "ออกจากระบบ" : undefined}
        >
          <LogOut size={20} />
          {!compact && <span>ออกจากระบบ</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 h-10 px-3 inline-flex items-center gap-2 bg-white/95 backdrop-blur border border-gray-200 rounded-full shadow-lg"
        aria-label="เปิดเมนูแดชบอร์ด"
      >
        <Menu size={20} />
        <span className="text-sm font-medium text-gray-700">เมนู</span>
      </button>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-colors duration-300 ${
          mobileOpen ? "bg-black/45" : "bg-black/0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[84vw] max-w-80 bg-white/95 backdrop-blur border-r border-gray-200 rounded-r-2xl shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderSidebarContent({ compact: false, mobile: true })}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:block sticky top-0 h-screen self-start bg-white border-r border-gray-200 transition-all duration-200 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {renderSidebarContent({ compact: collapsed })}
      </div>
    </>
  );
}
