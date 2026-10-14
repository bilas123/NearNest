import React, { useState } from "react";
import { Mail, Phone, MapPin, Star, Edit3, Check, X, Compass } from "lucide-react";
import { LocationPickerModal } from "./LocationPickerModal";

export function ProfileTab({ currentUser, onUpdateUser, userListingsCount, myOrdersCount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || currentUser?.location || "",
  });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      onUpdateUser({
        ...currentUser,
        name: data.user.name,
        phone: data.user.phone,
        address: data.user.address,
        location: data.user.address,
      });

      setIsEditing(false);
      setMessage("Profile saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMapSelect = async (locData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: locData.address,
          coordinates: [locData.longitude, locData.latitude],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setFormData((prev) => ({ ...prev, address: locData.address }));
      onUpdateUser({
        ...currentUser,
        address: data.user.address,
        location: data.user.address,
      });
      setMessage("Location updated from map!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      alert("Failed to update map location");
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
            {currentUser?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-base">{currentUser?.name}</h4>
            <p className="text-gray-500 text-xs">{currentUser?.email}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl shadow-xs hover:bg-gray-100 cursor-pointer"
        >
          {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditing ? "Cancel" : "Edit"}</span>
        </button>
      </div>

      {message && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
          {message}
        </div>
      )}

      {/* Edit Form OR View Details */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone / WhatsApp Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Campus Meetup Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Hostel 4 Gate / Tech Building Canteen"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[11px]">Contact & Handover Details</span>
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#FFB703] hover:bg-[#f0ac00] text-gray-900 font-bold rounded-lg text-[11px] cursor-pointer"
            >
              <Compass className="w-3 h-3" />
              <span>Pick on Map</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-1 text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>{currentUser?.email}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{currentUser?.phone || "No phone added (click Edit to add)"}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{currentUser?.address || currentUser?.location || "Campus Area"}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Rating: ★ {currentUser?.sellerRating || 5.0} • {currentUser?.sellerTrades || 0} trades</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
          <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">{userListingsCount}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Active Listings</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
          <p className="text-base font-extrabold text-blue-700 dark:text-blue-300">{myOrdersCount}</p>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">My Orders</p>
        </div>
      </div>

      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialCoords={[22.5726, 88.3639]}
        onSelectLocation={handleMapSelect}
      />
    </div>
  );
}
