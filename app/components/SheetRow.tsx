import Link from "next/link";
import Image from "next/image";
import { LinkIcon } from "lucide-react";

interface SheetRowProps {
  subject: string;
  filename: string;
  icon: string;
  date: string;
  term: string;
  by?: {
    name: string;
    url?: string; 
  };
  extraLink?: {
    label: string;
    url: string;
  };
}

export default function SheetRow({
  subject,
  filename,
  icon,
  date,
  term,
  by,
  extraLink,
}: SheetRowProps) {
  return (
    <tr className="text-gray-700 whitespace-nowrap">
      <td className="px-4 py-3">
        <Link href={filename} className="flex items-center text-sm">
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
            ></div>
          </div>
          <div className="inline-block">
            <p className="font-semibold whitespace-nowrap">{subject}</p>
            <p className="text-xs text-gray-600">
              สอบปลายภาค{" "}
              {by && (
                <>
                  (by{" "}
                  {by.url ? (
                    <Link href={by.url} className="text-purple-800">
                      {by.name}
                    </Link>
                  ) : (
                    <span className="text-gray-400">{by.name}</span>
                  )}
                  )
                </>
              )}
            </p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">{term}</td>
      <td className="px-4 py-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-2 space-y-2 sm:space-y-0">
          <Link href={filename}>
            <span className="px-2 py-1 font-semibold bg-green-100 text-green-700 rounded-full">
              ดาวน์โหลด
            </span>
          </Link>
          {extraLink && (
            <Link href={extraLink.url}>
              <span className="px-2 py-1 font-semibold bg-blue-100 text-blue-700 rounded-full">
                <LinkIcon className="inline-block h-3 w-3 mr-1.5" />
                {extraLink.label}
              </span>
            </Link>
          )}
        </div>
      </td>

      <td className="px-2 py-3 text-sm">{date}</td>
    </tr>
  );
}
