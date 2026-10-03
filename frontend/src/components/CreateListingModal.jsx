import React, { useState } from "react";
import { X, PlusCircle, Sparkles } from "lucide-react";

const INITIAL_FORM = {
  title: "", category: "Textbooks", listingType: "sell",
  price: "", condition: "Good", location: "Local Neighborhood",
  description: "", image: "",
};

const inputStyle = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all";

export function CreateListingModal({ isOpen, onClose, onCreateListing }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const update = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    setError("");

    const productData = {
      title: formData.title.trim(),
      description: formData.description.trim() || "No description provided.",
      price: formData.listingType === "donate" ? 0 : Number(formData.price) || 0,
      listingType: formData.listingType,
      category: formData.category,
      condition: formData.condition,
      location: formData.location.trim() || "Nearby Area",
      image: formData.image.trim() || "",
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create listing");
      }

      const saved = await res.json();
      onCreateListing(saved);
      onClose();
      setFormData(INITIAL_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Post an Item</h3>
              <p className="text-xs text-gray-500">Share, sell, or rent to people nearby</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form id="create-listing-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Listing Mode */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Listing Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ type: "sell", label: "Sell" }, { type: "rent", label: "Rent" }, { type: "donate", label: "Donate" }].map((item) => (
                <button type="button" key={item.type} onClick={() => update("listingType", item.type)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${formData.listingType === item.type
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                    }`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Item Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Casio fx-991EX Calculator" className={inputStyle} />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => update("category", e.target.value)} className={`${inputStyle} cursor-pointer`}>
                {["Textbooks", "Electronics", "Vehicles", "Clothing", "Hostel Needs", "Other"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Condition</label>
              <select value={formData.condition} onChange={(e) => update("condition", e.target.value)} className={`${inputStyle} cursor-pointer`}>
                {["Like New", "Good", "Fair"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price (hidden for donations) */}
          {formData.listingType !== "donate" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                {formData.listingType === "rent" ? "Daily Rate (₹/day) *" : "Price (₹) *"}
              </label>
              <input type="number" min="0" required value={formData.price} onChange={(e) => update("price", e.target.value)}
                placeholder={formData.listingType === "rent" ? "40" : "350"} className={inputStyle} />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Pickup Area</label>
            <input type="text" value={formData.location} onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Green Park, South Block" className={inputStyle} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Description</label>
            <textarea rows="2" value={formData.description} onChange={(e) => update("description", e.target.value)}
              placeholder="Condition details, accessories included, etc." className={inputStyle} />
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <p className="px-6 py-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}

        {/* Footer Buttons */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Cancel
          </button>
          <button type="submit" form="create-listing-form" disabled={loading}
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-semibold shadow-md hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <Sparkles className="w-3.5 h-3.5" /><span>{loading ? "Saving..." : "Publish"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
