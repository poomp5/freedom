import { notFound, redirect } from "next/navigation";
import Bottombar from "@/app/components/Bottombar";
import Navbar from "@/app/components/Navbar";
import { findDonor } from "@/lib/donors";
import DonateClient from "./DonateClient";

// Always read the current PromptPay number — it must never be stale.
export const dynamic = "force-dynamic";

export default async function DonatePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await findDonor(decodeURIComponent(username));

  if (!result) notFound();
  if ("redirectTo" in result) redirect(result.redirectTo);

  return (
    <div>
      <Navbar />
      <Bottombar />
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 px-4 py-10 pb-24 md:pb-12">
        <DonateClient donor={result.donor} />
      </main>
    </div>
  );
}
