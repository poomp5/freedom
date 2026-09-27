"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Loader2, CheckCircle, Building2 } from "lucide-react";

const BANK_PROVIDERS = [
  { value: "KBANK", label: "ธนาคารกสิกรไทย" },
  { value: "SCB", label: "ธนาคารไทยพาณิชย์" },
  { value: "BBL", label: "ธนาคารกรุงเทพ" },
  { value: "KTB", label: "ธนาคารกรุงไทย" },
  { value: "TTB", label: "ธนาคารทีเอ็มบีธนชาต" },
  { value: "BAY", label: "ธนาคารกรุงศรีอยุธยา" },
  { value: "CIMBT", label: "ธนาคาร CIMB ไทย" },
  { value: "TISCO", label: "ธนาคารทิสโก้" },
  { value: "KKP", label: "ธนาคารเกียรตินาคินภัทร" },
  { value: "LHBANK", label: "ธนาคารแลนด์ แอนด์ เฮ้าส์" },
  { value: "ICBC", label: "ธนาคาร ICBC (ไทย)" },
  { value: "UOB", label: "ธนาคารยูโอบี" },
  { value: "GSB", label: "ธนาคารออมสิน" },
  { value: "BAAC", label: "ธ.ก.ส." },
  { value: "GHB", label: "ธนาคารอาคารสงเคราะห์" },
];

export default function PublisherSettingsPage() {
  const trpc = useTRPC();
  const { data: bankAccount, isLoading } = useQuery(trpc.users.getBankAccount.queryOptions());
  const setBankMutation = useMutation(trpc.users.setBankAccount.mutationOptions());

  const [paymentMethod, setPaymentMethod] = useState<"bank" | "promptpay">("bank");
  const [bankProvider, setBankProvider] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [promptPayNumber, setPromptPayNumber] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (bankAccount) {
      setPaymentMethod((bankAccount.paymentMethod as "bank" | "promptpay") || "bank");
      setBankProvider(bankAccount.bankProvider || "");
      setBankAccountNumber(bankAccount.bankAccountNumber || "");
      setBankAccountName(bankAccount.bankAccountName || "");
      setPromptPayNumber(bankAccount.promptPayNumber || "");
    }
  }, [bankAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    await setBankMutation.mutateAsync({
      paymentMethod,
      bankProvider: paymentMethod === "bank" ? bankProvider : undefined,
      bankAccountNumber: paymentMethod === "bank" ? bankAccountNumber : undefined,
      bankAccountName: paymentMethod === "bank" ? bankAccountName : undefined,
      promptPayNumber: paymentMethod === "promptpay" ? promptPayNumber : undefined,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 w-full">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">ตั้งค่าบัญชีรับเงิน</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              วิธีรับเงิน
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("bank")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  paymentMethod === "bank"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                บัญชีธนาคาร
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("promptpay")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  paymentMethod === "promptpay"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                พร้อมเพย์
              </button>
            </div>
          </div>

          {paymentMethod === "bank" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ธนาคาร <span className="text-red-500">*</span>
                </label>
                <select
                  value={bankProvider}
                  onChange={(e) => setBankProvider(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">เลือกธนาคาร</option>
                  {BANK_PROVIDERS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เลขบัญชี <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="เลขที่บัญชีธนาคาร"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อบัญชี <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ชื่อเจ้าของบัญชี"
                />
              </div>
            </>
          )}

          {paymentMethod === "promptpay" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                หมายเลขพร้อมเพย์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={promptPayNumber}
                onChange={(e) => setPromptPayNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="เบอร์โทรศัพท์หรือเลขบัตรประชาชน"
              />
            </div>
          )}

          {setBankMutation.error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {setBankMutation.error.message}
            </p>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4" />
              บันทึกเรียบร้อย
            </div>
          )}

          <button
            type="submit"
            disabled={setBankMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            {setBankMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกข้อมูล"
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
