import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/var";
import SheetRow from "@/app/components/SheetRow";

const sheets = [
  {
    subject: "ภาษาไทย (ย่อความ)",
    filename: "/m4/final1/thai.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "11/12/2024",
    term: "ม.4 เทอม 1",
    examType: "สอบปลายภาค" as const,
    by: {
      name: "mxyaaxce",
      url: "https://www.instagram.com/mxyaaxce/",
    },
  },
  {
    subject: "คณิตศาสตร์ (พื้นฐาน)",
    filename: "/m4/final1/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "11/12/2024",
    term: "ม.4 เทอม 1",
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "วิทยาศาสตร์ (ห้องศิลป์)",
    filename: "/m4/final1/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "11/12/2024",
    term: "ม.4 เทอม 1",
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ชีววิทยา (ห้องสายวิทย์)",
    filename: "/m4/final1/biology.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "11/12/2024",
    term: "ม.4 เทอม 1",
    examType: "สอบปลายภาค" as const,
    by: { name: "มิสบีม" },
  },
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m4/final1/eng.pdf",
    icon: "/assets/img/icon/english.png",
    date: "29/11/2024",
    term: "ม.4 เทอม 1",
    examType: "สอบปลายภาค" as const,
    by: {
      name: "creammyeiieee__",
      url: "https://www.instagram.com/creammyeiieee__/",
    },
  },
];

export default function Home() {
  return (
    <div>
      <Navbar />
      <Bottombar />
      <link rel="shortcut icon" href="../public/assets/img/poomicon.png" />
      <main className="mt-8 h-full overflow-y-auto">
        <div className="container px-4 lg:px-8 mx-auto grid md:mb-[4vh] mb-[12vh]">
          <h1 className="mx-auto mb-2 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-4xl text-gray-700">
            สอบปลายภาค 1/{year}
          </h1>
          <p className="mx-auto mb-4 text-xl text-gray-500">
            ชีทสรุป (ม.4) ที่จัดทำในปีการศึกษา 2566
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
                    <SheetRow key={i} {...sheet} />
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationFooter
              leftArrow={{ label: "เทอม 1", href: "/m4/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m4/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m4/midterm1", isActive: false },
                { label: "ปลายภาค", href: "/m4/final1", isActive: true },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
