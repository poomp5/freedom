import Link from "next/link";
import Image from "next/image";
import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import PaginationFooter from "@/app/components/PaginationFooter";
import { year } from "@/app/components/var";
export default function Home() {
    return (
        <div>
            <Navbar />
            <Bottombar />
            <link rel="shortcut icon" href="../public/assets/img/poomicon.png" />
            <main className="mt-8 h-full overflow-y-auto">
                <div className="container px-4 lg:px-8 mx-auto grid md:mb-[4vh] mb-[12vh]">
                    <h1 className="mx-auto mb-2 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-4xl text-gray-700">สอบกลางภาค 1/{year}</h1>
                    
                    <p className="mx-auto mb-4 text-xl text-gray-500">ชีทสรุป (ม.3) ที่จัดทำในปีการศึกษา 2566</p>
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
                                            <Link href={'/m3/midterm1/math.pdf'} className="flex items-center text-sm">
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
                                            ม.3 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m3/midterm1/math.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            29/11/2024
                                        </td>
                                    </tr>
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m3/midterm1/sci.pdf'} className="flex items-center text-sm">
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
                                            ม.3 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m3/midterm1/sci.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            29/11/2024
                                        </td>
                                    </tr>
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m3/midterm1/thai.pdf'} className="flex items-center text-sm">
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
                                            ม.3 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m3/midterm1/thai.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            29/11/2024
                                        </td>
                                    </tr>
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m3/midterm1/social.pdf'} className="flex items-center text-sm">
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
                                            ม.3 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m3/midterm1/social.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            29/11/2024
                                        </td>
                                    </tr>
                                    {/* <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m3/midterm1/history.pdf'} className="flex items-center text-sm">
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
                                            ม.3 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m3/midterm1/history.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            29/11/2024
                                        </td>
                                    </tr> */}
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m3/midterm1/eng.pdf'} className="flex items-center text-sm">
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
                                            ม.3 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m3/midterm1/eng.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            29/11/2024
                                        </td>
                                    </tr>
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m3/midterm1/iep.pdf'} className="flex items-center text-sm">
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
                                                        ภาษาอังกฤษเพิ่มเติม
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        สอบกลางภาค
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            ม.3 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m3/midterm1/iep.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            29/11/2024
                                        </td>
                                    </tr>
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
