import React from "react";
import { Search, X } from "lucide-react";

export function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        <Search className="w-5 h-5" />
      </div>

      {/* Search Input Field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search books, bicycle, electronics, home tools..."
        className="w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm rounded-full border border-gray-200/90 dark:border-gray-700 shadow-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
      />

      {/* Clear Button (Visible only when typing) */}
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer"
          aria-label="Clear search query"
        >
          <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300">
            <X className="w-3.5 h-3.5" />
          </div>
        </button>
      )}
    </div>
  );
}
