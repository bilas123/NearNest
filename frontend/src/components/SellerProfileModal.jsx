import React, { useState, useEffect } from "react";
import { X, Star, CheckCircle, MapPin, User, MessageSquare } from "lucide-react";

export function SellerProfileModal({ seller, isOpen, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Normalize seller information
  const sellerId = seller?.seller?._id || (typeof seller?.seller === "string" ? seller.seller : seller?._id);
  const sellerName = seller?.seller?.name || seller?.sellerName || seller?.name || "Community Member";
  const sellerLocation = seller?.location || seller?.seller?.location || "Local Neighborhood";
  const sellerTrades = seller?.sellerTrades ?? 0;
  const sellerRating = seller?.sellerRating ?? 0;
  const reliabilityScore = seller?.reliabilityScore || (sellerTrades > 0 ? "100%" : "New Seller");

  useEffect(() => {
    if (!isOpen || !sellerId || !sellerId.match(/^[0-9a-fA-F]{24}$/)) {
      setReviews([]);
      return;
    }

    setLoading(true);
    fetch(`/api/reviews/seller/${sellerId}`)
      .then((res) => (res.ok ? res.json() : { reviews: [] }))
      .then((data) => setReviews(Array.isArray(data.reviews) ? data.reviews : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [isOpen, sellerId]);

  if (!isOpen || !seller) return null;

  const isNewNeighbor = sellerTrades === 0 && reviews.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 z-10 space-y-4 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold text-xl mb-3 shadow-xs">
            {sellerName ? sellerName[0].toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sellerName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>{sellerLocation}</span>
          </p>
        </div>

        {/* Reliability Score Box */}
        <div className="p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 space-y-2 text-center">
          {isNewNeighbor ? (
            <div>
              <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-full">
                New Seller
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                No past reviews yet. Complete verified handoffs to build community reputation.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-[#FFB703] text-gray-900 rounded-full">
                  ★ {sellerRating || (reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0")} Score
                </span>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {reliabilityScore} Reliability
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center justify-center space-x-1 pt-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{sellerTrades} verified neighbor handoffs</span>
              </p>
            </>
          )}
        </div>

        {/* Real Past Buyer Reviews with Short Notes */}
        <div className="space-y-2 pt-1 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Buyer Reviews ({reviews.length})
            </h4>
          </div>

          {loading ? (
            <p className="text-center text-xs text-gray-400 py-4">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center text-xs text-gray-400">
              No written buyer notes yet. Verified buyers can leave a rating & short review note after delivery.
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-2.5 bg-gray-50/80 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-600/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-0.5 text-amber-500 text-[11px]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rev.comment ? (
                    <p className="text-gray-700 dark:text-gray-200 italic font-normal">"{rev.comment}"</p>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 italic text-[11px]">Rating submitted with no note.</p>
                  )}
                  <p className="text-[10px] text-gray-400 font-medium">
                    — {rev.buyer?.name || "Verified Buyer"} {rev.product?.title ? `(${rev.product.title})` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}
