"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, School, Send } from "lucide-react";
import { useTRPC } from "@/trpc/client";

const inputClass =
  "w-full rounded-lg border border-[#cbdff7] bg-white px-3.5 py-2.5 text-sm text-[#172b4d] placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

/** Home page form for schools that want to run their own Freedom. */
export default function ContactForm() {
  const trpc = useTRPC();
  const [form, setForm] = useState({ schoolName: "", email: "", contactName: "", message: "", website: "" });
  const [error, setError] = useState("");
  const mutation = useMutation(trpc.contact.requestPlatform.mutationOptions());

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.schoolName.trim().length < 2) return setError("กรุณากรอกชื่อโรงเรียน");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("กรุณากรอกอีเมลให้ถูกต้อง");

    try {
      await mutation.mutateAsync({
        schoolName: form.schoolName,
        email: form.email,
        contactName: form.contactName || undefined,
        message: form.message || undefined,
        website: form.website || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "ส่งไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-[#dbe7f5] bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-[22px] py-14 md:grid-cols-[1fr_1.2fr] md:px-7 md:py-20">
        <div>
          <span className="text-xs tracking-wide text-blue-600">FOR SCHOOLS</span>
          <h2>อยากใช้ระบบ Freedom ที่โรงเรียนของคุณ?</h2>
          <p className="mt-2 text-sm font-light leading-7 text-[#64748b]">
            ทิ้งชื่อโรงเรียนและอีเมลไว้ แล้วทีม Freedom จะติดต่อกลับเพื่อช่วยตั้งพื้นที่แบ่งปันชีทสรุปให้เพื่อน ๆ ในโรงเรียนของคุณ
          </p>
          <div className="mt-6 hidden items-center gap-3 rounded-xl bg-[#f0f7ff] p-4 text-sm text-[#52769c] md:flex">
            <School className="h-8 w-8 shrink-0 text-blue-500" strokeWidth={1.5} />
            ใช้ได้ฟรี ทั้งระบบอัปโหลดชีท ค้นหา และหน้าโปรไฟล์ผู้เผยแพร่
          </div>
        </div>

        {mutation.isSuccess ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center">
            <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-600" />
            <p className="font-medium text-emerald-800">ส่งข้อมูลเรียบร้อยแล้ว</p>
            <p className="mt-1 text-sm text-emerald-700">ทีมงานจะติดต่อกลับทางอีเมล {form.email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#dbe7f5] bg-[#f8fbff] p-5 sm:p-6" noValidate>
            <div>
              <label htmlFor="contact-school" className="mb-1.5 block text-sm font-medium">
                ชื่อโรงเรียน <span className="text-red-500">*</span>
              </label>
              <input id="contact-school" value={form.schoolName} onChange={set("schoolName")} placeholder="เช่น โรงเรียนอัสสัมชัญธนบุรี" className={inputClass} maxLength={200} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
                  อีเมลติดต่อกลับ <span className="text-red-500">*</span>
                </label>
                <input id="contact-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputClass} maxLength={200} required />
              </div>
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">ชื่อผู้ติดต่อ</label>
                <input id="contact-name" value={form.contactName} onChange={set("contactName")} placeholder="ไม่บังคับ" className={inputClass} maxLength={100} />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">ข้อความเพิ่มเติม</label>
              <textarea id="contact-message" value={form.message} onChange={set("message")} rows={3} placeholder="ไม่บังคับ" className={inputClass} maxLength={1000} />
            </div>
            {/* Honeypot — hidden from people. */}
            <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              ส่งข้อมูลติดต่อ
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
