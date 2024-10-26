export default function Bottombar() {
    return( 
    <div
        className="block md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
            <button type="button"
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
                <svg className="w-5 h-5 mb-2 text-gray-500 group-hover:text-red-600"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                <span
                    className="text-sm text-gray-500 group-hover:text-red-600 whitespace-nowrap">หน้าหลัก</span>
            </button>
            <button type="button"
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
                <svg className="w-5 h-5 mb-2 text-gray-500 group-hover:text-red-600"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                        clip-rule="evenodd" />
                </svg>
                <span
                    className="text-sm text-gray-500 group-hover:text-red-600">ติดต่อ</span>
            </button>
            <button type="button"
                className="inline-flex flex-col items-center justify-center px-5 bg-red-700 hover:bg-red-800 rounded-lg group">
                <svg className="w-5 h-5 mb-2 text-white"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
                        clip-rule="evenodd" />
                </svg>
                <span
                    className="text-sm text-white whitespace-nowrap">ชีทสรุป</span>
            </button>
            <button type="button"
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
                <svg className="w-5 h-5 mb-2 text-gray-500 group-hover:text-red-600"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M4 4c0-.975.718-2 1.875-2h12.25C19.282 2 20 3.025 20 4v16c0 .975-.718 2-1.875 2H5.875C4.718 22 4 20.975 4 20V4Zm7 13a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Z"
                        clip-rule="evenodd" />
                </svg>
                <span
                    className="text-sm text-gray-500 group-hover:text-red-600">ยันต์</span>
            </button>
            <button type="button"
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
                <svg className="w-6 h-6 mb-2 text-gray-500 group-hover:text-red-600"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z"
                        clip-rule="evenodd" />
                    <path fill-rule="evenodd"
                        d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z"
                        clip-rule="evenodd" />
                </svg>
                <span
                    className="text-sm text-gray-500 group-hover:text-red-600">โดเนท</span>
            </button>
        </div>
    </div>
    );
}