import Link from "next/link";
import Image from "next/image";
import Bottombar from "./components/Bottombar";
import Navbar from "./components/Navbar";
// import Countdown from "./components/Countdown";
import PaginationFooter from "./components/PaginationFooter";
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
            {/* <Countdown /> */}
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
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link href={'/m3/midterm2/math.pdf'} className="flex items-center text-sm">
                        <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                          <Image
                            className="icon-subject object-cover w-full h-auto"
                            src="/assets/img/icon/math.png"
                            alt="math"
                            width={100}
                            height={100}
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
                      <Link href={'/m3/midterm2/math.pdf'}>
                        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                          ดาวน์โหลด
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      17/11/2024
                    </td>
                  </tr>
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link href={'/m3/midterm2/sci.pdf'} className="flex items-center text-sm">
                        <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                          <Image
                            className="icon-subject object-cover w-full h-auto"
                            src="/assets/img/icon/sci.png"
                            alt="math"
                            width={100}
                            height={100}
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                        <div className="inline-block">
                          <p className="font-semibold whitespace-nowrap">
                            วิทยาศาสตร์
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
                      <Link href={'/m3/midterm2/sci.pdf'}>
                        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                          ดาวน์โหลด
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      17/11/2024
                    </td>
                  </tr>
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link href={'/m3/midterm2/thai.pdf'} className="flex items-center text-sm">
                        <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                          <Image
                            className="icon-subject object-cover w-full h-auto"
                            src="/assets/img/icon/thai.png"
                            alt="math"
                            width={100}
                            height={100}
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                        <div className="inline-block">
                          <p className="font-semibold whitespace-nowrap">
                            ภาษาไทย
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
                      <Link href={'/m3/midterm2/thai.pdf'}>
                        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                          ดาวน์โหลด
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      17/11/2024
                    </td>
                  </tr>
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link href={'/m3/midterm2/social.pdf'} className="flex items-center text-sm">
                        <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                          <Image
                            className="icon-subject object-cover w-full h-auto"
                            src="/assets/img/icon/social.png"
                            alt="math"
                            width={100}
                            height={100}
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                        <div className="inline-block">
                          <p className="font-semibold whitespace-nowrap">
                            สังคมศึกษา
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
                      <Link href={'/m3/midterm2/social.pdf'}>
                        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                          ดาวน์โหลด
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      17/11/2024
                    </td>
                  </tr>
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link href={'/m3/midterm2/history.pdf'} className="flex items-center text-sm">
                        <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                          <Image
                            className="icon-subject object-cover w-full h-auto"
                            src="/assets/img/icon/history.png"
                            alt="math"
                            width={100}
                            height={100}
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                        <div className="inline-block">
                          <p className="font-semibold whitespace-nowrap">
                            ประวัติศาสตร์
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
                      <Link href={'/m3/midterm2/history.pdf'}>
                        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                          ดาวน์โหลด
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      17/11/2024
                    </td>
                  </tr>
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">
                      <Link href={'/m3/midterm2/eng.pdf'} className="flex items-center text-sm">
                        <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                          <Image
                            className="icon-subject object-cover w-full h-auto"
                            src="/assets/img/icon/english.png"
                            alt="math"
                            width={100}
                            height={100}
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                        <div className="inline-block">
                          <p className="font-semibold whitespace-nowrap">
                            ภาษาอังกฤษ
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
                      <Link href={'/m3/midterm2/eng.pdf'}>
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
            <PaginationFooter
              leftArrow={{ label: "เทอม 1", href: "/m3/midterm1" }}
              rightArrow={{ label: "เทอม 2", href: "/m3/midterm2" }}
              links={[
                { label: "กลางภาค", href: "/m3/midterm2", isActive: true },
                { label: "ปลายภาค", href: "/m3/final2", isActive: false },
              ]}
            />
          </div>
        </div>
    </main>
    </div>  
  );
}
