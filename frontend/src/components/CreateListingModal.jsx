import React, { useState } from "react";
import { X, PlusCircle, Sparkles, Upload, Compass } from "lucide-react";
import { LocationPickerModal } from "./LocationPickerModal";

const INIT = {
  title: "", category: "Textbooks", listingType: "sell",
  price: "", condition: "Good", location: "Kolkata",
  description: "", image: "",
};

const inputCls = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all text-xs";
const labelCls = "block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1";

export function CreateListingModal({ isOpen, onClose, onCreateListing }) {
  const [form, setForm] = useState(INIT);
  const [coordinates, setCoordinates] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError("Image must be smaller than 5MB");
    const reader = new FileReader();
    reader.onloadend = () => update("image", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          price: form.listingType === "donate" ? 0 : Number(form.price) || 0,
          coordinates: coordinates || undefined,
          image: form.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
        }),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Failed to create listing");
      onCreateListing(await res.json());
      setForm(INIT);
      setCoordinates(null);
      onClose();
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
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Post an Item</h3>
              <p className="text-[11px] text-gray-500">Share, sell, or rent to people nearby</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {/* Form */}
        <form id="create-listing-form" onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {/* Mode Selector */}
          <div>
            <label className={labelCls}>Listing Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {["sell", "rent", "donate"].map((mode) => (
                <button type="button" key={mode} onClick={() => update("listingType", mode)}
                  className={`p-2 rounded-xl border font-bold capitalize cursor-pointer transition-all ${form.listingType === mode ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" : "border-gray-200 dark:border-gray-700 text-gray-500"}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Item Title *</label>
            <input type="text" required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Casio fx-991EX Calculator" className={inputCls} />
          </div>

          {/* Photo Upload */}
          <div>
            <label className={labelCls}>Photo</label>
            {form.image ? (
              <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => update("image", "")} className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black text-white rounded-full cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-500 bg-gray-50/50 dark:bg-gray-700/30">
                <Upload className="w-4 h-4 text-gray-400 mb-0.5" />
                <span className="text-[11px] text-gray-500">Upload photo from device</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className={inputCls}>
                {["Textbooks", "Electronics", "Vehicles", "Clothing", "Hostel Needs", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Condition</label>
              <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className={inputCls}>
                {["Like New", "Good", "Fair"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          {form.listingType !== "donate" && (
            <div>
              <label className={labelCls}>{form.listingType === "rent" ? "Daily Rate (₹/day) *" : "Price (₹) *"}</label>
              <input type="number" min="0" required value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" className={inputCls} />
            </div>
          )}

          {/* Location with Map Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelCls}>Pickup Area</label>
              <button type="button" onClick={() => setIsMapOpen(true)} className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer">
                <Compass className="w-3.5 h-3.5" />
                <span>{coordinates ? "📍 Change on Map" : "🗺️ Pick on Map"}</span>
              </button>
            </div>
            <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Salt Lake, Sector 5, Kolkata" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea rows="2" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Condition details, pickup notes..." className={inputCls} />
          </div>
        </form>

        {error && <p className="px-5 py-1 text-xs text-red-500">{error}</p>}

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer">Cancel</button>
          <button type="submit" form="create-listing-form" disabled={loading}
            className="inline-flex items-center space-x-1 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-700 cursor-pointer disabled:opacity-50">
            <Sparkles className="w-3.5 h-3.5" /><span>{loading ? "Saving..." : "Publish"}</span>
          </button>
        </div>
      </div>

      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialCoords={[22.5726, 88.3639]}
        onSelectLocation={(data) => {
          update("location", data.address);
          setCoordinates(data.coordinates);
        }}
      />
    </div>
  );
}
