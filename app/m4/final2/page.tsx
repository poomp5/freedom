import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/config";
import SheetRow from "@/app/components/SheetRow";

const examType = "สอบปลายภาค" as const;

const sheets = [
  {
    subject: "คณิตศาสตร์",
    filename: "/m4/final2/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "22/02/2025",
    term: "ม.4 เทอม 2",
    by: { name: "d3w4r_zz", url: "https://www.instagram.com/d3w4r_zz/" },
  },
  {
    subject: "คณิตศาสตร์ (เพิ่มเติม)",
    filename: "/m4/final2/math_extra.pdf",
    icon: "/assets/img/icon/math.png",
    date: "23/02/2025",
    term: "ม.4 เทอม 2",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "ชีววิทยา",
    filename: "/m4/final2/biology.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "24/02/2025",
    term: "ม.4 เทอม 2",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "เคมี",
    filename: "/m4/final2/chemistry.pdf",
    icon: "/assets/img/icon/chemistry.png",
    date: "25/02/2025",
    term: "ม.4 เทอม 2",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "วิทยาศาสตร์",
    filename: "/m4/final2/sci_new.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "25/02/2025",
    term: "ม.4 เทอม 2",
    note: "มีการแก้ไข",
    by: { name: "d3w4r_zz", url: "https://www.instagram.com/d3w4r_zz/" },
  },
  {
    subject: "สังคมศึกษา",
    filename: "/m4/final2/social.pdf",
    icon: "/assets/img/icon/social.png",
    date: "22/02/2025",
    term: "ม.4 เทอม 2",
    by: { name: "มิสเกม" },
  },
  {
    subject: "ฟิสิกส์",
    filename: "/m4/final2/physics2.pdf",
    icon: "/assets/img/icon/physics.png",
    date: "23/02/2025",
    term: "ม.4 เทอม 2",
    note: "มีการแก้ไข",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m4/final2/eng.pdf",
    icon: "/assets/img/icon/english.png",
    date: "23/02/2025",
    term: "ม.4 เทอม 2",
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

      <main className="mt-8 h-full overflow-y-auto">
        <div className="container px-4 lg:px-8 mx-auto grid md:mb-[4vh] mb-[12vh]">
          <h1 className="mx-auto mb-2 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-4xl text-gray-700">
            {examType} 2/{year}
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
                    <SheetRow key={i} {...sheet} examType={examType} />
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationFooter
              leftArrow={{ label: "เทอม 1", href: "/m4/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m4/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m4/midterm2", isActive: false },
                { label: "ปลายภาค", href: "/m4/final2", isActive: true },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
