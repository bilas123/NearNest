import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Users, Package, ShoppingBag, Radio } from "lucide-react";

export function AdminModal({ isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const STATS = [
    { label: "Students", val: data?.counts?.users ?? "—", icon: Users },
    { label: "Products", val: data?.counts?.products ?? "—", icon: Package },
    { label: "Orders", val: data?.counts?.orders ?? "—", icon: ShoppingBag },
    { label: "Needs", val: data?.counts?.needs ?? "—", icon: Radio },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Admin Lab Overview</h3>
              <p className="text-[11px] text-gray-400">Live evaluation stats</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <p className="text-center py-6 text-xs text-gray-400">Loading metrics...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {STATS.map((s) => (
                <div key={s.label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200/80 dark:border-gray-600 text-center">
                  <s.icon className="w-4 h-4 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">{s.val}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[11px]">Recent Orders</span>
              {data?.recentOrders?.length ? (
                data.recentOrders.map((o) => (
                  <div key={o._id} className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-xs flex justify-between items-center border border-gray-200/80 dark:border-gray-600">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">{o.product?.title || "Item"}</p>
                      <p className="text-[10px] text-gray-400">Buyer: {o.buyer?.name || "Student"} • ₹{o.totalPrice}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {o.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-2">No orders recorded yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
