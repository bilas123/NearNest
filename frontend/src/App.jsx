import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { ProductCard } from "./components/ProductCard";
import { CategoryFilter } from "./components/CategoryFilter";
import { SearchBar } from "./components/SearchBar";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { CreateListingModal } from "./components/CreateListingModal";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { mockProducts } from "./data/mockProducts";

const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Vehicles",
  "Clothing",
  "Rentals",
  "Donations",
];

function App() {
  const [products, setProducts] = useState(mockProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Combined search and category filtering over the active products list
  const filteredProducts = products.filter((product) => {
    // 1. Category / Listing mode check
    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Rentals" && product.listingType === "rent") ||
      (activeCategory === "Donations" && product.listingType === "donate") ||
      product.category.toLowerCase() === activeCategory.toLowerCase();

    // 2. Keyword search check (title, description, or category)
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchTerm("");
  };

  const handleCreateListing = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar
        onOpenCreateListing={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={() => setCurrentUser(null)}
        onSelectCategory={setActiveCategory}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Hyperlocal Circular Marketplace
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base mb-6">
            Discover books, electronics, tools, cycles, and household essentials available right now from neighbors nearby.
          </p>

          {/* Interactive Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </section>

        {/* Filter Pills Bar */}
        <div className="mb-6">
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeCategory === "All" ? "Featured Listings" : `${activeCategory} Listings`}
            </h2>
            <p className="text-xs text-gray-500">
              {searchTerm
                ? `Showing results matching "${searchTerm}"`
                : "Items available in your immediate neighborhood"}
            </p>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {filteredProducts.length} items
          </span>
        </div>

        {/* Responsive Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
            <p className="text-gray-500 text-sm">
              No items found matching your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Product Details Modal Dialog */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Create Listing Modal Dialog */}
      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateListing={handleCreateListing}
      />

      {/* Sign In / Sign Up Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

export default App;

