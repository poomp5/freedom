import { prefetch, trpc, HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SheetsClient from "./SheetsClient";
import { SHEETS_LIST_STALE_TIME } from "./queryOptions";

export default async function SheetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  await prefetch(
    trpc.sheets.list.queryOptions(
      {},
      { staleTime: SHEETS_LIST_STALE_TIME, refetchOnWindowFocus: false }
    )
  );

  const userId = session?.user?.id ?? null;

  return (
    <HydrateClient>
      <SheetsClient isLoggedIn={!!session} userId={userId} />
    </HydrateClient>
  );
}
