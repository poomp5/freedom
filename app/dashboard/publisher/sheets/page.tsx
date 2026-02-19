import { prefetch, trpc, HydrateClient } from "@/trpc/server";
import PublisherSheetsClient from "./PublisherSheetsClient";

export default async function PublisherSheetsPage() {
  await prefetch(trpc.sheets.mySheets.queryOptions());

  return (
    <HydrateClient>
      <PublisherSheetsClient />
    </HydrateClient>
  );
}
