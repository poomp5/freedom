import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/config";
import SheetRow from "@/app/components/SheetRow";

const examType = "สอบปลายภาค" as const;

const sheets = [
  {
    subject: "อังกฤษ",
    filename: "/m5/final1/eng.pdf",
    icon: "/assets/img/icon/english.png",
    date: "23/09/2025",
    term: "ม.5 เทอม 1",
    by: { name: "มิสโมนา" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ภาษาไทย",
    filename: "/m5/final1/thai-tiger.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "22/09/2025",
    term: "ม.5 เทอม 1",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09/",
    },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ภาษาไทย",
    filename: "/m5/final1/thai.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "21/09/2025",
    term: "ม.5 เทอม 1",
    by: { name: "foko._", url: "https://www.instagram.com/foko._/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "คณิตศาสตร์ (พื้นฐาน)",
    filename: "/m5/final1/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "21/09/2025",
    term: "ม.5 เทอม 1",
    by: { name: "d3w4r_zz", url: "https://www.instagram.com/d3w4r_zz/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "วิทยาศาสตร์ (ห้องศิลป์)",
    filename: "/m5/final1/sci-dewar.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "23/09/2025",
    term: "ม.5 เทอม 1",
    by: { name: "d3w4r_zz", url: "https://www.instagram.com/d3w4r_zz/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "วิทยาศาสตร์ (ห้องศิลป์)",
    filename: "/m5/final1/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "21/09/2025",
    term: "ม.5 เทอม 1",
    by: { name: "มาสเตอร์พสิษฐ์" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "เคมี (พื้นฐาน)",
    filename: "/m5/final1/chemis.pdf",
    icon: "/assets/img/icon/chemistry.png",
    date: "11/12/2024",
    term: "ม.5 เทอม 1",
    by: { name: "bosssu_p", url: "https://www.instagram.com/bosssu_p/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "เคมี (GIFTED)",
    filename: "/m5/final1/chemis_gifted.pdf",
    icon: "/assets/img/icon/elec-chemi.png",
    date: "11/12/2024",
    term: "ม.5 เทอม 1",
    by: { name: "iammaylyyyy", url: "https://www.instagram.com/iammaylyyyy/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ชีววิทยา (ใหม่)",
    filename: "/m5/final1/biology-tiger.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "21/09/2025",
    term: "ม.5 เทอม 1",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09/",
    },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ฟิสิกส์",
    filename: "/m5/final1/physics.pdf",
    icon: "/assets/img/icon/physics.png",
    date: "21/09/2025",
    term: "ม.5 เทอม 1",
    by: {
      name: "มาสเตอร์ปอนด์",
      url: "https://www.instagram.com/_chps.x/",
    },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ฟิสิกส์",
    filename: "/m5/final1/physics-pai.pdf",
    icon: "/assets/img/icon/physics.png",
    date: "21/09/2025",
    term: "ม.5 เทอม 1",
    by: {
      name: "kongphobbb.007",
      url: "https://www.instagram.com/kongphobbb.007/",
    },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ชีววิทยา (2567)",
    filename: "/m5/final1/biology-oil.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "20/09/2025",
    term: "ม.5 เทอม 1",
    by: { name: "cotarincy_", url: "https://www.instagram.com/cotarincy_/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ชีววิทยา (2567)",
    filename: "/m5/final1/biology.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "11/12/2024",
    term: "ม.5 เทอม 1",
    by: { name: "bosssu_p", url: "https://www.instagram.com/bosssu_p/" },
    examType: "สอบปลายภาค" as const,
  },
  {
    subject: "ประวัติศาสตร์",
    filename: "/m5/final1/history.pdf",
    icon: "/assets/img/icon/history.png",
    date: "21/09/2025",
    term: "ม.5 เทอม 1",
    by: { name: "มาสเตอร์เขม" },
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
                { label: "กลางภาค", href: "/m5/midterm1", isActive: false },
                { label: "ปลายภาค", href: "/m5/final1", isActive: true },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
