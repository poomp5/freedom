import Navbar from "../../components/Navbar";
import Bottombar from "../../components/Bottombar";
import PaginationFooter from "../../components/PaginationFooter";
import { year } from "@/app/components/config";
import SheetRow from "@/app/components/SheetRow";

const examType = "สอบปลายภาค" as const;
const sheets = [
  {
    subject: "ชีววิทยา (เรื่อง ประชากร)",
    filename: "/m5/final1/biology.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "25/09/2025",
    term: "ม.6 เทอม 1",
    by: { name: "cotarincy_", url: "https://www.instagram.com/cotarincy_/" },
    examType: "สอบปลายภาค" as const,
  },
];
export default function Home() {
  return (
    <div>
      <Navbar />
      <Bottombar />

      <main className="mt-8 h-full overflow-y-auto">
        <div className="container px-4 lg:px-8 mx-auto grid md:mb-[4vh] mb-[12vh]">
          <h1 className="mx-auto mb-2 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-4xl text-gray-700">
            {examType} 1/{year}
          </h1>
          <p className="mx-auto mb-4 text-xl text-gray-500">
            ชีทสรุป (ม.6) ที่จัดทำในปีการศึกษา 2566
          </p>

          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                    <th className="px-4 py-3">ชื่อวิชา</th>
                    <th className="px-4 py-3">รายละเอียด</th>
                    <th className="px-4 py-3">ไฟล์</th>
                    <th className="px-2 py-3">วันที่</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y0">
                  {sheets.map((sheet, i) => (
                    <SheetRow key={i} {...sheet} examType={examType} />
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationFooter
              leftArrow={{ label: "เทอม 1", href: "/m6/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m6/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m6/midterm1", isActive: false },
                { label: "ปลายภาค", href: "/m6/final1", isActive: true },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
