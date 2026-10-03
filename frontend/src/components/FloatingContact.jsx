import React, { useState } from "react";
import { MessageCircleQuestion, X, ShieldCheck, Mail, MapPin, HeartHandshake } from "lucide-react";

const PICKUP_ZONES = ["Nearest to BUYER and SELLER preference", "Mainly try to meet in Crowded places", "preferably in Daylight", "Always carrry PHONE and SOMEONE with you for security purpose"];

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer">
          <MessageCircleQuestion className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Help & Safety</span>
        </button>
      </div>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10">
            {/* Header */}
            <div className="p-5 pb-3 border-b border-gray-100 dark:border-gray-700 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5" />
                <h3 className="font-bold text-sm">Community Support</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 text-xs text-gray-600 dark:text-gray-300">
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/50 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  <ShieldCheck className="w-4 h-4" /><span>Exchange Items Safely</span>
                </div>
                <p className="text-[11px]">Always meet in well-lit public spots and verify items in person before completing any kind of exchange.</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center space-x-1 font-semibold text-gray-800 dark:text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /><span>Pickup Zones:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-gray-500 dark:text-gray-400 pl-1 space-y-0.5">
                  {PICKUP_ZONES.map((zone) => <li key={zone}>{zone}</li>)}``
                </ul>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <a href="mailto:bilasbhusansarkar8@gmail.com" className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-emerald-600" /><span className="font-medium">Email Support</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
