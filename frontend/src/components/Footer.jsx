import React from "react";
import { ShoppingBag, ShieldCheck, RefreshCw, Mail, Phone, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200/80 bg-white/70 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Brand Banner */}
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-gray-900 tracking-tight text-lg">
              Near<span className="text-emerald-600">Nest</span>
            </span>
            <p className="text-xs text-gray-500">
              A Hyperlocal Circular E-Commerce Marketplace
            </p>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-xs">
          {/* 1. Circular Economy */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Circular Economy</span>
            </h4>
            <p className="text-gray-500 leading-relaxed">
              Keeping useful books, electronics, and household gear in continuous
              circulation within walking distance to reduce neighborhood waste.
            </p>
            <div className="pt-1 text-[11px] text-emerald-700 font-medium">
              ♻️ Re-use • 🤝 Re-lend • 🎁 Donate
            </div>
          </div>

          {/* 2. Hyperlocal Trust & Safety */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trust & Safety</span>
            </h4>
            <ul className="space-y-1.5 text-gray-500 leading-relaxed">
              <li>• Meet in well-lit public spots like local cafes or gates.</li>
              <li>• Inspect item condition physically before exchange.</li>
              <li>• No advance payments — pay only after inspection.</li>
              <li>• Check seller reliability ratings before trading.</li>
            </ul>
          </div>

          {/* 3. Quick Platform Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-gray-900 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  to="/"
                  className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-transform duration-150 cursor-pointer"
                >
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-transform duration-150 cursor-pointer"
                >
                  Neighborhood Rentals
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-transform duration-150 cursor-pointer"
                >
                  Free Community Donations
                </Link>
              </li>
              <li>
                <span className="text-gray-400 italic">
                  "I Need This" Requests (Coming Soon)
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Contact & Support Details */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-gray-900 uppercase tracking-wider">
              Contact & Help
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>support@nearnest.local</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Helpline: +91 81013 07093</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Local Neighborhood Coverage</span>
              </li>
              <li className="text-[11px] text-gray-400 pt-1">
                Report issues: safety@nearnest.local
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <p>© {new Date().getFullYear()} NearNest — Hyperlocal Circular E-Commerce Lab Project</p>
          <p className="flex items-center space-x-1">
            <span>Build by TYPICAL-CHAPRIS 🃏</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
