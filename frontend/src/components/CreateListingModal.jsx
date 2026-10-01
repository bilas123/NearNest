import React, { useState } from "react";
import { X, PlusCircle, Sparkles } from "lucide-react";

export function CreateListingModal({ isOpen, onClose, onCreateListing }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Textbooks",
    listingType: "sell", // sell, rent, donate
    price: "",
    condition: "Good",
    location: "Local Neighborhood",
    description: "",
    image: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const newProduct = {
      _id: `prod-${Date.now()}`,
      title: formData.title.trim(),
      description:
        formData.description.trim() ||
        "No description provided. Contact seller for details.",
      price: formData.listingType === "donate" ? 0 : Number(formData.price) || 0,
      listingType: formData.listingType,
      category: formData.category,
      condition: formData.condition,
      location: formData.location.trim() || "Nearby Area",
      distance: "0.1 km away",
      image:
        formData.image.trim() ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      sellerName: "You (Current User)",
    };

    onCreateListing(newProduct);
    onClose();

    // Reset form
    setFormData({
      title: "",
      category: "Textbooks",
      listingType: "sell",
      price: "",
      condition: "Good",
      location: "Local Neighborhood",
      description: "",
      image: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200">
      {/* Click-outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Post an Item
              </h3>
              <p className="text-xs text-gray-500">
                Share, sell, or rent to people nearby
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 hover:scale-110 active:scale-90 transition-all cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="create-listing-form"
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-4 text-sm"
        >
          {/* Listing Mode (Sell / Rent / Donate) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Listing Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "sell", label: "Sell", desc: "One-time price" },
                { type: "rent", label: "Rent", desc: "Daily rate" },
                { type: "donate", label: "Donate", desc: "Free for all" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() =>
                    setFormData({ ...formData, listingType: item.type })
                  }
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer hover:scale-102 active:scale-95 ${formData.listingType === item.type
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold shadow-xs"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  <div className="text-xs font-bold capitalize">{item.label}</div>
                  <div className="text-[10px] text-gray-500">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Item Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Casio fx-991EX Calculator or Physics Book"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          {/* Category & Condition Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Textbooks">Textbooks</option>
                <option value="Electronics">Electronics</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Clothing">Clothing</option>
                <option value="Hostel Needs">Hostel Needs</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Price (if not donate) */}
          {formData.listingType !== "donate" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {formData.listingType === "rent" ? "Daily Rate (₹/day) *" : "Selling Price (₹) *"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder={formData.listingType === "rent" ? "40" : "350"}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pickup Area / Neighborhood
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Sector 4, Green Park, South Block"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Give a few details about the condition, accessories included, etc."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="create-listing-form"
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish Listing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
