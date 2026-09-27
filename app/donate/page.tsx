import Link from "next/link";
import { ArrowRight, FileText, Heart, Settings } from "lucide-react";
import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Avatar from "../components/Avatar";
import { getDonorAccounts } from "@/lib/donors";

export const metadata = {
  title: "สนับสนุนผู้จัดทำ | FREEDOM",
};

// Built from the cached donor list; refreshed when someone changes their PromptPay.
export const revalidate = 300;

export default async function DonateHome() {
  const donors = await getDonorAccounts();

  return (
    <div>
      <Navbar />
      <Bottombar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-24 md:pb-12">
        <div className="relative mx-auto max-w-screen-xl px-4 py-12 lg:py-16">
          <div className="mb-10 text-center">
            <h1 className="mb-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text pb-2 text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
              สนับสนุนผู้จัดทำ
            </h1>
            <p className="mx-auto max-w-2xl text-gray-500">
              เลือกคนที่คุณอยากสนับสนุน ทุกการโดเนทส่งตรงถึงเจ้าของผ่านพร้อมเพย์
            </p>
          </div>

          {donors.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <Heart className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">ยังไม่มีผู้จัดทำที่เปิดรับโดเนท</p>
            </div>
          ) : (
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {donors.map((donor) => (
                <Link
                  key={donor.id}
                  href={donor.href}
                  className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg"
                >
                  <Avatar
                    src={donor.image}
                    name={donor.name}
                    seed={donor.id}
                    size={88}
                    className="mb-4 ring-4 ring-pink-50"
                  />
                  <h2 className="w-full truncate text-lg font-bold text-gray-800">{donor.name}</h2>
                  {donor.username && <p className="text-sm text-gray-400">@{donor.username}</p>}
                  <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <FileText className="h-3.5 w-3.5" />
                    {donor.sheetCount > 0 ? `ชีทสรุป ${donor.sheetCount} ชีท` : "ทีม Freedom"}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pink-600">
                    <Heart className="h-4 w-4" />
                    โดเนท
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/profile"
            className="mx-auto flex max-w-md items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-5 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="rounded-full bg-white/20 p-2.5">
              <Settings className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">อยากมีชื่ออยู่ตรงนี้?</h3>
              <p className="text-sm text-white/80">เพิ่มเลขพร้อมเพย์ในหน้าโปรไฟล์ของคุณได้เลย</p>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
