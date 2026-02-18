"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

interface PublisherRequest {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  tel: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export default function RequestList({
  requests: initialRequests,
}: {
  requests: PublisherRequest[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setLoading(id);
    try {
      const res = await fetch(`/api/dashboard/requests/${id}/${action}`, {
        method: "POST",
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setLoading(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        ไม่มีคำขอที่รอดำเนินการ
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">
                {req.firstName} {req.lastName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{req.user.email}</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">วันเกิด:</span>{" "}
                  <span className="text-gray-700">
                    {new Date(req.dateOfBirth).toLocaleDateString("th-TH")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">เบอร์โทร:</span>{" "}
                  <span className="text-gray-700">{req.tel}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                ส่งเมื่อ{" "}
                {new Date(req.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAction(req.id, "approve")}
                disabled={loading === req.id}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Check size={16} />
                อนุมัติ
              </button>
              <button
                onClick={() => handleAction(req.id, "reject")}
                disabled={loading === req.id}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <X size={16} />
                ปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
