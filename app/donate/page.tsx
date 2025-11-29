import Bottombar from "../components/Bottombar";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { donors } from "../config/donate";

export default function DonateHome() {
  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="mt-8 h-full overflow-y-auto mb-24">
        <div className="container px-4 lg:px-8 mx-auto text-center">
          <h1 className="mb-8 font-extrabold tracking-tight leading-none text-3xl md:text-4xl lg:text-5xl text-gray-600">
            สนับสนุนพวกเรา
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.values(donors).map((donor) => (
              <Link
                key={donor.username}
                href={`/donate/${donor.username}`}
                className="border rounded-3xl p-6 bg-white shadow-md hover:shadow-lg transition flex flex-col items-center hover:-translate-y-2"
              >
                <Image
                  src={donor.avatar}
                  alt={donor.name}
                  width={100}
                  height={100}
                  className="rounded-full w-24 h-24 mb-4 object-cover"
                />
                <h2 className="text-xl font-semibold text-gray-700">
                  {donor.name}
                </h2>
                <p className="text-base text-gray-500">{donor.accountName}</p>
                <p
                  className={`text-base mt-2 bg-${donor.color}-100 text-${donor.color}-600 px-4 py-1 rounded-full`}
                >
                  {donor.role}
                </p>
              </Link>
            ))}
            <Link
              key="supportus"
              href={"https://www.instagram.com/poonyapat_poom/"}
              className="border rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition flex flex-col items-center hover:-translate-y-2"
            >
              <Image
                src="/assets/img/donatelogo.png"
                alt="Donate logo freedom"
                width={100}
                height={100}
                className="rounded-full w-24 h-24 mb-4 object-cover p-2 border-2 border-solid border-gray-300"
              />
              <h2 className="text-xl font-semibold text-blue-700">
                อยากมีชื่ออยู่ตรงนี้!?
              </h2>
              <p
                className="text-base mt-3 bg-blue-800 text-white px-4 py-1 rounded-full"
              >
                ติดต่อเลย
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
