import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/config";
import SheetRow from "@/app/components/SheetRow";

const examType = "สอบปลายภาค" as const;

const sheets = [
  {
    subject: "คณิตศาสตร์",
    filename: "/m3/final2/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "วิทยาศาสตร์",
    filename: "/m3/final2/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "ภาษาไทย (เนื้อหาวิจัย)",
    filename: "/m3/final2/thai_new.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
    by: { name: "ขบวนการมะ", url: "https://discord.gg/Gjcr8XvaFM" },
  },
  {
    subject: "ภาษาไทย",
    filename: "/m3/final2/thai.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "สังคมศึกษา",
    filename: "/m3/final2/social.pdf",
    icon: "/assets/img/icon/social.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "ประวัติศาสตร์ (ใหม่)",
    filename: "/m3/final2/history_new.pdf",
    icon: "/assets/img/icon/history.png",
    date: "22/02/2025",
    term: "ม.3 เทอม 2",
    by: { name: "nxmnuxng_q", url: "https://www.instagram.com/nxmnuxng_q/" },
  },
  {
    subject: "ประวัติศาสตร์",
    filename: "/m3/final2/history.pdf",
    icon: "/assets/img/icon/history.png",
    date: "17/11/2024",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "ภาษาอังกฤษ (ใหม่)",
    filename: "/m3/final2/eng_new.pdf",
    icon: "/assets/img/icon/english.png",
    date: "24/02/2025",
    term: "ม.3 เทอม 2",
  },
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m3/final2/eng.pdf",
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

      <main className="mt-8 h-full overflow-y-auto">
        <div className="container px-4 lg:px-8 mx-auto grid md:mb-[4vh] mb-[12vh]">
          <h1 className="mx-auto mb-2 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-4xl text-gray-700">
            {examType} 2/{year}
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
                { label: "กลางภาค", href: "/m3/midterm2", isActive: false },
                { label: "ปลายภาค", href: "/m3/final2", isActive: true },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
