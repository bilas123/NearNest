import React from "react";

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs ${
              isActive
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-600/20"
                : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
