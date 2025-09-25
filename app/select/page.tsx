import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { basePath } from "../components/config";

const categories = [
  { level: "ม.1", year: "2565", href: `/m1/${basePath}` },
  { level: "ม.2", year: "2567", href: `/m2/${basePath}` },
  { level: "ม.3", year: "2567", href: `/m3/${basePath}` },
  { level: "ม.4", year: "2567", href: `/m4/${basePath}` },
  { level: "ม.5", year: "2568", href: `/m5/${basePath}` },
  { level: "ม.6", year: "2568", href: `/m6/${basePath}` },
];

export default function Home() {
  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="mt-8 h-screen overflow-y-auto">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex justify-between mb-4">
            <h1 className="my-2 text-xl text-gray-800">Choose category</h1>
            <h1 className="my-2 text-lg text-gray-600">เลือกระดับชั้น</h1>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-1 grid-cols-1 gap-2">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href}>
                <div className="p-4 bg-gray-700 rounded-lg shadow-xs border border-gray-600 border-1 hover:-translate-y-1.5 transition-all duration-150">
                  <div className="text-center">
                    <p className="mb-2 text-2xl font-semibold text-white">
                      ชีทสรุป {cat.level}
                    </p>
                    <p className="text-lg font-normal text-gray-200">
                      ชีทของปีการศึกษา {cat.year}
                    </p>
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
