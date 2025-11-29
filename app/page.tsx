import Link from "next/link";
import Image from "next/image";
import Bottombar from "./components/Bottombar";
import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import PaginationFooter from "./components/PaginationFooter";
import SheetRow from "@/app/components/SheetRow";

const examType = "สอบปลายภาค" as const;

const sheets = [
  {
    subject: "คณิตศาสตร์",
    filename: "/m3/midterm2/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "วิทยาศาสตร์",
    filename: "/m3/midterm2/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "ภาษาไทย",
    filename: "/m3/midterm2/thai.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "สังคมศึกษา",
    filename: "/m3/midterm2/social.pdf",
    icon: "/assets/img/icon/social.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "ประวัติศาสตร์",
    filename: "/m3/midterm2/history.pdf",
    icon: "/assets/img/icon/history.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m3/midterm2/eng.pdf",
    icon: "/assets/img/icon/english.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
];


export default function Home() {
  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="h-full overflow-y-auto">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative py-12 px-4 mx-auto max-w-screen-xl lg:py-20">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Left - Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  เตรียมตัวสอบด้วยชีทสรุป
                </div>

                <h1 className="mb-4 text-5xl font-extrabold tracking-tight leading-none md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {examType}
                </h1>
                <p className="mb-6 text-lg text-gray-500 max-w-xl">
                  ฟรีด้อม รวมชีทสรุปทุกวิชา
                </p>

                <Countdown />

                <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                  <Link
                    href="/select"
                    className="group inline-flex justify-center items-center py-4 px-8 text-lg font-semibold text-center text-white rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                  >
                    โหลดชีทสรุป
                    <svg
                      className="w-5 h-5 ms-2 transition-transform duration-300 group-hover:-translate-y-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="https://www.instagram.com/act.freedom"
                    className="group inline-flex justify-center items-center py-4 px-8 text-lg font-semibold text-center text-gray-700 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    ติดตามพวกเรา
                  </Link>
                </div>
              </div>

              {/* Right - Avatar Image */}
              <div className="flex-shrink-0 relative z-0">
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200/50"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-cyan-200/50"></div>
                  {/* Image */}
                  <Image
                    src="/assets/img/freedom-avatar.png"
                    alt="Freedom Avatar"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="py-12 bg-gradient-to-b from-white to-blue-50/50">
          <div className="px-4 mx-auto max-w-screen-xl md:mb-[4vh] mb-[12vh]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">ชีทสรุป ม.3</h2>
              <p className="text-gray-500">เลือกชีทที่ต้องการแล้วกดโหลดได้เลย</p>
            </div>
            <div className="w-full overflow-hidden rounded-2xl shadow-lg border border-blue-100 bg-white">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="px-4 py-4">ชื่อวิชา</th>
                      <th className="px-4 py-4 whitespace-nowrap">รายละเอียด</th>
                      <th className="px-4 py-4">ไฟล์</th>
                      <th className="px-2 py-4">วันที่</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {sheets.map((sheet, i) => (
                      <SheetRow key={i} {...sheet} examType={examType} />
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationFooter
                leftArrow={{ label: "เทอม 1", href: "/m3/midterm1" }}
                rightArrow={{ label: "เทอม 2", href: "/m3/midterm2" }}
                links={[
                  { label: "กลางภาค", href: "/m3/midterm1", isActive: false },
                  { label: "ปลายภาค", href: "/m3/final1", isActive: true },
                ]}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}