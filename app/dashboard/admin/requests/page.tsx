import { prefetch, trpc, HydrateClient } from "@/trpc/server";
import RequestList from "./RequestList";

export default async function AdminRequestsPage() {
  await prefetch(trpc.publisherRequests.listPending.queryOptions());

  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        คำขอผู้เผยแพร่
      </h1>
      <HydrateClient>
        <RequestList />
      </HydrateClient>
    </div>
  );
}
