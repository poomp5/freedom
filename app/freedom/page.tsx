"use client";

import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Home() {
  const imageUrl = "/assets/img/freedomgrade4.png";

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ยันต์ฟรีด้อม.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleShare = async () => {
    try {
      // ลองแชร์รูปถ้ารองรับ
      if (navigator.share && navigator.canShare) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "ยันต์ฟรีด้อม.png", { type: "image/png" });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fallback: แชร์ลิงก์
      if (navigator.share) {
        await navigator.share({
          title: "ยันต์ฟรีด้อม",
          text: "ยันต์ฟรีด้อม ขอให้สอบผ่านทุกวิชา!",
          url: window.location.href,
        });
      } else {
        // Copy link ถ้าไม่รองรับ share
        await navigator.clipboard.writeText(window.location.href);
        alert("คัดลอกลิงก์แล้ว!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="min-h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative py-12 px-4 mx-auto max-w-screen-xl lg:py-16">
            <div className="text-center mb-8">
              <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                ยันต์ฟรีด้อม
              </h1>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                บูชาแล้วสอบผ่านทุกวิชา ลงสตอรี่เพิ่มความขลัง
              </p>
            </div>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative rounded-2xl shadow-xl">
                  <Image
                    className="w-full h-auto rounded-xl"
                    src={imageUrl}
                    width={1000}
                    height={1000}
                    alt="ยันต์ฟรีด้อม"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-24">
              <button
                onClick={handleDownload}
                className="group inline-flex justify-center items-center py-3 px-6 text-base lg:py-4 lg:px-8 lg:text-lg font-semibold text-center text-white rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                ดาวน์โหลดรูป
              </button>
              <button
                onClick={handleShare}
                className="group inline-flex justify-center items-center py-3 px-6 text-base lg:py-4 lg:px-8 lg:text-lg font-semibold text-center text-gray-700 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                แชร์
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
