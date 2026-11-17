import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ProductCard } from "./components/ProductCard";
import { CategoryFilter } from "./components/CategoryFilter";
import { SearchBar } from "./components/SearchBar";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { CreateListingModal } from "./components/CreateListingModal";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { mockNeeds } from "./data/mockNeeds";
import { NeedsBoard } from "./components/NeedsBoard";
import { CreateNeedModal } from "./components/CreateNeedModal";
import { SellerProfileModal } from "./components/SellerProfileModal";
import { UserDashboardModal } from "./components/UserDashboardModal";
import { FloatingContact } from "./components/FloatingContact";
import { NestBot } from "./components/NestBot";
import { AdminModal } from "./components/AdminModal";
import { getCurrentCoordinates, getDistanceInKm } from "./utils/location";

const CATEGORIES = ["All", "Textbooks", "Electronics", "Vehicles", "Clothing", "Hostel Needs", "Rentals", "Donations"];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700 p-4 space-y-3">
          <div className="aspect-4/3 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2" />
        </div>
      ))}
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [needs, setNeeds] = useState(mockNeeds);
  const [activeTab, setActiveTab] = useState("marketplace"); // "marketplace" | "needs"
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateNeedOpen, setIsCreateNeedOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [buyerCoords, setBuyerCoords] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("nearnest_theme") === "dark");

  // Sync theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("nearnest_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Check auth session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.user) {
          setCurrentUser({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            address: data.user.address || "",
            location: data.user.address || "College Campus / Local Area",
            reliabilityScore: data.user.reliabilityScore || "New Seller",
            sellerRating: data.user.sellerRating || 0,
            sellerTrades: data.user.sellerTrades || 0,
          });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setCurrentUser(null);
      });
  }, []);

  // Fetch catalog products
  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) && setProducts(data))
      .catch((e) => console.error("Product load error:", e.message))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Fetch community needs
  useEffect(() => {
    fetch("/api/needs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) && data.length > 0 && setNeeds(data))
      .catch(() => { });
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // Filter products by category and search keyword
  const filteredProducts = products.filter((p) => {
    const matchCat =
      activeCategory === "All" ||
      (activeCategory === "Rentals" && p.listingType === "rent") ||
      (activeCategory === "Donations" && p.listingType === "donate") ||
      p.category.toLowerCase() === activeCategory.toLowerCase();

    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);

    return matchCat && matchSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "distance") {
      const getDist = (item) => (buyerCoords && item.coordinates?.length === 2)
        ? (getDistanceInKm(buyerCoords.latitude, buyerCoords.longitude, item.coordinates[1], item.coordinates[0]) ?? 999)
        : (parseFloat(item.distance) || 999);
      return getDist(a) - getDist(b);
    }
    if (sortBy === "reliability") return (parseFloat(b.reliabilityScore) || 0) - (parseFloat(a.reliabilityScore) || 0);
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const handleSortChange = async (val) => {
    setSortBy(val);
    if (val === "distance" && !buyerCoords) {
      try { setBuyerCoords(await getCurrentCoordinates()); } catch { }
    }
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchTerm("");
    setSortBy("default");
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
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50/50 text-gray-900"}`}>
      <Navbar
        onOpenCreateListing={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onSelectCategory={handleNavSelect}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Kolkata Campus & Student Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm sm:text-base mb-6">
            Buy, rent, and donate B.Tech engineering textbooks, lab kits, calculators, drafters, cycles, and hostel essentials across Kolkata.
          </p>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </section>

        {/* View Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-gray-200/80 dark:bg-gray-800 rounded-2xl border border-transparent dark:border-gray-700">
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${activeTab === "marketplace" ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white" : "text-gray-600 dark:text-gray-300"
                }`}
            >
              Browse Items ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("needs")}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${activeTab === "needs" ? "bg-[#FFB703] text-gray-900 shadow-xs" : "text-gray-600 dark:text-gray-300"
                }`}
            >
              I Need This ({needs.length})
            </button>
          </div>
        </div>

        {activeTab === "needs" ? (
          <NeedsBoard
            needs={needs}
            onOpenCreateNeed={() => {
              if (!currentUser) return setIsAuthModalOpen(true);
              setIsCreateNeedOpen(true);
            }}
          />
        ) : (
          <>
            {/* Filter Pills */}
            <div className="mb-6">
              <CategoryFilter categories={CATEGORIES} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            </div>

            {/* Header with Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeCategory === "All" ? "Featured Listings" : `${activeCategory} Listings`}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {searchTerm ? `Showing results matching "${searchTerm}"` : "Items available in your immediate neighborhood"}
                </p>
              </div>

              <div className="flex items-center space-x-2.5 self-start sm:self-auto">
                <label htmlFor="sort-select" className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">Sort:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 cursor-pointer shadow-2xs"
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

            {/* Product Grid */}
            {loadingProducts ? (
              <SkeletonGrid />
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onSelect={setSelectedProduct}
                    onSelectSeller={setSelectedSeller}
                    buyerCoords={buyerCoords}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700 p-8 shadow-xs">
                <p className="text-gray-500 dark:text-gray-300 text-sm">No items found matching your filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-3 px-4 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-full hover:bg-amber-100 cursor-pointer border border-amber-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Drawers */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onViewSeller={setSelectedSeller}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <SellerProfileModal
        seller={selectedSeller}
        isOpen={Boolean(selectedSeller)}
        onClose={() => setSelectedSeller(null)}
      />

      <UserDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
        products={products}
        onOpenCreateListing={() => setIsCreateModalOpen(true)}
        onDeleteListing={(id) => setProducts((prev) => prev.filter((p) => p._id !== id))}
      />

      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateListing={(newP) => setProducts((prev) => [newP, ...prev])}
      />

      <CreateNeedModal
        isOpen={isCreateNeedOpen}
        onClose={() => setIsCreateNeedOpen(false)}
        onCreateNeed={(newNeed) => setNeeds((prev) => [newNeed, ...prev])}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <FloatingContact />
      <NestBot />
    </div>
  );
}

export default App;
