import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
export default function Home() {
    return (
        <div>
            <Navbar />
            <Bottombar />
            <main className="mt-8 h-full overflow-y-auto">
                <div className="container px-4 lg:px-8 mx-auto">
                    <div className="flex justify-between mb-4">
                        <h1 className="my-2 text-xl text-gray-800">Choose category</h1>
                        <h1 className="my-2  text-lg text-gray-600">เลือกระดับชั้น</h1>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
                        <div className="p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-700 border border-gray-700 border-1">
                            <div className="text-center">
                                <p className="mb-2 text-2xl font-semibold text-gray-100 dark:text-gray-200">
                                    ชีทสรุป ม.2
                                </p>
                                <p className="text-lg font-normal text-gray-100 dark:text-gray-400">
                                    ชีทของปีการศึกษา 2567
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-700 border border-gray-700 border-1">
                            <div className="text-center">
                                <p className="mb-2 text-2xl font-semibold text-gray-100 dark:text-gray-200">
                                    ชีทสรุป ม.3
                                </p>
                                <p className="text-lg font-normal text-gray-100 dark:text-gray-400">
                                    ชีทของปีการศึกษา 2567
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-700 border border-gray-700 border-1">
                            <div className="text-center">
                                <p className="mb-2 text-2xl font-semibold text-gray-100 dark:text-gray-200">
                                    ชีทสรุป ม.4
                                </p>
                                <p className="text-lg font-normal text-gray-100 dark:text-gray-400">
                                    ชีทของปีการศึกษา 2567
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-700 border border-gray-700 border-1">
                            <div className="text-center">
                                <p className="mb-2 text-2xl font-semibold text-gray-100 dark:text-gray-200">
                                    ชีทสรุป ม.5
                                </p>
                                <p className="text-lg font-normal text-gray-100 dark:text-gray-400">
                                    ชีทของปีการศึกษา 2567
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
