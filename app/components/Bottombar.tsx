import Link from "next/link";

export default function Bottombar() {
    return (
        <div className="mt-6 block md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
            <div className="relative grid h-full grid-cols-5 mx-auto">
                <Link href="/" className="w-full">
                    <button type="button"
                        className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1">
                        <svg className="w-6 h-6 mb-1 text-gray-500 group-hover:text-red-600"
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                        </svg>
                        <span className="text-xs text-gray-500 group-hover:text-red-600">หน้าหลัก</span>
                    </button>
                </Link>
                <Link href="https://www.instagram.com/act.freedom" className="w-full">
                    <button type="button"
                        className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1">
                        <svg className="w-6 h-6 mb-1 text-gray-500 group-hover:text-red-600"
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                                clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-500 group-hover:text-red-600">ติดต่อ</span>
                    </button>
                </Link>
                <Link href="/select" className="w-full">
                    <button type="button"
                        className="absolute left-1/2 -translate-x-1/2 -translate-y-3 w-16 h-16 inline-flex flex-col items-center justify-center bg-red-600 hover:bg-red-800 group rounded-full shadow-lg">
                        <svg className="h-full w-full p-3 mb-1 text-white hover:text-white"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6l0 13" /><path d="M12 6l0 13" /><path d="M21 6l0 13" /></svg>
                    </button>
                </Link>
                <Link href="/freedom" className="w-full">
                    <button type="button"
                        className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1">
                        <svg className="w-6 h-6 mb-1 text-gray-500 group-hover:text-red-600"
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                d="M4 4c0-.975.718-2 1.875-2h12.25C19.282 2 20 3.025 20 4v16c0 .975-.718 2-1.875 2H5.875C4.718 22 4 20.975 4 20V4Zm7 13a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Z"
                                clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-500 group-hover:text-red-600">ยันต์</span>
                    </button>
                </Link>
                <Link href="donate" className="w-full">
                    <button type="button"
                        className="w-full h-full inline-flex flex-col items-center justify-center hover:bg-gray-50 group px-1">
                        <svg className="w-6 h-6 mb-1 text-gray-500 group-hover:text-red-600"
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z"
                                clipRule="evenodd" />
                            <path fillRule="evenodd"
                                d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z"
                                clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-500 group-hover:text-red-600">โดเนท</span>
                    </button>
                </Link>
            </div>
        </div>
    );
}