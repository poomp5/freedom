import { HydrateClient, prefetchPublicSheetList } from "@/trpc/server";
import SheetsClient from "./SheetsClient";

export const metadata = {
  title: "ชีทสรุป | FREEDOM",
};

// The catalog is the same for everyone, so the page is prerendered and
// refreshed in the background; uploads/edits also revalidate the data cache.
export const revalidate = 300;

export default async function SheetsPage() {
  await prefetchPublicSheetList();

  return (
    <HydrateClient>
      <SheetsClient />
    </HydrateClient>
  );
}
