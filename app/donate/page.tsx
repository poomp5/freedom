import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { donors } from "../config/donate";

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    glow: "from-purple-400 to-purple-500",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    glow: "from-blue-400 to-cyan-400",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    border: "border-pink-200",
    glow: "from-pink-400 to-rose-400",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-200",
    glow: "from-green-400 to-emerald-400",
  },
};

export default function DonateHome() {
  return (
    <div>
      <Navbar />
      <Bottombar />

      <main className="min-h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative py-12 px-4 mx-auto max-w-screen-xl lg:py-16">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="mb-2 h-20 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                สนับสนุนพวกเรา
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                เลือกคนที่คุณอยากสนับสนุน ทุกการโดเนทมีค่าสำหรับทีมของเรา
              </p>
            </div>

            {/* Donor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.values(donors).map((donor) => {
                const colors = colorMap[donor.color] || colorMap.blue;
                return (
                  <Link
                    key={donor.username}
                    href={`/donate/${donor.username}`}
                    className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    ></div>

                    <div className="relative flex flex-col items-center">
                      {/* Avatar with glow */}
                      <div className="relative mb-4">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${colors.glow} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}
                        ></div>
                        <div className={`relative rounded-full p-1 ${colors.border} border-2`}>
                          <Image
                            src={donor.avatar}
                            alt={donor.name}
                            width={100}
                            height={100}
                            className="rounded-full w-24 h-24 object-cover"
                          />
                        </div>
                      </div>

                      {/* Name */}
                      <h2 className="text-xl font-bold text-gray-800 mb-1">{donor.name}</h2>

                      {/* Account name */}
                      <p className="text-sm text-gray-500 mb-3">{donor.accountName}</p>

                      {/* Role badge */}
                      <span
                        className={`${colors.bg} ${colors.text} px-4 py-1.5 rounded-full text-sm font-medium`}
                      >
                        {donor.role}
                      </span>

                      {/* Bank info hint */}
                      <div className="mt-4 flex items-center text-gray-400 text-sm">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        {donor.bank}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Call to action card */}
            <div className="max-w-md mx-auto">
              <Link
                href="https://www.instagram.com/poonyapat_poom/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative flex items-center justify-center gap-4">
                  <div className="bg-white/20 rounded-full p-1">
                    <Image
                      src="/assets/img/freedom-logo-pink.png"
                      alt="Donate logo freedom"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain rounded-full"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">อยากมีชื่ออยู่ตรงนี้?</h3>
                    <p className="text-white/80 text-sm">ติดต่อเราได้เลย!</p>
                  </div>
                  <svg
                    className="w-6 h-6 text-white ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom spacing for mobile navbar */}
        <div className="h-24 md:h-8"></div>
      </main>
    </div>
  );
}
