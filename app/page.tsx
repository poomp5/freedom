import Link from "next/link";
import Image from "next/image";
import Bottombar from "./components/Bottombar";
import Navbar from "./components/Navbar";

export default function Home() { 
  return (
    <div>
      <Navbar />
      <Bottombar  />
      <link rel="shortcut icon" href="../public/assets/img/poomicon.png" />
    <main className="mt-8 h-full overflow-y-auto">
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-gray-600">สอบกลางภาค</h1>
            
        <div className="mt-5 flex flex-col space-y-2 sm:flex-row sm:justify-center sm:space-y-0">
              <Link href="/select" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-[#f45455] hover:bg-[#d13f3f]">
            โหลดชีทสรุป
              <svg className="w-4 h-4 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
              </svg>
              </Link>
              <Link href="https://www.instagram.com/act.freedom" className="inline-flex justify-center items-center py-3 px-5 ml-0 md:ml-2 text-base font-medium text-center text-white rounded-lg bg-[#2e2b2b] hover:bg-[#221e1e">
                ติดตามพวกเรา
             </Link>
        </div>
      </div>
    </section>
    <div className="container px-4 lg:px-8 mx-auto grid">
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
              <tr className="text-gray-700">
                <td className="px-4 py-3">
                  <Link href={'/m3/midterm2/math.pdf'} className="flex items-center text-sm">
                    <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                        <Image
                          className="icon-subject object-cover w-full h-auto"
                          src="/assets/img/icon/math.png"
                          alt="math"
                          width={12}
                          height={12}
                        />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div className="inline-block">
                      <p className="font-semibold whitespace-nowrap">
                        คณิตศาสตร์
                      </p>
                      <p className="text-xs text-gray-600">
                        สอบกลางภาค
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  ม.3 เทอม 2
                </td>
                <td className="px-4 py-3 text-xs">
                  <Link href="./pdf/m4/final1/math_2.pdf">
                    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                      ดาวน์โหลด
                    </span>
                  </Link>
                </td>
                <td className="px-2 py-3 text-sm">
                  17/11/2024
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t bg-gray-50 sm:grid-cols-9">
          <span className="flex items-center col-span-3">
            กำลังแสดง หน้า 1 จาก 1
          </span>
          <span className="col-span-2"></span>
          <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
              <ul className="inline-flex items-center">
                <li>
                  <button className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-red" aria-label="Previous">
                    <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 text-white transition-colors duration-150 bg-red-600 border border-r-0 border-red-600 rounded-md focus:outline-none focus:shadow-outline-red">
                    1
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-red" aria-label="Next">
                    <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </span>
        </div>
      </div>
    </div>
    </main>
    </div>  
  );
}
