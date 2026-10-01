import React, { useState } from "react";
import { X, MapPin, User, ShieldCheck, CheckCircle2, Star } from "lucide-react";

export function ProductDetailsModal({ product, onClose, onViewSeller }) {
  const [isRequested, setIsRequested] = useState(false);

  if (!product) return null;

  const handleAction = () => {
    setIsRequested(true);
  };

  const getActionLabel = () => {
    if (product.listingType === "donate") return "Claim Item (Free)";
    if (product.listingType === "rent") return `Request to Rent (₹${product.price}/day)`;
    return `Request to Buy (₹${product.price})`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200">
      {/* Click-outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 hover:text-gray-900 hover:bg-white hover:scale-110 active:scale-90 shadow-md transition-all cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          {/* Product Image */}
          <div className="relative aspect-16/9 w-full bg-gray-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {/* Badges */}
            <div className="absolute bottom-3 left-4 flex items-center space-x-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/95 text-gray-900 shadow-sm capitalize">
                {product.listingType}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-black/70 text-white backdrop-blur-xs">
                {product.condition}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-5">
            {/* Title & Price Header */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-emerald-600 mb-1">
                <span>{product.category}</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.distance}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                {product.listingType === "donate"
                  ? "Free"
                  : product.listingType === "rent"
                    ? `₹${product.price}/day`
                    : `₹${product.price}`}
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1">
                Description
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller & Location Information */}
            <div
              onClick={() => onViewSeller && onViewSeller(product)}
              className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              title="Click to view seller reliability score"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {product.sellerName || "Community Member"}
                  </p>
                  <p className="text-xs text-gray-500">{product.location}</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">💬 WhatsApp & Call Verified</p>
                </div>
              </div>

              {/* Seller Trust & Reliability Metrics */}
              <div className="flex items-center space-x-2 sm:self-center">
                <div className="flex items-center space-x-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{product.sellerRating || "5.0"}</span>
                  <span className="text-amber-700/60 font-normal">
                    ({product.sellerTrades || 10})
                  </span>
                </div>

                <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{product.reliabilityScore || "98%"} Reliable</span>
                </span>
              </div>
            </div>

            {/* Safety Tip */}
            <p className="text-xs text-gray-400 italic">
              NearNest Tip: Always inspect the item in a public place before making any payment.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Back
          </button>

          {isRequested ? (
            <div className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Request Sent to Seller!</span>
            </div>
          ) : (
            <button
              onClick={handleAction}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {getActionLabel()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
