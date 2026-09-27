import { notFound } from "next/navigation";
import { caller, prefetch, trpc, HydrateClient } from "@/trpc/server";
import ProfileClient from "./ProfileClient";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  try {
    await caller.users.getPublicProfile({ username });
  } catch {
    notFound();
  }

  await prefetch(trpc.users.getPublicProfile.queryOptions({ username }));

  return (
    <HydrateClient>
      <ProfileClient username={username} />
    </HydrateClient>
  );
}
