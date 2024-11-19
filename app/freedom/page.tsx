import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Image from "next/image";
export default function Home() {
    return (
        <div>
            <Navbar />
            <Bottombar />
            <main className="mt-8 h-full overflow-y-auto">
                <div className="container px-4 lg:px-8 mx-auto text-center">
                    <h1 className="mb-4 font-extrabold tracking-tight leading-none text-3xl md:text-4xl lg:text-5xl text-gray-600">ยันต์ฟรีด้อม</h1>
                    <Image className="w-[30em] h-auto rounded-xl mx-auto" src="/assets/img/freedomgrade4.png" width={1000} height={1000} alt="ยันต์ฟรีด้อม"/>
                </div>
            </main>
        </div>
    );
}
