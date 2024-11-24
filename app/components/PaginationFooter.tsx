import Link from "next/link";

interface NavigationLink {
    label: string;
    href: string;
    isActive: boolean;
}

interface PaginationFooterProps {
    leftArrow: { label: string; href: string };
    rightArrow: { label: string; href: string };
    links: NavigationLink[];
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
    leftArrow,
    rightArrow,
    links,
}) => {
    return (
        <div className="grid px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t bg-gray-50 sm:grid-cols-9">
            <span className="flex text-nowrap items-center col-span-6 mx-auto md:mx-0 md:col-span-2">
                ชีทสรุปอาจมีข้อผิดพลาดเพราะเป็นการสรุปโดยนักเรียน
            </span>
            <span className="col-span-3"></span>
            <span className="flex mt-2 col-span-12 justify-center md:col-span-4 md:mt-auto md:justify-end">
                <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                        <li>
                            <Link href={leftArrow.href}>
                                <div className="relative group flex items-center justify-center">
                                    <button
                                        type="button"
                                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-red"
                                        aria-label="Previous"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            className="w-4 h-4 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div className="text-nowrap absolute bottom-full mb-2 hidden group-hover:flex px-3 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                                        {leftArrow.label}
                                    </div>
                                </div>
                            </Link>
                        </li>

                        {links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>
                                    <button
                                        className={`px-3 mx-1 py-1 transition-colors duration-150 rounded-md focus:outline-none focus:shadow-outline-red ${link.isActive
                                                ? "bg-red-600 text-white border border-r-0 border-red-600"
                                                : "text-gray-800"
                                            }`}
                                    >
                                        {link.label}
                                    </button>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href={rightArrow.href}>
                                <div className="relative group flex items-center justify-center">
                                    <button
                                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-red"
                                        aria-label="Next"
                                    >
                                        <svg
                                            className="w-4 h-4 fill-current"
                                            aria-hidden="true"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div className="text-nowrap absolute bottom-full mb-2 hidden group-hover:flex px-3 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                                        {rightArrow.label}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </span>
        </div>
    );
};

export default PaginationFooter;
