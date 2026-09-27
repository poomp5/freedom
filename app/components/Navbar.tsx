"use client"
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import SearchModal from "./SearchModal";
import UserMenu from "./UserMenu";

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <nav className="bg-white border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image src="/assets/img/logo-freedom.png" className="h-12 w-full" width={500} height={500} alt="Freedom Logo" />
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
                        {/* User Menu */}
                        <UserMenu />
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
                            <li>
                                <Link href="/sheets"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">ชีทสรุป</Link>
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
