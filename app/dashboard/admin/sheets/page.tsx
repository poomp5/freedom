import { prefetch, trpc, HydrateClient } from "@/trpc/server";
import AdminSheetsTable from "./AdminSheetsTable";

export default async function AdminSheetsPage() {
  await prefetch(trpc.sheets.allSheets.queryOptions());

  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">จัดการชีท</h1>
      <HydrateClient>
        <AdminSheetsTable />
      </HydrateClient>
    </div>
  );
}
