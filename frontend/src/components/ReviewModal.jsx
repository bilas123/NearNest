import React, { useState } from "react";
import { X, Star } from "lucide-react";

export function ReviewModal({ isOpen, onClose, order, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      onReviewSubmitted(order._id, rating);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 z-10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Rate & Review</h3>
            <p className="text-[11px] text-gray-400 truncate max-w-[220px]">{order.product?.title}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
          ✓ Verified Buyer Review — order delivered & completed
        </p>

        {error && (
          <p className="p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Star Rating Picker */}
          <div>
            <div className="flex justify-center space-x-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-xs font-semibold text-amber-600 dark:text-amber-400">
              {{ 1: "1 ★ - Poor", 2: "2 ★ - Fair", 3: "3 ★ - Good", 4: "4 ★ - Very Good", 5: "5 ★ - Excellent" }[rating]}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Short Review Note</label>
              <span className="text-[10px] text-gray-400">{comment.length}/500</span>
            </div>
            <textarea
              rows="3"
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a short note on item condition, punctuality, or meetup experience..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-[#FFB703] hover:bg-[#f0ac00] disabled:opacity-50 text-gray-900 font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
