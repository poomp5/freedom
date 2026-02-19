import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserTable from "./UserTable";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">จัดการผู้ใช้</h1>
      <UserTable
        users={JSON.parse(JSON.stringify(users))}
        currentUserId={session!.user.id}
      />
    </div>
  );
}
