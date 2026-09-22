"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Loader2, Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import Avatar from "@/app/components/Avatar";

const MAX = 1000;

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "เมื่อสักครู่";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ชม.ที่แล้ว`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} วันที่แล้ว`;
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}

export default function SheetComments({
  sheetId,
  currentUserId,
}: {
  sheetId: string;
  /** null when logged out — commenting is then disabled. */
  currentUserId: string | null;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");

  const listKey = trpc.comments.list.queryKey({ sheetId });
  const { data: comments = [], isLoading } = useQuery(
    trpc.comments.list.queryOptions({ sheetId })
  );

  const createMutation = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: () => {
        setBody("");
        queryClient.invalidateQueries({ queryKey: listKey });
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.comments.delete.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: listKey }),
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || createMutation.isPending) return;
    createMutation.mutate({ sheetId, body: text });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
        <MessageSquare className="h-4 w-4 text-blue-500" />
        ความคิดเห็น
        {comments.length > 0 && (
          <span className="text-sm font-normal text-gray-400">({comments.length})</span>
        )}
      </h2>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mb-5">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, MAX))}
            rows={3}
            placeholder="เขียนความคิดเห็นเกี่ยวกับชีทนี้..."
            className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {body.length}/{MAX}
            </span>
            <button
              type="submit"
              disabled={!body.trim() || createMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              ส่งความคิดเห็น
            </button>
          </div>
          {createMutation.error && (
            <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {createMutation.error.message}
            </p>
          )}
        </form>
      ) : (
        <div className="mb-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-center">
          <p className="text-sm text-gray-500">
            <Link href="/signin" className="font-medium text-blue-600 hover:underline">
              เข้าสู่ระบบ
            </Link>{" "}
            เพื่อแสดงความคิดเห็น
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-50" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          ยังไม่มีความคิดเห็น มาเป็นคนแรกกันเถอะ
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar src={c.user.image} name={c.user.name} seed={c.user.id} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {c.user.username ? (
                    <Link
                      href={`/u/${c.user.username}`}
                      className="truncate text-sm font-semibold text-gray-800 hover:text-blue-600 hover:underline"
                    >
                      {c.user.name}
                    </Link>
                  ) : (
                    <span className="truncate text-sm font-semibold text-gray-800">
                      {c.user.name}
                    </span>
                  )}
                  <span className="shrink-0 text-xs text-gray-400">
                    {timeAgo(c.createdAt)}
                  </span>
                  {currentUserId === c.user.id && (
                    <button
                      type="button"
                      title="ลบความคิดเห็น"
                      onClick={() => deleteMutation.mutate({ id: c.id })}
                      disabled={deleteMutation.isPending}
                      className="ml-auto shrink-0 rounded p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-0.5 whitespace-pre-line break-words text-sm text-gray-600">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
