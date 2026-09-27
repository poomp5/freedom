"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface StarRatingProps {
  sheetId: string;
  currentRating: number | null;
  averageRating: number;
  totalRatings: number;
  onRated?: (avg: number, total: number) => void;
}

export default function StarRating({
  sheetId,
  currentRating,
  averageRating,
  totalRatings,
  onRated,
}: StarRatingProps) {
  const trpc = useTRPC();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [myRating, setMyRating] = useState(currentRating ?? 0);
  const [avg, setAvg] = useState(averageRating);
  const [total, setTotal] = useState(totalRatings);

  const rateMutation = useMutation(
    trpc.sheets.rate.mutationOptions({
      onSuccess: (data) => {
        setAvg(data.averageRating);
        setTotal(data.totalRatings);
        onRated?.(data.averageRating, data.totalRatings);
      },
    })
  );

  const handleRate = async (score: number) => {
    if (rateMutation.isPending) return;

    const prevRating = myRating;
    const prevAvg = avg;
    const prevTotal = total;
    setMyRating(score);

    try {
      await rateMutation.mutateAsync({ sheetId, score });
    } catch {
      setMyRating(prevRating);
      setAvg(prevAvg);
      setTotal(prevTotal);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = hoveredStar > 0 ? star <= hoveredStar : star <= myRating;
          return (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              disabled={rateMutation.isPending}
              className="p-0.5 transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  filled
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="text-sm text-gray-600">
        {avg.toFixed(1)}
      </span>
      <span className="text-xs text-gray-400">
        ({total} รีวิว)
      </span>
    </div>
  );
}
