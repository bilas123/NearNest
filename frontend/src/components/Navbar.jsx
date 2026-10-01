import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, PlusCircle, ShoppingBag } from "lucide-react";

export function Navbar({
  onOpenCreateListing,
  currentUser,
  onOpenAuth,
  onSignOut,
  onSelectCategory,
  onOpenDashboard,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePostItemClick = (e) => {
    if (onOpenCreateListing) {
      e.preventDefault();
      onOpenCreateListing();
      setIsOpen(false);
    }
  };

  const handleAuthClick = (e) => {
    if (onOpenAuth) {
      e.preventDefault();
      onOpenAuth();
      setIsOpen(false);
    }
  };

  const handleCategoryNav = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat === "Marketplace" ? "All" : cat);
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 flex justify-center w-full py-4 px-4 bg-transparent">
      {/* Floating Pill Container */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-2.5 sm:py-3 bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-full shadow-sm w-full max-w-4xl">
        {/* Brand Logo */}
        <button
          onClick={() => handleCategoryNav("Marketplace")}
          className="flex items-center space-x-2 group cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-active:scale-95 shadow-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-lg group-hover:text-emerald-600 transition-colors duration-200">
            Near<span className="text-emerald-600">Nest</span>
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {["Marketplace", "I Need This", "Rentals", "Donations"].map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryNav(item)}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 rounded-full hover:text-emerald-700 hover:bg-emerald-50/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Action Buttons & User State */}
        <div className="hidden md:flex items-center space-x-2.5">
          <button
            onClick={handlePostItemClick}
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-bold text-gray-900 bg-[#FFB703] rounded-full hover:bg-[#f0ac00] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Item</span>
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
              <button
                onClick={onOpenDashboard}
                className="flex items-center space-x-2 hover:opacity-80 cursor-pointer"
                title="Open My Dashboard"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {currentUser.name.split(" ")[0]}
                </span>
              </button>
              <button
                onClick={onSignOut}
                className="text-[11px] text-gray-400 hover:text-red-500 hover:underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="px-4 py-1.5 text-xs font-semibold text-gray-700 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-gray-200"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full active:scale-90 transition-all duration-200 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-100 md:hidden flex flex-col space-y-2">
          {currentUser ? (
            <div
              onClick={() => {
                onOpenDashboard();
                setIsOpen(false);
              }}
              className="p-3 bg-emerald-50 rounded-xl mb-1 flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-emerald-900">{currentUser.name} • Dashboard</p>
                <p className="text-[10px] text-emerald-700">{currentUser.location}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSignOut();
                  setIsOpen(false);
                }}
                className="text-xs text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          ) : null}

          {["Marketplace", "I Need This", "Rentals", "Donations"].map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryNav(item)}
              className="px-4 py-2.5 text-left rounded-xl text-gray-800 font-medium hover:bg-emerald-50 hover:text-emerald-700 active:scale-98 transition-all cursor-pointer"
            >
              {item}
            </button>
          ))}

          {!currentUser && (
            <button
              onClick={handleAuthClick}
              className="px-4 py-2.5 text-left rounded-xl text-emerald-700 font-semibold hover:bg-emerald-50 active:scale-98 transition-all cursor-pointer"
            >
              Sign In / Sign Up
            </button>
          )}

          <button
            onClick={handlePostItemClick}
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 bg-[#FFB703] text-gray-900 rounded-xl font-bold shadow-md hover:bg-[#f0ac00] active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Item</span>
          </button>
        </div>
      )}
    </header>
  );
}
