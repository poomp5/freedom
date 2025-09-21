"use client";

import Link from "next/link";
import Image from "next/image";
import { LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface SheetRowProps {
  subject: string;
  filename: string; // ไฟล์หลัก (เช่น /m3/final1/sci-nana.pdf หรือเส้นทางภายใน)
  icon: string;
  date: string;
  term: string;
  examType: "สอบกลางภาค" | "สอบปลายภาค";
  by?: {
    name: string;
    url?: string; // อาจเป็นลิงก์ภายนอก เช่น https://...
  };
  extraLink?: {
    label: string;
    url: string; // ภายในหรือภายนอกก็ได้
  };
}

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

type SmartLinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
  title?: string;
  underline?: boolean;
  newTabForExternal?: boolean;
}>;

/** ลิงก์อัจฉริยะ: ภายในใช้ <Link> ภายนอกใช้ <a> และ stopPropagation เสมอ */
function SmartLink({
  href,
  children,
  className,
  title,
  underline = true,
  newTabForExternal = true,
}: SmartLinkProps) {
  const commonProps = {
    className: underline ? `${className ?? ""} hover:underline` : className,
    title,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
  };

  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        {...commonProps}
        target={newTabForExternal ? "_blank" : undefined}
        rel={newTabForExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...commonProps}>
      {children}
    </Link>
  );
}

export default function SheetRow({
  subject,
  filename,
  icon,
  date,
  term,
  examType,
  by,
  extraLink,
}: SheetRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(filename);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(filename);
    }
  };

  return (
    <tr
      className="text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-50 focus:bg-gray-50 outline-none"
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      aria-label={`เปิด ${subject}`}
    >
      {/* คอลัมน์ชื่อวิชา + ผู้จัดทำ */}
      <td className="px-4 py-3">
        <div className="flex items-center text-sm">
          <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
            <Image
              className="icon-subject object-cover w-full h-auto"
              src={icon}
              alt={subject}
              width={100}
              height={100}
            />
            <div
              className="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            />
          </div>

          <div className="inline-block">
            {/* ให้ subject เป็นลิงก์จริง แต่ stopPropagation เพื่อไม่ให้ชนกับ onClick แถว */}
            <p className="font-semibold whitespace-nowrap">
              <SmartLink href={filename} className="text-gray-800 hover:no-underline">
                {subject}
              </SmartLink>
            </p>

            <p className="text-xs text-gray-600">
              {examType}{" "}
              {by && (
                <>
                  (by{" "}
                  {by.url ? (
                    <SmartLink href={by.url} className="text-purple-800">
                      {by.name}
                    </SmartLink>
                  ) : (
                    <span className="text-gray-400">{by.name}</span>
                  )}
                  )
                </>
              )}
            </p>
          </div>
        </div>
      </td>

      {/* คอลัมน์เทอม */}
      <td className="px-4 py-3 text-sm whitespace-nowrap">{term}</td>

      {/* คอลัมน์ปุ่มดาวน์โหลด + ลิงก์เสริม */}
      <td className="px-4 py-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* ปุ่มดาวน์โหลด: ใช้ <a> ตรง ๆ เพื่อรองรับ attribute download; stopPropagation */}
          <a
            href={filename}
            className="px-2 py-1 font-semibold bg-green-100 text-green-700 rounded-full"
            onClick={(e) => e.stopPropagation()}
            download
          >
            ดาวน์โหลด
          </a>

          {extraLink && (
            <SmartLink
              href={extraLink.url}
              className="px-2 py-1 font-semibold bg-blue-100 text-blue-700 rounded-full inline-flex items-center"
              underline={false}
            >
              <LinkIcon className="inline-block h-3 w-3 mr-1.5" />
              {extraLink.label}
            </SmartLink>
          )}
        </div>
      </td>

      {/* คอลัมน์วันที่ */}
      <td className="px-2 py-3 text-sm">{date}</td>
    </tr>
  );
}
