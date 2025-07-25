import Link from "next/link";
import Bottombar from "./components/Bottombar";
import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import PaginationFooter from "./components/PaginationFooter";
import SheetRow from "@/app/components/SheetRow";

const sheets = [
  {
    subject: "คณิตศาสตร์",
    filename: "/m3/midterm1/math.pdf",
    icon: "/assets/img/icon/math.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "วิทยาศาสตร์",
    filename: "/m3/midterm1/sci.pdf",
    icon: "/assets/img/icon/sci.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "ภาษาไทย",
    filename: "/m3/midterm1/thai68.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "20/07/2025",
    term: "ม.3 เทอม 1",
    by: {
      name: "ger_nakub",
      url: "https://www.instagram.com/ger_nakub/",
    },
  },
  {
    subject: "ภาษาไทย",
    filename: "/m3/midterm1/thai.pdf",
    icon: "/assets/img/icon/thai.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "สังคมศึกษา",
    filename: "/m3/midterm1/social68.pdf",
    icon: "/assets/img/icon/social.png",
    date: "20/7/2025",
    term: "ม.3 เทอม 1",
    by: {
      name: "antnut8778",
      url: "https://www.instagram.com/antnut8778/",
    },
  },
  {
    subject: "สังคมศึกษา (One Page)",
    filename: "/m3/midterm1/social_onepage.pdf",
    icon: "/assets/img/icon/social.png",
    date: "20/7/2025",
    term: "ม.3 เทอม 1",
    by: {
      name: "jellorpxrz",
      url: "https://www.instagram.com/jellorpxrz/",
    },
    extraLink: {
      label: "Donate",
      url: "/donate/jellorpxrz",
    },
  },
  {
    subject: "สังคมศึกษา (2566)",
    filename: "/m3/midterm1/social.pdf",
    icon: "/assets/img/icon/social.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
  {
    subject: "ประวัติศาสตร์ (One Page)",
    filename: "/m3/midterm1/history_onepage.pdf",
    icon: "/assets/img/icon/history.png",
    date: "20/07/2025",
    term: "ม.3 เทอม 1",
    by: {
      name: "jellorpxrz",
      url: "https://www.instagram.com/jellorpxrz/",
    },
    extraLink: {
      label: "Donate",
      url: "/donate/jellorpxrz",
    },
  },
  {
    subject: "ประวัติศาสตร์",
    filename: "/m3/midterm1/history.pdf",
    icon: "/assets/img/icon/history.png",
    date: "20/07/2025",
    term: "ม.3 เทอม 1",
    by: {
      name: "ger_nakub",
      url: "https://www.instagram.com/ger_nakub/",
    },
  },
  {
    subject: "ภาษาอังกฤษ",
    filename: "/m3/midterm1/english68.pdf",
    icon: "/assets/img/icon/english.png",
    date: "22/07/2025",
    term: "ม.3 เทอม 1",
    by: {
      name: "ger_nakub",
      url: "https://www.instagram.com/ger_nakub/",
    },
  },
  {
    subject: "ภาษาอังกฤษ (2567)",
    filename: "/m3/midterm1/english67.pdf",
    icon: "/assets/img/icon/english.png",
    date: "20/07/2025",
    term: "ม.3 เทอม 1",
    by: {
      name: "nxmnuxng_q",
      url: "https://www.instagram.com/nxmnuxng_q/",
    },
  },
  {
    subject: "ภาษาอังกฤษเพิ่มเติม",
    filename: "/m3/midterm1/iep.pdf",
    icon: "/assets/img/icon/english.png",
    date: "29/11/2024",
    term: "ม.3 เทอม 1",
  },
];


export default function Home() {
  return (
    <div>
      <Navbar />
      <Bottombar />
      <link rel="shortcut icon" href="../public/assets/img/poomicon.png" />
      <main className="mt-8 h-full overflow-y-auto">
        <section>
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-gray-600">
              สอบกลางภาค
            </h1>
            <Countdown />
            <div className="mt-5 flex flex-col space-y-2 sm:flex-row sm:justify-center sm:space-y-0">
              <Link
                href="/select"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-[#f45455] hover:bg-[#d13f3f]"
              >
                โหลดชีทสรุป
                <svg
                  className="w-4 h-4 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/act.freedom"
                className="inline-flex justify-center items-center py-3 px-5 ml-0 md:ml-2 text-base font-medium text-center text-white rounded-lg bg-[#2e2b2b] hover:bg-[#221e1e"
              >
                ติดตามพวกเรา
              </Link>
            </div>
          </div>
        </section>
        <div className="container px-4 lg:px-8 mx-auto grid md:mb-[4vh] mb-[12vh]">
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
              leftArrow={{ label: "เทอม 1", href: "/m3/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m3/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m3/midterm1", isActive: true },
                { label: "ปลายภาค", href: "/m3/final1", isActive: false },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
