import Link from "next/link";
import Image from "next/image";
import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
export default function Home() {
    return (
        <div>
            <Navbar />
            <Bottombar />
            <link rel="shortcut icon" href="../public/assets/img/poomicon.png" />
            <main className="mt-8 h-full overflow-y-auto">
                <div className="container px-4 lg:px-8 mx-auto grid">
                    <h1 className="mx-auto mb-2 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-4xl text-gray-700">สอบกลางภาค 1/2567</h1>
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
                        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t bg-gray-50 sm:grid-cols-9">
                            <span className="flex items-center col-span-3">
                                กำลังแสดง หน้า 1 จาก 2
                            </span>
                            <span className="col-span-2"></span>
                            <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                                <nav aria-label="Table navigation">
                                    <ul className="inline-flex items-center">
                                        <li>
                                            <Link href="/m3/midterm1">
                                                <div className="relative group flex items-center justify-center">
                                                    <button data-tooltip-target="term1" type="button" className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-red" aria-label="Previous">
                                                        <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                                                        </svg>
                                                    </button>
                                                    <div className="text-nowrap absolute bottom-full mb-2 hidden group-hover:flex px-3 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                                                        เทอม 1
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/m3/midterm1">
                                                <button className="px-3 mx-1 py-1 text-white transition-colors duration-150 bg-red-600 border border-r-0 border-red-600 rounded-md focus:outline-none focus:shadow-outline-red">
                                                    กลางภาค
                                                </button>
                                            </Link>
                                            <Link href="/m3/final1">
                                                <button className="px-3 py-1 text-gray-800 transition-colors duration-150 rounded-md focus:outline-none focus:shadow-outline-red">
                                                    ปลายภาค
                                                </button>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/m3">
                                                <div className="relative group flex items-center justify-center">
                                                    <button className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-red" aria-label="Next">
                                                        <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                                                            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                                                        </svg>
                                                    </button>
                                                    <div className="text-nowrap absolute bottom-full mb-2 hidden group-hover:flex px-3 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                                                        เทอม 2
                                                    </div>
                                                </div>
                                            </Link>
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
