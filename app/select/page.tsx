import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Link from "next/link";
export default function Home() {
    return (
        <div>
            <Navbar />
            <Bottombar />
            <main className="mt-8 h-screen overflow-y-auto">
                <div className="container px-4 lg:px-8 mx-auto">
                    <div className="flex justify-between mb-4">
                        <h1 className="my-2 text-xl text-gray-800">Choose category</h1>
                        <h1 className="my-2  text-lg text-gray-600">เลือกระดับชั้น</h1>
                    </div>
                    <div className="grid lg:grid-cols-5 md:grid-cols-1 grid-cols-1 gap-2">
                        <Link href="/m1/midterm1">
                            <div className="p-4 bg-gray-700 rounded-lg shadow-xs border border-gray-600 border-1">
                                <div className="text-center">
                                    <p className="mb-2 text-2xl font-semibold text-white">
                                        ชีทสรุป ม.1
                                    </p>
                                    <p className="text-lg font-normal text-gray-200">
                                        ชีทของปีการศึกษา 2565
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/m2/midterm1">
                            <div className="p-4 bg-gray-700 rounded-lg shadow-xs border border-gray-600 border-1">
                                <div className="text-center">
                                    <p className="mb-2 text-2xl font-semibold text-white">
                                        ชีทสรุป ม.2
                                    </p>
                                    <p className="text-lg font-normal text-gray-200">
                                        ชีทของปีการศึกษา 2567
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/m3/midterm1">
                            <div className="p-4 bg-gray-700 rounded-lg shadow-xs border border-gray-600 border-1">
                                <div className="text-center">
                                    <p className="mb-2 text-2xl font-semibold text-white">
                                        ชีทสรุป ม.3
                                    </p>
                                    <p className="text-lg font-normal text-white">
                                        ชีทของปีการศึกษา 2567
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/m4/midterm1">
                            <div className="p-4 bg-gray-700 rounded-lg shadow-xs border border-gray-600 border-1">
                                <div className="text-center">
                                    <p className="mb-2 text-2xl font-semibold text-white">
                                        ชีทสรุป ม.4
                                    </p>
                                    <p className="text-lg font-normal text-white">
                                        ชีทของปีการศึกษา 2567
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/m5/midterm1">
                            <div className="p-4 bg-gray-700 rounded-lg shadow-xs border border-gray-600 border-1">
                                <div className="text-center">
                                    <p className="mb-2 text-2xl font-semibold text-white">
                                        ชีทสรุป ม.5
                                    </p>
                                    <p className="text-lg font-normal text-white">
                                        ชีทของปีการศึกษา 2568
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
