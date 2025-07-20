import Link from "next/link";
import Image from "next/image";
import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/var";
import { LinkIcon } from "lucide-react";
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
                    <tr className="text-gray-700">
                      <td className="px-4 py-3">
                        <Link
                          href={"/m5/midterm1/sci.pdf"}
                          className="flex items-center text-sm"
                        >
                          <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                            <Image
                              className="icon-subject object-cover w-full h-auto"
                              src="/assets/img/icon/sci.png"
                              alt="math"
                              width={100}
                              height={100}
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div className="inline-block">
                            <p className="font-semibold whitespace-nowrap">
                              วิทยาศาสตร์
                            </p>
                            <p className="text-xs text-gray-600">
                              สอบกลางภาค{" "}
                              <span className="text-gray-400">
                                (มาสเตอร์พสิษฐ์)
                              </span>
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        ม.5 เทอม 1
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <Link href={"/m5/midterm1/sci.pdf"}>
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                            ดาวน์โหลด
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3 text-sm">15/07/2025</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="px-4 py-3">
                        <Link
                          href={"/m5/midterm1/social.pdf"}
                          className="flex items-center text-sm"
                        >
                          <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                            <Image
                              className="icon-subject object-cover w-full h-auto"
                              src="/assets/img/icon/social.png"
                              alt="math"
                              width={100}
                              height={100}
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div className="inline-block">
                            <p className="font-semibold whitespace-nowrap">
                              สังคมศึกษา
                            </p>
                            <p className="text-xs text-gray-600">
                              สอบกลางภาค{" "}
                              <span className="text-gray-400">
                                (มาสเตอร์ตุ๊ต๊ะ)
                              </span>
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        ม.5 เทอม 1
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <Link href={"/m5/midterm1/social.pdf"}>
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                            ดาวน์โหลด
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3 text-sm">19/07/2025</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="px-4 py-3">
                        <Link
                          href={"/m5/midterm1/history.pdf"}
                          className="flex items-center text-sm"
                        >
                          <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                            <Image
                              className="icon-subject object-cover w-full h-auto"
                              src="/assets/img/icon/history.png"
                              alt="math"
                              width={100}
                              height={100}
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div className="inline-block">
                            <p className="font-semibold whitespace-nowrap">
                              ประวัติศาสตร์
                            </p>
                            <p className="text-xs text-gray-600">
                              สอบกลางภาค{" "}
                              <span className="text-gray-400">
                                (มาสเตอร์เขม)
                              </span>
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        ม.5 เทอม 1
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <Link href={"/m5/midterm1/history.pdf"}>
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                            ดาวน์โหลด
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3 text-sm">19/07/2025</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="px-4 py-3">
                        <Link
                          href={"/m5/midterm1/history_naresuan.pdf"}
                          className="flex items-center text-sm"
                        >
                          <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                            <Image
                              className="icon-subject object-cover w-full h-auto"
                              src="/assets/img/icon/history.png"
                              alt="math"
                              width={100}
                              height={100}
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div className="inline-block">
                            <p className="font-semibold whitespace-nowrap">
                              ประวัติศาสตร์ (นเรศวร)
                            </p>
                            <p className="text-xs text-gray-600">
                              สอบกลางภาค{" "}
                              <span className="text-gray-400">
                                (มาสเตอร์เขม)
                              </span>
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        ม.5 เทอม 1
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <Link href={"/m5/midterm1/history_naresuan.pdf"}>
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                            ดาวน์โหลด
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3 text-sm">19/07/2025</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="px-4 py-3">
                        <Link
                          href={"/m5/midterm1/biology.pdf"}
                          className="flex items-center text-sm"
                        >
                          <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                            <Image
                              className="icon-subject object-cover w-full h-auto"
                              src="/assets/img/icon/biology.png"
                              alt="math"
                              width={100}
                              height={100}
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div className="inline-block">
                            <p className="font-semibold whitespace-nowrap">
                              ชีววิทยา
                            </p>
                            <p className="text-xs text-gray-600">
                              สอบกลางภาค (by{" "}
                              <Link
                                className="text-purple-800"
                                href="https://www.instagram.com/torgor_xlt.09"
                              >
                                torgor_xlt.09
                              </Link>
                              )
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        ม.5 เทอม 1
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <Link href={"/m5/midterm1/biology.pdf"}>
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                            ดาวน์โหลด
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3 text-sm">19/07/2025</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="px-4 py-3">
                        <Link
                          href={"/m5/midterm1/math.pdf"}
                          className="flex items-center text-sm"
                        >
                          <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                            <Image
                              className="icon-subject object-cover w-full h-auto"
                              src="/assets/img/icon/math.png"
                              alt="math"
                              width={100}
                              height={100}
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div className="inline-block">
                            <p className="font-semibold whitespace-nowrap">
                              คณิตศาสตร์
                            </p>
                            <p className="text-xs text-gray-600">
                              สอบกลางภาค (by{" "}
                              <Link
                                className="text-purple-800"
                                href="https://www.instagram.com/d3w4r_zz/"
                              >
                                d3w4r_zz
                              </Link>
                              )
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        ม.5 เทอม 1
                      </td>
                      <td className="px-4 py-3 text-xs space-x-2 flex flex-row items-center">
                        <Link href={"/m5/midterm1/math.pdf"}>
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full whitespace-nowrap">
                            ดาวน์โหลด
                          </span>
                        </Link>
                        <Link
                          href={
                            "https://www.canva.com/design/DAGtkcL6n7I/AMpAJ9SZivS0R6JurYuv8w/edit?utm_content=DAGtkcL6n7I&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
                          }
                        >
                          <span className="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 hover:bg-gray-200 hover:text-gray-700 rounded-full whitespace-nowrap">
                            <LinkIcon className="inline-block w-4 h-4" /> Canva
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-3 text-sm">19/07/2025</td>
                    </tr>
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
