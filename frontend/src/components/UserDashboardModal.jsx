import React, { useState } from "react";
import { X, User, PlusCircle, Check, Trash2, Package, Heart, ShoppingBag, Mail, MapPin, Star } from "lucide-react";

// Mock orders (will come from backend in Phase 5)
const MOCK_ORDERS = [
  { id: "order-1", product: "DS & Algorithms Textbook", seller: "Arjun Patel", price: 250, type: "buy", status: "confirmed", date: "2026-09-28" },
  { id: "order-2", product: "Casio fx-991ES Calculator", seller: "Sneha Gupta", price: 40, type: "rent", days: 3, status: "pending", date: "2026-10-01" },
  { id: "order-3", product: "Wooden Study Table", seller: "Priya Sharma", price: 0, type: "donate", status: "completed", date: "2026-09-20" },
];

// Simple status badge colors
const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

// Reusable empty state
function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="py-10 text-center space-y-2">
      <Icon className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
      <p className="text-gray-400 font-medium text-xs">{title}</p>
      {subtitle && <p className="text-gray-400 text-[11px]">{subtitle}</p>}
    </div>
  );
}

// Common styles used across tabs
const cardStyle = "p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600";
const sectionLabel = "font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[11px]";

export function UserDashboardModal({ isOpen, onClose, currentUser, products, onOpenCreateListing, onDeleteListing }) {
  const [activeTab, setActiveTab] = useState("listings");
  const [orders] = useState(MOCK_ORDERS);
  const [wishlist] = useState([]);
  const [requests, setRequests] = useState([
    { id: "req-1", item: "Casio Calculator", from: "Rahul Sharma", duration: "2 days", price: "₹40/day", status: "pending" },
  ]);

  if (!isOpen) return null;

  // Not logged in
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 z-10 text-center space-y-3">
          <User className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white">Sign In Required</h3>
          <p className="text-xs text-gray-500">Sign in to view your dashboard.</p>
          <button onClick={onClose} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer">Close</button>
        </div>
      </div>
    );
  }

  const user = currentUser;

  // Match listings by seller ID (backend products have seller._id or seller as string)
  const userListings = products.filter((p) => {
    const sellerId = p.seller?._id || p.seller;
    return sellerId === user.id;
  });

  // Delete listing from backend, then remove from local state
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
    } catch (err) {
      alert("Could not delete — server may be offline");
    }
  };

  const TABS = [
    { key: "listings", label: "Listings", count: userListings.length },
    { key: "orders", label: "Orders", count: orders.length },
    { key: "wishlist", label: "Wishlist", count: wishlist.length },
    { key: "profile", label: "Profile", count: null },
  ];

  // Helper to show price text for a listing
  const priceText = (item) => {
    if (item.listingType === "donate") return "Free";
    if (item.listingType === "rent") return `₹${item.price}/day`;
    return `₹${item.price}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</h3>
                <p className="text-[11px] text-gray-500">★ {user.sellerRating || 4.9} • {user.reliabilityScore || "98%"} Reliability</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Bar */}
          <div className="flex space-x-1 mt-4 bg-gray-200/70 dark:bg-gray-700/70 rounded-xl p-1">
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.key ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-xs" : "text-gray-500 dark:text-gray-400"
                }`}>
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto text-xs flex-1 space-y-3">

          {/* LISTINGS TAB */}
          {activeTab === "listings" && (
            <>
              <div className="flex items-center justify-between">
                <span className={sectionLabel}>Your Listings</span>
                <button onClick={() => { onClose(); onOpenCreateListing(); }}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FFB703] text-gray-900 font-bold rounded-full hover:bg-[#f0ac00] cursor-pointer text-[11px]">
                  <PlusCircle className="w-3.5 h-3.5" /><span>New Item</span>
                </button>
              </div>

              {userListings.length === 0 ? (
                <EmptyState icon={ShoppingBag} title="No listings yet" subtitle="Post your first item!" />
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
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <>
              {/* Incoming requests (as seller) */}
              {requests.length > 0 && (
                <>
                  <span className={sectionLabel}>Incoming Requests</span>
                  {requests.map((req) => (
                    <div key={req.id} className={`${cardStyle} space-y-2`}>
                      <div className="flex justify-between">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{req.item}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200 rounded-full">{req.price}</span>
                      </div>
                      <p className="text-gray-500"><strong className="text-gray-800 dark:text-gray-200">{req.from}</strong> wants this for {req.duration}</p>
                      {req.status === "pending" ? (
                        <div className="flex space-x-2">
                          <button onClick={() => setRequests(requests.map((r) => r.id === req.id ? { ...r, status: "accepted" } : r))}
                            className="flex-1 py-1.5 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1">
                            <Check className="w-3.5 h-3.5" /><span>Accept</span>
                          </button>
                          <button onClick={() => setRequests(requests.map((r) => r.id === req.id ? { ...r, status: "declined" } : r))}
                            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl cursor-pointer">
                            Decline
                          </button>
                        </div>
                      ) : (
                        <p className="p-2 rounded-xl text-center font-bold bg-gray-100 dark:bg-gray-700 text-gray-500">
                          {req.status === "accepted" ? "✓ Accepted" : "Declined"}
                        </p>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* My orders (as buyer) */}
              <span className={sectionLabel}>My Orders</span>
              {orders.length === 0 ? (
                <EmptyState icon={Package} title="No orders yet" subtitle="Buy or rent something to see it here." />
              ) : (
                orders.map((order) => (
                  <div key={order.id} className={`${cardStyle} space-y-2`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{order.product}</p>
                        <p className="text-gray-500 mt-0.5">from {order.seller}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-600">
                      <span>{order.type === "rent" ? `₹${order.price}/day × ${order.days}d` : order.type === "donate" ? "Free" : `₹${order.price}`}</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <>
              <span className={sectionLabel}>Saved Items</span>
              {wishlist.length === 0 ? (
                <EmptyState icon={Heart} title="Wishlist is empty" subtitle="Tap ♡ on any product to save it here." />
              ) : (
                wishlist.map((item) => (
                  <div key={item._id} className={`${cardStyle} flex items-center justify-between`}>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
                      <p className="text-gray-500 mt-0.5">{priceText(item)}</p>
                    </div>
                    <Heart className="w-4 h-4 text-red-400 fill-current" />
                  </div>
                ))
              )}
            </>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <>
              <span className={sectionLabel}>My Profile</span>
              <div className={`${cardStyle} space-y-4`}>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{user.name}</h4>
                    <p className="text-gray-500 text-[11px]">NearNest Member</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200/80 dark:border-gray-600">
                  {[
                    { icon: Mail, label: "Email", value: user.email },
                    { icon: MapPin, label: "Location", value: user.location || "Not set" },
                    { icon: Star, label: "Rating", value: `★ ${user.sellerRating || 4.9} • ${user.sellerTrades || 0} trades` },
                  ].map((field) => (
                    <div key={field.label} className="flex items-center space-x-3">
                      <field.icon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{field.label}</p>
                        <p className="text-sm text-gray-900 dark:text-white">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Listings", count: userListings.length, color: "emerald" },
                  { label: "Orders", count: orders.length, color: "blue" },
                  { label: "Wishlist", count: wishlist.length, color: "rose" },
                ].map((stat) => (
                  <div key={stat.label} className={`p-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl text-center`}>
                    <p className={`text-lg font-bold text-${stat.color}-700 dark:text-${stat.color}-300`}>{stat.count}</p>
                    <p className={`text-[10px] text-${stat.color}-600 dark:text-${stat.color}-400 font-medium`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
