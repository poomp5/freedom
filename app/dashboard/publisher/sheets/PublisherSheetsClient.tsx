"use client";

import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import UploadSheet from "./UploadSheet";
import MySheets from "./MySheets";

export default function PublisherSheetsClient() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: sheets } = useSuspenseQuery(trpc.sheets.mySheets.queryOptions());

  const handleUploaded = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.sheets.mySheets.queryKey(),
    });
  };

  return (
    <div className="p-6 lg:p-8 w-full space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">อัปโหลดชีท</h1>
      <UploadSheet onUploaded={handleUploaded} />
      <h2 className="text-xl font-bold text-gray-800">ชีทของฉัน</h2>
      <MySheets initialSheets={sheets} />
    </div>
  );
}
