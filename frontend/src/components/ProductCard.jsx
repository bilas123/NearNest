import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";

export function ProductCard({ product, onSelect, onSelectSeller }) {
  // Format price display based on listing type
  const renderPrice = () => {
    if (product.listingType === "donate") {
      return <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free</span>;
    }
    if (product.listingType === "rent") {
      return (
        <span className="font-bold text-gray-900 dark:text-white">
          ₹{product.price}
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/day</span>
        </span>
      );
    }
    return <span className="font-bold text-gray-900 dark:text-white">₹{product.price}</span>;
  };

  // Color badge for listing type (Sell, Rent, Donate)
  const getBadgeStyle = () => {
    switch (product.listingType) {
      case "donate":
        return "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "rent":
        return "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      default:
        return "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="group relative flex flex-col bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Listing Type Badge (Sell / Rent / Donate) */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize shadow-xs hover:scale-105 transition-transform cursor-default ${getBadgeStyle()}`}
          >
            {product.listingType}
          </span>
        </div>

        {/* Condition Tag */}
        <div className="absolute top-3 right-3">
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-black/60 backdrop-blur-xs text-white rounded-md shadow-xs hover:scale-105 transition-transform cursor-default">
            {product.condition}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Proximity */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {product.category}
            <span className="text-gray-400 dark:text-gray-500 font-normal"> • {product.postedTime || "Just now"}</span>
          </span>
          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{product.distance}</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
          {product.title}
        </h3>

        {/* Location & Seller Reliability */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-1.5">{product.location}</p>

        {/* Seller Reliability Badge (Clickable) */}
        {product.reliabilityScore && (
          <div
            onClick={(e) => {
              if (onSelectSeller) {
                e.stopPropagation();
                onSelectSeller(product);
              }
            }}
            className="inline-flex items-center space-x-1.5 text-[11px] mb-3 p-1 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors cursor-pointer w-fit"
            title="Click to view seller reliability score"
          >
            <span className="flex items-center text-amber-500 font-bold">
              ★ {product.sellerRating || "5.0"}
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
              {product.reliabilityScore} Reliability
            </span>
          </div>
        )}

        {/* Bottom Row: Price & Action */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="text-base">{renderPrice()}</div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(product);
            }}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-full hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:scale-105 active:scale-95 hover:shadow-md transition-all duration-200 cursor-pointer border border-emerald-200/60 dark:border-emerald-800/60"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
