import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/var";
import SheetRow from "@/app/components/SheetRow";

const sheets = [
  {
    subject: "วิทยาศาสตร์",
    filename: "/m5/midterm1/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "15/07/2025",
    term: "ม.5 เทอม 1",
    by: { name: "มาสเตอร์พสิษฐ์" },
  },
  {
    subject: "สังคมศึกษา",
    filename: "/m5/midterm1/social.pdf",
    icon: "/assets/img/icon/social.png",
    date: "19/07/2025",
    term: "ม.5 เทอม 1",
    by: { name: "มาสเตอร์ตุ๊ต๊ะ" },
  },
  {
    subject: "ประวัติศาสตร์",
    filename: "/m5/midterm1/history.pdf",
    icon: "/assets/img/icon/history.png",
    date: "19/07/2025",
    term: "ม.5 เทอม 1",
    by: { name: "มาสเตอร์เขม" },
  },
  {
    subject: "ประวัติศาสตร์ (นเรศวร)",
    filename: "/m5/midterm1/history_naresuan.pdf",
    icon: "/assets/img/icon/history.png",
    date: "19/07/2025",
    term: "ม.5 เทอม 1",
    by: { name: "มาสเตอร์เขม" },
  },
  {
    subject: "ชีววิทยา",
    filename: "/m5/midterm1/biology.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "19/07/2025",
    term: "ม.5 เทอม 1",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "ชีววิทยา (Plant tissue)",
    filename: "/m5/midterm1/biology_plant.pdf",
    icon: "/assets/img/icon/biology.png",
    date: "23/07/2025",
    term: "ม.5 เทอม 1",
    by: {
      name: "torgor_xlt.09",
      url: "https://www.instagram.com/torgor_xlt.09",
    },
  },
  {
    subject: "คณิตศาสตร์",
    filename: "/m5/midterm1/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "19/07/2025",
    term: "ม.5 เทอม 1",
    by: {
      name: "d3w4r_zz",
      url: "https://www.instagram.com/d3w4r_zz/",
    },
    extraLink: {
      label: "Canva",
      url: "https://www.canva.com/design/DAGtkcL6n7I/AMpAJ9SZivS0R6JurYuv8w/edit?utm_content=DAGtkcL6n7I&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
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
              สอบกลางภาค 1/{year}
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
                      <SheetRow key={i} {...sheet} />
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationFooter
                leftArrow={{ label: "เทอม 1", href: "/m5/midterm1" }}
                rightArrow={{ label: "เทอม 2", href: "/m5/midterm2" }}
                links={[
                  { label: "กลางภาค", href: "/m5/midterm1", isActive: true },
                  { label: "ปลายภาค", href: "/m5/final1", isActive: false },
                ]}
              />
            </div>
          </div>
        </main>
      </div>
    );
}
