import React from "react";
import { X, ShieldCheck, Star, CheckCircle, MapPin, User } from "lucide-react";

export function SellerProfileModal({ seller, isOpen, onClose }) {
  if (!isOpen || !seller) return null;

  const isNewNeighbor = !seller.sellerTrades || seller.sellerTrades === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-10 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl mb-3 shadow-xs">
            {seller.sellerName ? seller.sellerName[0].toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{seller.sellerName || "Community Member"}</h3>
          <p className="text-xs text-gray-500 flex items-center justify-center space-x-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>{seller.location || "Local Neighborhood"}</span>
          </p>
        </div>

        {/* Reliability Score Box */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-center">
          {isNewNeighbor ? (
            <div>
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-800 text-xs font-bold rounded-full">
                New Neighbor
              </span>
              <p className="text-xs text-gray-500 mt-1">
                No past reviews yet. Complete verified handoffs to build community reputation.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-[#FFB703] text-gray-900 rounded-full">
                  ★ {seller.sellerRating || "4.8"} Score
                </span>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {seller.reliabilityScore || "98%"} Reliability
                </span>
              </div>
              <p className="text-xs text-gray-600 flex items-center justify-center space-x-1 pt-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{seller.sellerTrades || 12} verified neighbor handoffs</span>
              </p>
            </>
          )}
        </div>

        {/* Recent Community Reviews */}
        <div className="space-y-2.5 pt-1">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Past Neighbor Reviews
          </h4>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-1 text-amber-500 text-[11px] mb-0.5">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-700 italic">"Item was in great working condition. Handover took 2 mins."</p>
              <p className="text-[10px] text-gray-400 mt-1 font-medium">— Aman K. (Resident)</p>
            </div>

            <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-1 text-amber-500 text-[11px] mb-0.5">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-700 italic">"Very polite and returned promptly. Reliable neighbor."</p>
              <p className="text-[10px] text-gray-400 mt-1 font-medium">— Shreya M. (PG 3rd Floor)</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}
