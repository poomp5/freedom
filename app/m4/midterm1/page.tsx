import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/var";
import SheetRow from "@/app/components/SheetRow";

const sheets = [
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m4/midterm1/english.pdf",
    icon: "/assets/img/icon/english.png",
    date: "20/7/2025",
    term: "ม.4 เทอม 1",
    by: { name: "cholemie", url: "https://www.instagram.com/cholemie/" },
  },
  {
    subject: "ประวัติศาสตร์",
    filename: "/m4/midterm1/history.pdf",
    icon: "/assets/img/icon/history.png",
    date: "20/7/2025",
    term: "ม.4 เทอม 1",
    by: { name: "cholemie", url: "https://www.instagram.com/cholemie/" },
  },
  {
    subject: "สังคมศึกษา",
    filename: "/m4/midterm1/social.pdf",
    icon: "/assets/img/icon/social.png",
    date: "20/7/2025",
    term: "ม.4 เทอม 1",
    by: { name: "cholemie", url: "https://www.instagram.com/cholemie/" },
  },
  {
    subject: "สังคมศึกษา (2567)",
    filename: "/m4/midterm1/social2567.pdf",
    icon: "/assets/img/icon/social.png",
    date: "14/7/2024",
    term: "ม.4 เทอม 1",
    by: { name: "มิสเกม" },
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
            สอบกลางภาค 1/{year}
          </h1>
          <p className="mx-auto mb-4 text-xl text-gray-500">
            ชีทสรุป (ม.4) ที่จัดทำในปีการศึกษา 2568
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
                { label: "กลางภาค", href: "/m4/midterm1", isActive: true },
                { label: "ปลายภาค", href: "/m4/final1", isActive: false },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
