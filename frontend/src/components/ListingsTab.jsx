import React from "react";
import { ShoppingBag, PlusCircle, Trash2 } from "lucide-react";

const cardStyle = "p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600";

function EmptyState({ title, subtitle }) {
  return (
    <div className="py-10 text-center space-y-2">
      <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
      <p className="text-gray-400 font-medium text-xs">{title}</p>
      {subtitle && <p className="text-gray-400 text-[11px]">{subtitle}</p>}
    </div>
  );
}

// Shows price based on listing type
const priceText = (item) => {
  if (item.listingType === "donate") return "Free";
  if (item.listingType === "rent") return `₹${item.price}/day`;
  return `₹${item.price}`;
};

export function ListingsTab({ userListings, onClose, onOpenCreateListing, onDeleteListing }) {
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete");
        return;
      }
      onDeleteListing?.(productId);
    } catch {
      alert("Could not delete — server may be offline");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[11px]">Your Listings</span>
        <button onClick={() => { onClose(); onOpenCreateListing(); }}
          className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FFB703] text-gray-900 font-bold rounded-full hover:bg-[#f0ac00] cursor-pointer text-[11px]">
          <PlusCircle className="w-3.5 h-3.5" /><span>New Item</span>
        </button>
      </div>

      {userListings.length === 0 ? (
        <EmptyState title="No listings yet" subtitle="Post your first item!" />
      ) : (
        userListings.map((item) => (
          <div key={item._id} className={`${cardStyle} flex items-center justify-between`}>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
              <p className="text-gray-500 mt-0.5">{item.listingType} • {priceText(item)}</p>
            </div>
            <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-xl cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))
      )}
    </>
  );
}
