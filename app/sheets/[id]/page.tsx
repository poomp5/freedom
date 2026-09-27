import { notFound } from "next/navigation";
import { getQueryClient, trpc, HydrateClient } from "@/trpc/server";
import SheetDetailClient from "./SheetDetailClient";

export default async function SheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // One fetch both checks existence and seeds the client cache.
  try {
    await getQueryClient().fetchQuery(trpc.sheets.getById.queryOptions({ id }));
  } catch {
    notFound();
  }

  return (
    <HydrateClient>
      <SheetDetailClient id={id} />
    </HydrateClient>
  );
}
