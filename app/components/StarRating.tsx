"use client";

import { useState } from "react";
import { Star } from "lucide-react";

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
  const [hoveredStar, setHoveredStar] = useState(0);
  const [myRating, setMyRating] = useState(currentRating ?? 0);
  const [avg, setAvg] = useState(averageRating);
  const [total, setTotal] = useState(totalRatings);
  const [submitting, setSubmitting] = useState(false);

  const handleRate = async (score: number) => {
    if (submitting) return;

    // Optimistic update
    const prevRating = myRating;
    const prevAvg = avg;
    const prevTotal = total;
    setMyRating(score);

    setSubmitting(true);
    try {
      const res = await fetch(`/api/sheets/${sheetId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });

      if (res.ok) {
        const data = await res.json();
        setAvg(data.averageRating);
        setTotal(data.totalRatings);
        onRated?.(data.averageRating, data.totalRatings);
      } else {
        // Revert on error
        setMyRating(prevRating);
        setAvg(prevAvg);
        setTotal(prevTotal);
      }
    } catch {
      setMyRating(prevRating);
      setAvg(prevAvg);
      setTotal(prevTotal);
    } finally {
      setSubmitting(false);
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
              disabled={submitting}
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
