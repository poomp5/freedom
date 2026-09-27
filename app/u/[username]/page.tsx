import { notFound } from "next/navigation";
import { getQueryClient, trpc, HydrateClient } from "@/trpc/server";
import ProfileClient from "./ProfileClient";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // One fetch both checks existence and seeds the client cache.
  try {
    await getQueryClient().fetchQuery(trpc.users.getPublicProfile.queryOptions({ username }));
  } catch {
    notFound();
  }

  return (
    <HydrateClient>
      <ProfileClient username={username} />
    </HydrateClient>
  );
}
