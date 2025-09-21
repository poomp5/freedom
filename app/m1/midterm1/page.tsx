import Navbar from "../../components/Navbar";
import Bottombar from "../../components/Bottombar";
import PaginationFooter from "../../components/PaginationFooter";
import { year } from "@/app/components/config";
// import SheetRow from "@/app/components/SheetRow";

const examType = "สอบกลางภาค" as const;

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
            ชีทสรุป (ม.1) ที่จัดทำในปีการศึกษา 2568
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
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-500 py-6 text-sm"
                    >
                      ยังไม่มีชีทตอนนี้
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <PaginationFooter
              leftArrow={{ label: "เทอม 1", href: "/m1/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m1/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m1/midterm1", isActive: true },
                { label: "ปลายภาค", href: "/m1/final1", isActive: false },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
