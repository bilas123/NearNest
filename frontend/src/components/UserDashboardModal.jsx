import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { ListingsTab } from "./ListingsTab";
import { OrdersTab } from "./OrdersTab";
import { ProfileTab } from "./ProfileTab";

const cardStyle = "p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600";

export function UserDashboardModal({ isOpen, onClose, currentUser, onUpdateUser, products, onOpenCreateListing, onDeleteListing }) {
  const [activeTab, setActiveTab] = useState("listings");
  const [myOrders, setMyOrders] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (!isOpen || !currentUser || activeTab !== "orders") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    Promise.all([
      fetch("/api/orders/my-orders", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/orders/seller-requests", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([buyers, sellers]) => {
        setMyOrders(Array.isArray(buyers) ? buyers : []);
        setSellerRequests(Array.isArray(sellers) ? sellers : []);
      })
      .catch(() => { setMyOrders([]); setSellerRequests([]); })
      .finally(() => setLoading(false));
  }, [isOpen, activeTab, currentUser]);

  if (!isOpen) return null;

  // Not logged in guard
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
  const userListings = products.filter((p) => (p.seller?._id || p.seller) === user.id);

  const TABS = [
    { key: "listings", label: "Listings", count: userListings.length },
    { key: "orders", label: "Orders", count: myOrders.length + sellerRequests.length },
    { key: "profile", label: "Profile", count: null },
  ];

  // Update a single order's status locally after seller action
  const handleUpdateOrder = (orderId, status) => {
    setSellerRequests((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
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
          {activeTab === "listings" && (
            <ListingsTab userListings={userListings} onClose={onClose} onOpenCreateListing={onOpenCreateListing} onDeleteListing={onDeleteListing} />
          )}

          {activeTab === "orders" && (
            <OrdersTab myOrders={myOrders} sellerRequests={sellerRequests} loading={loading} onUpdateOrder={handleUpdateOrder} />
          )}

          {activeTab === "profile" && (
            <ProfileTab
              currentUser={currentUser}
              onUpdateUser={onUpdateUser}
              userListingsCount={userListings.length}
              myOrdersCount={myOrders.length}
            />
          )}
        </div>
      </div>
    </div>
  );
}
