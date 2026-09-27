"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

export default function EarningsPage() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.payments.myTransactions.queryOptions());

  const { transactions, summary } = data;

  return (
    <div className="p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">รายได้</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">รายได้ทั้งหมด</p>
              <p className="text-lg font-bold text-gray-800">
                {summary.totalEarnings.toLocaleString()} บาท
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">ธุรกรรมสำเร็จ</p>
              <p className="text-lg font-bold text-gray-800">
                {summary.totalTransactions} รายการ
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">รอดำเนินการ</p>
              <p className="text-lg font-bold text-gray-800">
                {summary.pendingTransactions} รายการ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">ประวัติธุรกรรม</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            ยังไม่มีธุรกรรม
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="px-4 py-2.5 font-medium">ชีท</th>
                  <th className="px-4 py-2.5 font-medium">ผู้ซื้อ</th>
                  <th className="px-4 py-2.5 font-medium">จำนวนเงิน</th>
                  <th className="px-4 py-2.5 font-medium hidden sm:table-cell">คอมมิชชัน</th>
                  <th className="px-4 py-2.5 font-medium">ได้รับ</th>
                  <th className="px-4 py-2.5 font-medium">สถานะ</th>
                  <th className="px-4 py-2.5 font-medium hidden sm:table-cell">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-700 max-w-[150px] truncate">
                      {txn.sheet.title}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      <div className="flex items-center gap-2">
                        {txn.buyer.image && (
                          <img
                            src={txn.buyer.image}
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span className="truncate max-w-[100px]">{txn.buyer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{txn.amount} บาท</td>
                    <td className="px-4 py-2.5 text-gray-400 hidden sm:table-cell">
                      -{txn.commission} บาท
                    </td>
                    <td className="px-4 py-2.5 font-medium text-green-600">
                      {txn.publisherAmount} บาท
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 hidden sm:table-cell">
                      {new Date(txn.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    verified: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-700",
    failed: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = {
    verified: "สำเร็จ",
    pending: "รอตรวจสอบ",
    rejected: "ปฏิเสธ",
    failed: "ล้มเหลว",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.failed}`}>
      {labels[status] || status}
    </span>
  );
}
