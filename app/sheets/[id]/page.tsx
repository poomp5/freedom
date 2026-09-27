import { notFound } from "next/navigation";
import { caller, prefetch, trpc, HydrateClient } from "@/trpc/server";
import SheetDetailClient from "./SheetDetailClient";

export default async function SheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    await caller.sheets.getById({ id });
  } catch {
    notFound();
  }

  await prefetch(trpc.sheets.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <SheetDetailClient id={id} />
    </HydrateClient>
  );
}
