import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { basePath } from "../components/config";

const categories = [
  { level: "ม.1", year: "2565", href: `/m1/${basePath}`, color: "from-rose-500 to-pink-600" },
  { level: "ม.2", year: "2567", href: `/m2/${basePath}`, color: "from-orange-500 to-amber-600" },
  { level: "ม.3", year: "2567", href: `/m3/${basePath}`, color: "from-emerald-500 to-teal-600" },
  { level: "ม.4", year: "2567", href: `/m4/${basePath}`, color: "from-cyan-500 to-blue-600" },
  { level: "ม.5", year: "2568", href: `/m5/${basePath}`, color: "from-violet-500 to-purple-600" },
  { level: "ม.6", year: "2568", href: `/m6/${basePath}`, color: "from-fuchsia-500 to-pink-600" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Bottombar />
      <main className="pt-12 pb-24">
        <div className="container px-4 lg:px-8 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">เลือกระดับชั้น</h1>
            <p className="text-gray-500">เลือกชีทของระดับชั้นที่คุณต้องการจะอ่านสอบ</p>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href}>
                <div className={`group relative p-5 bg-gradient-to-br ${cat.color} rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                  <div className="relative z-10">
                    <span className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-white text-xs font-medium mb-2">
                      ปีการศึกษา {cat.year}
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {cat.level}
                    </h2>
                    <p className="text-white/80 text-sm">
                      ชีทสรุป{cat.level}
                    </p>
                    <div className="mt-3 flex items-center text-white text-sm font-medium">
                      <span>ดูชีท</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
