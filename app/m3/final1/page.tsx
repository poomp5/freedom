import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/config";
import SheetRow from "@/app/components/SheetRow";
const examType = "สอบปลายภาค" as const;
const sheets = [
  {
    subject: "คณิตศาสตร์",
    filename: "/m3/final1/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "วิทยาศาสตร์",
    filename: "/m3/final1/sci-chemis.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "21/09/2025",
    term: "ม.3 เทอม 1",
    by: { name: "antnut8778", url: "https://www.instagram.com/antnut8778/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "วิทยาศาสตร์ (2567)",
    filename: "/m3/final1/sci-nana.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "21/09/2025",
    term: "ม.3 เทอม 1",
    by: { name: "jirariin", url: "https://www.instagram.com/jirariin/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "วิทยาศาสตร์ (2566)",
    filename: "/m3/final1/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "ภาษาไทย",
    filename: "/m3/final1/thai.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "สังคมศึกษา",
    filename: "/m3/final1/social.pdf",
    icon: "/assets/img/icon/social.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "ประวัติศาสตร์",
    filename: "/m3/final1/history.pdf",
    icon: "/assets/img/icon/history.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m3/final1/eng.pdf",
    icon: "/assets/img/icon/english.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m3/final1/eng-new.pdf",
    icon: "/assets/img/icon/english.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
    by: {
      name: "blevrsq",
      url: "https://www.instagram.com/blevrsq/",
    },
    extraLink: {
      label: "Donate",
      url: "/donate/blevrsq",
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
            {examType} 1/{year}
          </h1>

          <p className="mx-auto mb-4 text-xl text-gray-500">
            ชีทสรุป (ม.3) ที่จัดทำในปีการศึกษา 2566
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
              leftArrow={{ label: "เทอม 1", href: "/m3/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m3/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m3/midterm1", isActive: false },
                { label: "ปลายภาค", href: "/m3/final1", isActive: true },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
