import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Bottombar from "@/app/components/Bottombar";
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
                    <h1 className="mx-auto mb-2 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-4xl text-gray-700">สอบปลายภาค 2/{year}</h1>
                    <p className="mx-auto mb-4 text-xl text-gray-500">ชีทสรุป (ม.4) ที่จัดทำในปีการศึกษา 2566</p>
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
                                            <Link href={'/m4/final2/math.pdf'} className="flex items-center text-sm">
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
                                                        สอบปลายภาค (by <Link className="text-purple-800" href="https://www.instagram.com/d3w4r_zz/">d3w4r_zz</Link>)
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            ม.4 เทอม 2
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m4/final2/math.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            22/02/2025
                                        </td>
                                    </tr>
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m4/final2/math_extra.pdf'} className="flex items-center text-sm">
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
                                                        คณิตศาสตร์ (เพิ่มเติม)
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        สอบปลายภาค (by <Link className="text-purple-800" href="https://www.instagram.com/torgor_xlt.09">torgor_xlt.09</Link>)
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            ม.4 เทอม 2
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m4/final2/math_extra.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            23/02/2025
                                        </td>
                                    </tr>
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m4/final2/social.pdf'} className="flex items-center text-sm">
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
                                                        สอบปลายภาค (by มิสเกม)
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            ม.4 เทอม 2
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m4/final2/social.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            22/02/2025
                                        </td>
                                    </tr>
                                    <tr className="text-gray-700">
                                        <td className="px-4 py-3">
                                            <Link href={'/m4/final2/physics2.pdf'} className="flex items-center text-sm">
                                                <div className="inline-block relative w-8 h-8 mr-3 rounded-full">
                                                    <Image
                                                        className="icon-subject object-cover w-full h-auto"
                                                        src="/assets/img/icon/physics.png"
                                                        alt="math"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                                </div>
                                                <div className="inline-block">
                                                    <p className="font-semibold whitespace-nowrap">
                                                        ฟิสิกส์ <small className="text-red-600">(มีการแก้ไข)</small>
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        สอบปลายภาค (by <Link className="text-purple-800" href="https://www.instagram.com/torgor_xlt.09">torgor_xlt.09</Link>)
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            ม.4 เทอม 2
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <Link href={'/m4/final2/physics2.pdf'}>
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            22/02/2025
                                        </td>
                                    </tr>
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
