import React, { useState } from "react";
import { X, User, ShieldCheck, PlusCircle, Check, Trash2, Clock } from "lucide-react";

export function UserDashboardModal({
  isOpen,
  onClose,
  currentUser,
  products,
  onOpenCreateListing,
  onDeleteListing,
}) {
  const [activeTab, setActiveTab] = useState("listings"); // "listings" or "requests"
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: "req-1",
      itemTitle: "Casio fx-991ES Plus Scientific Calculator",
      requesterName: "Rahul Sharma",
      duration: "2 days",
      price: "₹40/day",
      status: "pending", // pending, accepted, declined
    },
  ]);

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Sign In Required</h3>
          <p className="text-xs text-gray-500">
            Please sign in to view your dashboard, active listings, and neighbor requests.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const user = currentUser;

  const userListings = products.filter(
    (p) => p.sellerName === user.name || p.sellerName === "You (Current User)"
  );

  const handleRequestAction = (id, newStatus) => {
    setIncomingRequests(
      incomingRequests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header with User Info */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                {user.name ? user.name[0].toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{user.name}</h3>
                <p className="text-xs text-gray-500">{user.location}</p>
                <div className="flex items-center space-x-1.5 mt-1 text-[11px]">
                  <span className="font-bold text-amber-500">★ {user.sellerRating || 4.9}</span>
                  <span className="text-gray-300">•</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {user.reliabilityScore || "98%"} Reliability ({user.sellerTrades || 19} trades)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-Tabs */}
          <div className="flex space-x-2 mt-5">
            <button
              onClick={() => setActiveTab("listings")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "listings"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              My Listings ({userListings.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "requests"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Requests ({incomingRequests.filter((r) => r.status === "pending").length})
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === "listings" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                  Your Active Listings
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCreateListing();
                  }}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FFB703] text-gray-900 font-bold rounded-full hover:bg-[#f0ac00] cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Item</span>
                </button>
              </div>

              {userListings.length === 0 ? (
                <p className="text-gray-400 py-6 text-center">You haven't listed any items yet.</p>
              ) : (
                userListings.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 mt-0.5">
                        {item.listingType === "donate"
                          ? "Donation (Free)"
                          : item.listingType === "rent"
                          ? `Rent • ₹${item.price}/day`
                          : `Sell • ₹${item.price}`}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteListing && onDeleteListing(item._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                Incoming Neighbor Requests
              </span>

              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 text-sm">{req.itemTitle}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                        {req.price}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      <span className="font-semibold text-gray-800">{req.requesterName}</span> wants to
                      borrow this for {req.duration}.
                    </p>
                  </div>

                  {req.status === "pending" ? (
                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => handleRequestAction(req.id, "accepted")}
                        className="flex-1 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>
                      <button
                        onClick={() => handleRequestAction(req.id, "declined")}
                        className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : req.status === "accepted" ? (
                    <div className="p-2 bg-emerald-50 text-emerald-800 font-bold rounded-xl text-center border border-emerald-200">
                      ✓ Accepted! Meet for physical handoff.
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-100 text-gray-500 font-medium rounded-xl text-center">
                      Request Declined
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
