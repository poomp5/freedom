"use client"
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { basePath } from "./config";
import SearchModal from "./SearchModal";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <nav className="bg-white border-gray-200 relative z-50">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image src="/assets/img/freedom.svg" className="h-12 w-full" width={0} height={0} alt="Freedom Logo" />
                    </Link>
                    <div className="flex items-center md:order-2 space-x-2">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="ค้นหา"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                    <div className="hidden w-full md:block md:w-auto md:order-1" id="navbar-dropdown">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
                            <li>
                                <Link href="/"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                                    aria-current="page">หน้าหลัก</Link>
                            </li>
                            <li>
                                <Link href="https://www.instagram.com/act.freedom"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">ติดต่อ</Link>
                            </li>
                            <li className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto"
                                    aria-expanded={isDropdownOpen}
                                >
                                    ชีทสรุป
                                    <svg
                                        className={`w-2.5 h-2.5 ms-2.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>
                                <div
                                    className={`absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ${isDropdownOpen ? 'block' : 'hidden'
                                        }`}
                                >
                                    <ul className="py-2 text-sm text-gray-700">
                                        <li>
                                            <Link href={`/m1/${basePath}`} className="block px-4 py-2 hover:bg-gray-100">ม.1</Link>
                                        </li>
                                        <li>
                                            <Link href={`/m2/${basePath}`} className="block px-4 py-2 hover:bg-gray-100">ม.2</Link>
                                        </li>
                                        <li>
                                            <Link href={`/m3/${basePath}`} className="block px-4 py-2 hover:bg-gray-100">ม.3</Link>
                                        </li>
                                        <li>
                                            <Link href={`/m4/${basePath}`} className="block px-4 py-2 hover:bg-gray-100">ม.4</Link>
                                        </li>
                                        <li>
                                            <Link href={`/m5/${basePath}`} className="block px-4 py-2 hover:bg-gray-100">ม.5</Link>
                                        </li>
                                        <li>
                                            <Link href={`/m6/${basePath}`} className="block px-4 py-2 hover:bg-gray-100">ม.6</Link>
                                        </li>
                                    </ul>
                                    <div className="py-1">
                                        <Link href="/select" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ทั้งหมด</Link>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <Link href="/freedom"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">ยันต์</Link>
                            </li>
                            <li>
                                <Link href="/donate"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">โดเนท</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
