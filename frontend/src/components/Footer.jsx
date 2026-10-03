import React from "react";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

const QUICK_LINKS = ["Browse Marketplace", "Neighborhood Rentals", "Community Donations", "\"I Need This\" Requests"];
const SAFETY_TIPS = [
  "Meet in well-lit public spots like cafes or gates.",
  "Inspect items physically before exchange.",
  "No advance payments — pay after inspection.",
  "Check seller reliability ratings before trading.",
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              Near<span className="text-emerald-600 dark:text-emerald-400">Nest</span>
            </span>
            <p className="text-xs text-gray-500">A Hyperlocal Circular E-Commerce Marketplace</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 text-xs">
          {/* Safety Tips */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Trust & Safety</h4>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-300">
              {SAFETY_TIPS.map((tip) => <li key={tip}>• {tip}</li>)}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-300">
              {QUICK_LINKS.map((link) => <li key={link} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">{link}</li>)}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {[
                { icon: Mail, text: "support@nearnest.local" },
                { icon: Phone, text: "+91 81013 07093" },
                { icon: MapPin, text: "Local Neighborhood Coverage" },
              ].map((item) => (
                <li key={item.text} className="flex items-center space-x-2">
                  <item.icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <p>© {new Date().getFullYear()} NearNest — Hyperlocal E-Commerce Lab Project</p>
          <p>Built by TYPICAL-CHAPRIS 🃏</p>
        </div>
      </div>
    </footer>
  );
}
