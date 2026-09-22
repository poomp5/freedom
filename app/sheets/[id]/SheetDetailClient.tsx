"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Files,
  GraduationCap,
  Lock,
  Heart,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import Avatar from "@/app/components/Avatar";
import StarRating from "@/app/components/StarRating";
import PurchaseModal from "@/app/components/PurchaseModal";
import SubjectCover from "../SubjectCover";
import SheetComments from "./SheetComments";
import DonateModal from "./DonateModal";
import { getSubjectBadgeClass } from "../subjectCoverUtils";
import { getSocialLinks, getContactHref } from "../socialIcons";

export default function SheetDetailClient({ id }: { id: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: sheet } = useSuspenseQuery(trpc.sheets.getById.queryOptions({ id }));
  const [showPurchase, setShowPurchase] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  const u = sheet.uploader;
  const socials = getSocialLinks(u);
  const contactHref = getContactHref(u, u.mainContact);
  const isPaid = !sheet.isFree && sheet.price;
  const isLoggedIn = !!session;

  const handlePrimaryAction = () => {
    if (sheet.hasAccess && sheet.pdfUrl) {
      window.open(sheet.pdfUrl, "_blank", "noopener,noreferrer");
    } else if (!isLoggedIn) {
      router.push("/signin");
    } else {
      setShowPurchase(true);
    }
  };

  // "อัปเดตปี" prefers the year the publisher tagged; otherwise fall back to the
  // upload date converted to the Thai Buddhist year.
  const updatedYear =
    sheet.academicYear ?? new Date(sheet.createdAt).getFullYear() + 543;

  const specs = [
    { icon: GraduationCap, label: "ระดับชั้น", value: sheet.level },
    { icon: FileText, label: "การสอบ", value: `${sheet.examType} ${sheet.term}` },
    {
      icon: Files,
      label: "จำนวนหน้า",
      value: sheet.pageCount ? `${sheet.pageCount} หน้า` : "ไม่ระบุ",
    },
    { icon: Calendar, label: "อัปเดตปี", value: `${updatedYear}` },
  ];

  return (
    <div>
      <Navbar />
      <Bottombar />

      <main className="min-h-screen bg-gray-50 pb-24 md:pb-12">
        <div className="mx-auto max-w-screen-lg px-4 pt-6">
          <Link
            href="/sheets"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้าชีททั้งหมด
          </Link>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
            {/* ── Left: cover + details ── */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-3 shadow-sm sm:p-4">
                <SubjectCover
                  subject={sheet.subject}
                  className="h-56 sm:h-72 rounded-xl"
                  fit="contain"
                />
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getSubjectBadgeClass(
                    sheet.subject
                  )}`}
                >
                  <FileText className="h-3 w-3" />
                  {sheet.subject}
                </span>

                <h1 className="mt-2 text-2xl font-bold text-gray-900">{sheet.title}</h1>

                <div className="mt-3">
                  {isLoggedIn ? (
                    <StarRating
                      sheetId={sheet.id}
                      currentRating={sheet.userRating}
                      averageRating={sheet.averageRating}
                      totalRatings={sheet.totalRatings}
                    />
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span className="text-yellow-400">★</span>
                      {sheet.averageRating.toFixed(1)} ({sheet.totalRatings} รีวิว)
                    </div>
                  )}
                </div>

                {sheet.description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                    {sheet.description}
                  </p>
                )}

                {/* Spec grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-50 pt-5 sm:grid-cols-4">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <spec.icon className="h-3.5 w-3.5" />
                        {spec.label}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-gray-800">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* More from this publisher */}
              {sheet.moreBySameUploader.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 font-bold text-gray-800">ชีทอื่นจากคนนี้</h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {sheet.moreBySameUploader.map((other) => (
                      <Link
                        key={other.id}
                        href={`/sheets/${other.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                      >
                        <div className="w-11 shrink-0 overflow-hidden rounded-lg">
                          <SubjectCover subject={other.subject} className="h-11" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-800 group-hover:text-blue-700">
                            {other.title}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {other.level} · {other.examType} {other.term}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            !other.isFree && other.price
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {!other.isFree && other.price ? `฿${other.price}` : "ฟรี"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <SheetComments
                sheetId={sheet.id}
                currentUserId={session?.user?.id ?? null}
              />
            </div>

            {/* ── Right: price + publisher (sticky) ── */}
            <aside className="space-y-4 md:sticky md:top-6 md:self-start">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-baseline gap-2">
                  {isPaid ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">฿{sheet.price}</span>
                      <span className="text-sm text-gray-400">ครั้งเดียว</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-emerald-600">ฟรี</span>
                      <span className="text-sm text-gray-400">ไม่มีค่าใช้จ่าย</span>
                    </>
                  )}
                </div>

                {sheet.hasAccess ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isPaid ? "คุณซื้อชีทนี้แล้ว" : "เปิดอ่านได้ทันที"}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    ซื้อครั้งเดียว เข้าถึงได้ตลอด
                  </p>
                )}

                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${
                    sheet.hasAccess
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-900 hover:bg-blue-700"
                  }`}
                >
                  {sheet.hasAccess ? (
                    <>
                      <Download className="h-4 w-4" />
                      เปิดอ่านชีท
                    </>
                  ) : !isLoggedIn ? (
                    <>
                      <Lock className="h-4 w-4" />
                      เข้าสู่ระบบเพื่อซื้อ
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      ซื้อชีทนี้
                    </>
                  )}
                </button>

                <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-400">
                  <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0" />
                  ชีทสรุปจัดทำโดยนักเรียน อาจมีข้อผิดพลาดได้
                </p>
              </div>

              {/* Publisher / contact */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-medium text-gray-400">ชีทจาก</p>

                <div className="flex items-center gap-3">
                  <Avatar src={u.image} name={u.name} seed={u.id} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-800">{u.name}</p>
                    {u.username && (
                      <Link
                        href={`/u/${u.username}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        @{u.username}
                      </Link>
                    )}
                  </div>
                </div>

                {socials.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={s.label}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                )}

                {contactHref && (
                  <a
                    href={contactHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    ติดต่อเจ้าของชีท
                  </a>
                )}

                {u.donatePromptPay && (
                  <button
                    type="button"
                    onClick={() => setShowDonate(true)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-pink-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
                  >
                    <Heart className="h-4 w-4" />
                    สนับสนุนเจ้าของชีท
                  </button>
                )}

                {u.username && (
                  <Link
                    href={`/u/${u.username}`}
                    className="mt-2 block w-full rounded-xl border border-gray-200 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    ดูชีททั้งหมดของคนนี้
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {showDonate && u.donatePromptPay && (
        <DonateModal
          promptPay={u.donatePromptPay}
          name={u.name}
          image={u.image}
          seed={u.id}
          onClose={() => setShowDonate(false)}
        />
      )}

      {showPurchase && isPaid && (
        <PurchaseModal
          sheetId={sheet.id}
          sheetTitle={sheet.title}
          price={sheet.price!}
          onClose={() => setShowPurchase(false)}
          onSuccess={() => {
            setShowPurchase(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
