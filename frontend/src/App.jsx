import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ProductCard } from "./components/ProductCard";
import { CategoryFilter } from "./components/CategoryFilter";
import { SearchBar } from "./components/SearchBar";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { CreateListingModal } from "./components/CreateListingModal";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { mockProducts } from "./data/mockProducts";
import { mockNeeds } from "./data/mockNeeds";
import { NeedsBoard } from "./components/NeedsBoard";
import { CreateNeedModal } from "./components/CreateNeedModal";
import { SellerProfileModal } from "./components/SellerProfileModal";
import { UserDashboardModal } from "./components/UserDashboardModal";
import { FloatingContact } from "./components/FloatingContact";

const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Vehicles",
  "Clothing",
  "Hostel Needs",
  "Rentals",
  "Donations",
];

function App() {
  const [products, setProducts] = useState(mockProducts);
  const [needs, setNeeds] = useState(mockNeeds);
  const [activeTab, setActiveTab] = useState("marketplace"); // "marketplace" or "needs"
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateNeedOpen, setIsCreateNeedOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("nearnest_theme") === "dark";
  });

  // Toggle Dark Mode
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("nearnest_theme", next ? "dark" : "light");
      return next;
    });
  };

  // Sync documentElement class for dark theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Check existing session token on initial mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired session");
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setCurrentUser({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            location: "College Campus / Local Area",
            reliabilityScore: "100%",
            sellerRating: 5.0,
            sellerTrades: 0,
          });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setCurrentUser(null);
      });
  }, []);

  // Fetch real products from backend on page load
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.length > 0) setProducts(data);
      } catch (err) {
        console.log("Using mock data — backend not available:", err.message);
      }
    }
    fetchProducts();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

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

  // Sort products by distance, reliability, or price
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "distance") {
      const distA = parseFloat(a.distance) || 999;
      const distB = parseFloat(b.distance) || 999;
      return distA - distB;
    }
    if (sortBy === "reliability") {
      const scoreA = parseFloat(a.reliabilityScore) || 0;
      const scoreB = parseFloat(b.reliabilityScore) || 0;
      return scoreB - scoreA;
    }
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchTerm("");
    setSortBy("default");
  };

  const handleCreateListing = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleDeleteListing = (id) => {
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleCreateNeed = (newNeed) => {
    setNeeds([newNeed, ...needs]);
  };

  const handleNavSelect = (item) => {
    if (item === "I Need This") {
      setActiveTab("needs");
    } else {
      setActiveTab("marketplace");
      setActiveCategory(item);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50/50 text-gray-900"
      }`}
    >
      <Navbar
        onOpenCreateListing={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onSelectCategory={handleNavSelect}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Hyperlocal Circular Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm sm:text-base mb-6">
            Discover books, electronics, tools, cycles, and household essentials available right now from neighbors nearby.
          </p>

          {/* Interactive Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </section>

        {/* Marketplace vs I Need This View Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-gray-200/80 dark:bg-gray-800 rounded-2xl border border-transparent dark:border-gray-700">
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "marketplace"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Browse Items ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("needs")}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "needs"
                  ? "bg-[#FFB703] text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              I Need This ({needs.length})
            </button>
          </div>
        </div>

        {activeTab === "needs" ? (
          <NeedsBoard
            needs={needs}
            onOpenCreateNeed={() => setIsCreateNeedOpen(true)}
          />
        ) : (
          <>
            {/* Filter Pills Bar */}
            <div className="mb-6">
              <CategoryFilter
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
            </div>

        {/* Section Header with Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeCategory === "All" ? "Featured Listings" : `${activeCategory} Listings`}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {searchTerm
                ? `Showing results matching "${searchTerm}"`
                : "Items available in your immediate neighborhood"}
            </p>
          </div>

          {/* Sort Dropdown & Items Count */}
          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            <label htmlFor="sort-select" className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 cursor-pointer shadow-2xs hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <option value="default">Featured</option>
              <option value="distance">📍 Nearest First</option>
              <option value="reliability">⭐ Highest Reliability</option>
              <option value="price-low">₹ Price: Low to High</option>
              <option value="price-high">₹ Price: High to Low</option>
            </select>
            <span className="text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60">
              {sortedProducts.length} items
            </span>
          </div>
        </div>

        {/* Responsive Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={setSelectedProduct}
                onSelectSeller={setSelectedSeller}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700 p-8 shadow-xs">
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              No items found matching your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-200 dark:border-amber-800/60"
            >
              Clear All Filters
            </button>
          </div>
        )}
        </>
      )}
      </main>

      {/* Product Details Modal Dialog */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onViewSeller={setSelectedSeller}
      />

      {/* Seller Profile & Reliability Score Modal */}
      <SellerProfileModal
        seller={selectedSeller}
        isOpen={!!selectedSeller}
        onClose={() => setSelectedSeller(null)}
      />

      {/* User & Seller Profile Dashboard Modal */}
      <UserDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentUser={currentUser}
        products={products}
        onOpenCreateListing={() => setIsCreateModalOpen(true)}
        onDeleteListing={handleDeleteListing}
      />

      {/* Create Listing Modal Dialog */}
      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateListing={handleCreateListing}
      />

      {/* Broadcast Need Modal Dialog */}
      <CreateNeedModal
        isOpen={isCreateNeedOpen}
        onClose={() => setIsCreateNeedOpen(false)}
        onCreateNeed={handleCreateNeed}
      />

      {/* Sign In / Sign Up Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* Page Footer */}
      <Footer />

      {/* Floating Help & Safety Support Button */}
      <FloatingContact />
    </div>
  );
}

export default App;

