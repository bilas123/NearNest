import React, { useState } from "react";
import { X, Send } from "lucide-react";

export function CreateNeedModal({ isOpen, onClose, onCreateNeed, currentUser }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Electronics",
    location: "Campus / Nearby",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    setError("");

    const token = localStorage.getItem("token");
    const budgetVal = formData.budget.trim()
      ? (formData.budget.startsWith("₹") ? formData.budget.trim() : `₹${formData.budget.trim()}`)
      : "Flexible / Free";

    try {
      if (token) {
        const res = await fetch("/api/needs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim() || "Urgent neighborhood requirement.",
            budget: budgetVal,
            category: formData.category,
            location: formData.location.trim() || "Campus / Nearby",
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to broadcast request");
        }

        const created = await res.json();
        onCreateNeed(created);
      } else {
        onCreateNeed({
          _id: `need-${Date.now()}`,
          title: formData.title.trim(),
          description: formData.description.trim() || "Urgent neighborhood requirement.",
          budget: budgetVal,
          category: formData.category,
          distance: "0.1 km away",
          location: formData.location.trim() || "Campus / Nearby",
          requesterName: currentUser?.name || "Community Member",
          postedTime: "Just now",
        });
      }

      onClose();
      setFormData({
        title: "",
        description: "",
        budget: "",
        category: "Electronics",
        location: "Campus / Nearby",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Broadcast a Need</h3>
            <p className="text-xs text-gray-500">Ask nearby community members for items</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">What do you need? *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Scientific Calculator or Induction Cooktop"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Budget (₹ / day or total)</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. 50 / day or 500"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Appliances">Appliances</option>
                <option value="Furniture">Furniture</option>
                <option value="Study Equipment">Study Equipment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Why / For how long do you need it?</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Needed for 3 days exam prep. Will return promptly."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-full font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#FFB703] disabled:opacity-50 text-gray-900 font-bold rounded-full shadow-xs hover:bg-[#f0ac00] active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Broadcasting..." : "Broadcast Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
