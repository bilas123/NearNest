import React, { useState } from "react";
import { X, MapPin, User, CheckCircle2, Compass } from "lucide-react";
import { LocationPickerModal } from "./LocationPickerModal";

export function ProductDetailsModal({ product, onClose, onViewSeller, onOpenAuth }) {
  const [isRequested, setIsRequested] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLocation, setHasLocation] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coordsLabel, setCoordsLabel] = useState("");

  if (!product) return null;

  const handleAction = async () => {
    const token = localStorage.getItem("token");
    if (!token) return onOpenAuth?.();

    if (typeof product._id === "string" && product._id.startsWith("prod-")) {
      setError("This is a preview demo item. Please refresh the page to load live listings from the server.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productId: product._id,
          rentalDays: product.listingType === "rent" ? rentalDays : 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Order failed");
      setIsRequested(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = () => {
    if (product.listingType === "donate") return "Free";
    if (product.listingType === "rent") return `₹${product.price}/day`;
    return `₹${product.price}`;
  };

  const sellerName = product.seller?.name || product.sellerName || "Neighbor";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="relative aspect-16/9 bg-gray-100 dark:bg-gray-700">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-1.5">
              <span className="px-2.5 py-0.5 bg-black/60 text-white text-xs font-semibold rounded-full capitalize">{product.listingType}</span>
              <span className="px-2.5 py-0.5 bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs font-semibold rounded-full">{product.condition}</span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{product.category}</span>
                <span className="flex items-center space-x-1 text-emerald-600 font-medium"><MapPin className="w-3.5 h-3.5" /><span>{product.location}</span></span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{product.title}</h2>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">{getPrice()}</p>
              {product.listingType === "rent" && !isRequested && (
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Rental Duration</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Total: ₹{product.price * rentalDays} ({rentalDays} day{rentalDays > 1 ? "s" : ""})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      className="w-7 h-7 bg-white dark:bg-gray-700 rounded-lg font-bold text-gray-700 dark:text-gray-200 shadow-xs border border-gray-200 dark:border-gray-600 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-gray-800 dark:text-white w-6 text-center">
                      {rentalDays}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.min(30, rentalDays + 1))}
                      className="w-7 h-7 bg-white dark:bg-gray-700 rounded-lg font-bold text-gray-700 dark:text-gray-200 shadow-xs border border-gray-200 dark:border-gray-600 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Seller profile card */}
            <div onClick={() => onViewSeller?.(product)} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs"><User className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{sellerName}</p>
                  <p className="text-[10px] text-gray-400">★ {product.sellerRating || "5.0"} • {product.sellerTrades || 0} trades</p>
                </div>
              </div>
              <span className="text-xs text-emerald-600 font-semibold">View Profile →</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          {error && <p className="text-xs text-red-500 mb-2 text-center">{error}</p>}

          {!isRequested && (
            <div className="flex items-center justify-between p-2 mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-xs">
              <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[240px]">{hasLocation ? `✓ ${coordsLabel}` : "Pick meetup location"}</span>
              </div>
              <button type="button" onClick={() => { const token = localStorage.getItem("token"); if (!token) return onOpenAuth?.(); setIsMapOpen(true); }}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">
                <Compass className="w-3 h-3" />
                <span>{hasLocation ? "Change" : "Pick on Map"}</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">Back</button>
            {isRequested ? (
              <div className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Request Sent to Seller!</span>
              </div>
            ) : (
              <button onClick={handleAction} disabled={loading}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-700 cursor-pointer disabled:opacity-50">
                {loading ? "Sending..." : product.listingType === "donate" ? "Claim Item" : product.listingType === "rent" ? "Request to Rent" : "Request to Buy"}
              </button>
            )}
          </div>
        </div>
      </div>

      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialCoords={[22.5726, 88.3639]}
        onSelectLocation={(data) => {
          setHasLocation(true);
          setCoordsLabel(data.address);
          const token = localStorage.getItem("token");
          if (token) {
            fetch("/api/users/location", {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ latitude: data.latitude, longitude: data.longitude }),
            }).catch(() => {});
          }
        }}
      />
    </div>
  );
}
