import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import CountdownSettingsForm from "./CountdownSettingsForm";

export default async function AdminSettingsPage() {
  await prefetch(trpc.settings.getCountdown.queryOptions());

  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ตั้งค่าเว็บ</h1>
      <HydrateClient>
        <CountdownSettingsForm />
      </HydrateClient>
    </div>
  );
}
