"use client";

import { useEffect, useId, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MapPin, School, Send } from "lucide-react";
import { useTRPC } from "@/trpc/client";

const inputClass =
  "w-full rounded-lg border border-[#cbdff7] bg-white px-3.5 py-2.5 text-sm text-[#172b4d] placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

type SchoolOption = { id: string; name: string; province: string; district: string };

/**
 * School name with suggestions from the School table (all MOE schools).
 * Free text is still accepted for schools that are not in the list.
 */
function SchoolCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string, school: SchoolOption | null) => void;
}) {
  const trpc = useTRPC();
  const listId = useId();
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value.trim()), 250);
    return () => window.clearTimeout(id);
  }, [value]);

  const { data: results = [], isFetching } = useQuery({
    ...trpc.schools.search.queryOptions({ q: debounced }),
    enabled: debounced.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
  const showList = open && debounced.length >= 2 && results.length > 0;

  const pick = (school: SchoolOption) => {
    onChange(school.name, school);
    setOpen(false);
    setActive(-1);
  };

  return (
    <div className="relative">
      <input
        id="contact-school"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value, null);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (!showList) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            pick(results[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="พิมพ์ชื่อโรงเรียน เช่น อัสสัมชัญธนบุรี"
        className={`${inputClass} pr-9`}
        maxLength={200}
        required
      />
      {isFetching && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" aria-hidden="true" />
      )}
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-[#cbdff7] bg-white py-1 shadow-lg"
        >
          {results.map((school, i) => (
            <li
              key={school.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown fires before the input's blur closes the list.
              onMouseDown={(e) => {
                e.preventDefault();
                pick(school);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-3.5 py-2 ${i === active ? "bg-blue-50" : ""}`}
            >
              <p className="text-sm text-[#172b4d]">{school.name}</p>
              <p className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {school.district} · {school.province}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Home page form for schools that want to run their own Freedom. */
export default function ContactForm() {
  const trpc = useTRPC();
  const [form, setForm] = useState({ schoolName: "", email: "", contactName: "", message: "", website: "" });
  const [school, setSchool] = useState<SchoolOption | null>(null);
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
        schoolId: school?.id,
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
              <SchoolCombobox
                value={form.schoolName}
                onChange={(name, picked) => {
                  setForm((f) => ({ ...f, schoolName: name }));
                  setSchool(picked);
                }}
              />
              {school && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[#52769c]">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {school.district} · {school.province}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
                  อีเมลติดต่อกลับ <span className="text-red-500">*</span>
                </label>
                <input id="contact-email" type="email" value={form.email} onChange={set("email")} placeholder="contact@pranakorn.co.th" className={inputClass} maxLength={200} required />
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
