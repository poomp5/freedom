import { prisma } from "@/lib/prisma";
import RequestList from "./RequestList";

export default async function AdminRequestsPage() {
  const requests = await prisma.publisherRequest.findMany({
    where: { status: "pending" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        คำขอผู้เผยแพร่
      </h1>
      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          ไม่มีคำขอที่รอดำเนินการ
        </div>
      ) : (
        <RequestList requests={JSON.parse(JSON.stringify(requests))} />
      )}
    </div>
  );
}
