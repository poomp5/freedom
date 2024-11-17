import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
export default function Home() {
    return (
        <div>
            <Navbar />
            <Bottombar />
            <main className="mt-8 h-full overflow-y-auto">
                <div className="container px-4 lg:px-8 mx-auto">
                    <h1>ยันต์ฟรีด้อม</h1>
                </div>
            </main>
        </div>
    );
}
