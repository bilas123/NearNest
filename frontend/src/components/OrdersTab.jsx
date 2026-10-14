import React, { useState, useEffect } from "react";
import { Package, Check, Star } from "lucide-react";
import { ReviewModal } from "./ReviewModal";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const cardStyle = "p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600";
const sectionLabel = "font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[11px]";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export function OrdersTab({ myOrders, sellerRequests, loading, onUpdateOrder }) {
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [reviewedMap, setReviewedMap] = useState({});

  // Fetch reviews submitted by this buyer to display rating badges
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/reviews/my-reviews", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach((rev) => {
            if (rev.order) map[rev.order] = rev.rating;
          });
          setReviewedMap(map);
        }
      })
      .catch(() => {});
  }, []);

  // Seller accepts or declines an order
  const handleAction = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      onUpdateOrder(orderId, status);
    } catch {
      alert("Failed to update order");
    }
  };

  const handleReviewSuccess = (orderId, rating) => {
    setReviewedMap((prev) => ({ ...prev, [orderId]: rating }));
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-400 text-xs">Loading orders...</div>;
  }

  return (
    <>
      {/* Incoming requests (as seller) */}
      {sellerRequests.length > 0 && (
        <>
          <span className={sectionLabel}>Incoming Requests</span>
          {sellerRequests.map((req) => (
            <div key={req._id} className={`${cardStyle} space-y-2`}>
              <div className="flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{req.product?.title || "Unknown Product"}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[req.status]}`}>{req.status}</span>
              </div>
              <p className="text-gray-500">
                <strong className="text-gray-800 dark:text-gray-200">{req.buyer?.name || "Someone"}</strong>
                {req.orderType === "rent" ? ` wants to rent for ${req.rentalDays} day(s)` : ` wants to ${req.orderType}`}
              </p>
              {req.status === "pending" && (
                <div className="flex space-x-2">
                  <button onClick={() => handleAction(req._id, "confirmed")}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1 text-xs">
                    <Check className="w-3.5 h-3.5" /><span>Accept Request</span>
                  </button>
                  <button onClick={() => handleAction(req._id, "cancelled")}
                    className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl cursor-pointer text-xs">
                    Decline
                  </button>
                </div>
              )}
              {req.status === "confirmed" && (
                <div className="space-y-1.5 pt-1">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-[11px] text-gray-700 dark:text-gray-200 flex justify-between items-center border border-emerald-200/60 dark:border-emerald-800/40">
                    <span>Buyer: <strong>{req.buyer?.phone || req.buyer?.email}</strong></span>
                    {req.buyer?.phone && (
                      <a href={`https://wa.me/${req.buyer.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
                        WhatsApp ↗
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleAction(req._id, "completed")}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 text-xs shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Handover Completed</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* My orders (as buyer) */}
      <span className={sectionLabel}>My Orders</span>
      {myOrders.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <Package className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
          <p className="text-gray-400 font-medium text-xs">No orders yet</p>
          <p className="text-gray-400 text-[11px]">Buy or rent something to see it here.</p>
        </div>
      ) : (
        myOrders.map((order) => (
          <div key={order._id} className={`${cardStyle} space-y-2`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{order.product?.title || "Unknown Product"}</p>
                <p className="text-gray-500 mt-0.5">from {order.seller?.name || "Unknown"}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
            </div>

            {order.status === "confirmed" && (
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-[11px] text-gray-700 dark:text-gray-200 flex justify-between items-center border border-blue-200/60 dark:border-blue-800/40">
                <span>Meetup: <strong>{order.seller?.phone || order.seller?.email}</strong> ({order.seller?.address || "Campus"})</span>
                {order.seller?.phone && (
                  <a href={`https://wa.me/${order.seller.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-400 font-bold hover:underline">
                    WhatsApp ↗
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-600">
              <span>{order.orderType === "rent" ? `₹${order.totalPrice} (${order.rentalDays}d)` : order.orderType === "donate" ? "Free" : `₹${order.totalPrice}`}</span>
              
              {/* Review Action for completed orders */}
              {order.status === "completed" && (
                <div>
                  {reviewedMap[order._id] ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800/60">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Reviewed ({reviewedMap[order._id]}★)</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrderForReview(order)}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FFB703] hover:bg-[#f0ac00] text-gray-900 font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-all active:scale-95"
                    >
                      <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                      <span>Rate & Review</span>
                    </button>
                  )}
                </div>
              )}

              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
        ))
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(selectedOrderForReview)}
        onClose={() => setSelectedOrderForReview(null)}
        order={selectedOrderForReview}
        onReviewSubmitted={handleReviewSuccess}
      />
    </>
  );
}

