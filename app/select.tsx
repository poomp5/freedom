import React from "react";
import Navbar from "./components/Navbar";
import Bottombar from "./components/Bottombar";
export default function Home() {
    return (
        <div>
            <Navbar />
            <Bottombar />
            <main className="mt-8 h-full overflow-y-auto">
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
                                            <div className="flex items-center text-sm">
                                                <a href="./pdf/m4/final1/math_2.pdf">
                                                    <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                                                        <img
                                                            className="icon-subject object-cover w-full h-full"
                                                            src="/assets/img/icon/math.png"
                                                            alt="math"
                                                        />
                                                        <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold whitespace-nowrap">
                                                            คณิตศาสตร์ <small className="text-red-600">(พื้นฐาน)</small>
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            สอบปลายภาค (by : <a className="text-purple-800" href="https://www.instagram.com/d3w4r_zz/">d3w4r_zz</a>)
                                                        </p>
                                                    </div>
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            ม.4 เทอม 1
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <a href="./pdf/m4/final1/math_2.pdf">
                                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                    ดาวน์โหลด
                                                </span>
                                            </a>
                                        </td>
                                        <td className="px-2 py-3 text-sm">
                                            24/9/2024
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
