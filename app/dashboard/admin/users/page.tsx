import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prefetch, trpc, HydrateClient } from "@/trpc/server";
import UserTable from "./UserTable";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  await prefetch(trpc.users.list.queryOptions());

  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">จัดการผู้ใช้</h1>
      <HydrateClient>
        <UserTable currentUserId={session!.user.id} />
      </HydrateClient>
    </div>
  );
}
