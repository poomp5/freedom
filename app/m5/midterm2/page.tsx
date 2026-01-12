import Navbar from "../../components/Navbar";
import Bottombar from "../../components/Bottombar";
import PaginationFooter from "../../components/PaginationFooter";
import { year } from "@/app/components/config";
import SheetRow from "@/app/components/SheetRow";

const examType = "สอบกลางภาค" as const;

const sheets = [
  {
    subject: "ชีววิทยา",
    filename: "/m5/midterm2/biology.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "30/11/2025",
    term: "ม.5 เทอม 2",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "ชีววิทยา (Circulatory & Respiratory System)",
    filename: "/m5/midterm2/biology-edit.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "14/12/2025",
    term: "ม.5 เทอม 2",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "ชีววิทยา (แนวข้อสอบ)",
    filename: "/m5/midterm2/biology-exam.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "13/12/2025",
    term: "ม.5 เทอม 2",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "ชีววิทยา (67)",
    filename: "/m5/midterm2/biology-67.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "12/12/2025",
    term: "ม.5 เทอม 2",
    by: {
      name: "ppuinoon.s",
      url: "https://www.instagram.com/ppuinoon.s",
    },
  },

  {
    subject: "วิทยาศาสตร์ (สายศิลป์)",
    filename: "/m5/midterm2/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "7/12/2025",
    term: "ม.5 เทอม 2",
    by: {
      name: "มาสเตอร์พสิษฐ์",
    },
  },
  {
    subject: "คณิตพื้นฐาน",
    filename:
      "https://www.canva.com/design/DAG7E1TVVUk/uDqGAcwC_pW-lyxGVxzH4w/view",
    icon: "/assets/img/icon/math.png",
    date: "11/12/2025",
    term: "ม.5 เทอม 2",
    by: {
      name: "d3w4r_zz",
      url: "https://www.instagram.com/d3w4r_zz/",
    },
    extraLink: {
      label: "Canva",
      url: "https://www.canva.com/design/DAG7E1TVVUk/uDqGAcwC_pW-lyxGVxzH4w/view",
    },
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
            {examType} 2/{year}
          </h1>
          <p className="mx-auto mb-4 text-xl text-gray-500">
            ชีทสรุป (ม.5) ที่จัดทำในปีการศึกษา 2568
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
              leftArrow={{ label: "เทอม 1", href: "/m5/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m5/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m5/midterm2", isActive: true },
                { label: "ปลายภาค", href: "/m5/final2", isActive: false },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
