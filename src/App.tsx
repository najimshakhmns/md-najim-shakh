import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  Heart,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { CustomerDashboardModal } from './components/account/CustomerDashboardModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { Hero } from './components/home/Hero';
import { PolicyModal, PolicyType } from './components/info/PolicyModal';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { OrderConfirmationModal } from './components/orders/OrderConfirmationModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { ProductCard } from './components/products/ProductCard';
import { ProductDetailsModal } from './components/products/ProductDetailsModal';
import { ProductQuickViewModal } from './components/products/ProductQuickViewModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { storageService } from './services/storage';
import { Order, Product, ProductColor } from './types';

function MainStorefront() {
  const { settings } = useSettings();
  const { language, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const { setIsCartOpen, quickViewProduct, setQuickViewProduct } = useCart();

  // Catalog State
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState(() => storageService.getCategories());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');
  const [priceRange, setPriceRange] = useState<number>(5000);

  // Modals Open State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<'profile' | 'orders' | 'notifications'>('profile');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialOrderId, setTrackingInitialOrderId] = useState('');
  const [trackingInitialPhone, setTrackingInitialPhone] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; type: PolicyType }>({
    isOpen: false,
    type: 'about',
  });
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Filter Products
  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return p.salePrice <= priceRange;
    if (activeCategory === 'new-arrivals') return p.isNewArrival && p.salePrice <= priceRange;
    if (activeCategory === 'best-sellers') return p.isBestSeller && p.salePrice <= priceRange;
    return (
      (p.category.toLowerCase() === activeCategory.toLowerCase() ||
        (p.subcategory && p.subcategory.toLowerCase().includes(activeCategory.toLowerCase()))) &&
      p.salePrice <= priceRange
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.salePrice - b.salePrice;
    if (sortBy === 'priceDesc') return b.salePrice - a.salePrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.featured ? 1 : -1;
  });

  // Direct checkout bypass from quick view or product details
  const handleDirectCheckout = (
    _prod: Product,
    _size: string,
    _color: ProductColor,
    _qty: number
  ) => {
    setIsCheckoutOpen(true);
  };

  const handleOpenTrackingWithOrder = (orderId: string, phone: string) => {
    setTrackingInitialOrderId(orderId);
    setTrackingInitialPhone(phone);
    setIsTrackingOpen(true);
  };

  const notifications = storageService.getNotifications();
  const unreadCount = notifications.filter(
    (n) => !n.read && (currentUser ? n.userId === currentUser.id || n.userId === 'all' : n.userId === 'all')
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans">
      {/* 1. Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => {
          setAccountInitialTab('profile');
          setIsAccountOpen(true);
        }}
        onOpenTracking={() => {
          setTrackingInitialOrderId('');
          setTrackingInitialPhone('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onOpenNotifications={() => {
          setAccountInitialTab('notifications');
          setIsAccountOpen(true);
        }}
        unreadNotifCount={unreadCount}
      />

      {/* 2. Hero Section */}
      <Hero
        onShopNow={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreCollection={() => {
          setActiveCategory('panjabi');
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Category Highlights Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
              {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'CURATED DOMAINS'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
              {language === 'bn' ? 'ফ্যাশন কালেকশন' : 'The Signature Categories'}
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory('all');
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-zinc-700 hover:text-[#B89628] flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.slug);
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${
                activeCategory === cat.slug
                  ? 'border-[#D4AF37] bg-white shadow-md ring-2 ring-[#D4AF37]/20'
                  : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-sm'
              }`}
            >
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-zinc-100 mb-3 shadow-inner">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#B89628] transition-colors truncate w-full">
                {language === 'bn' ? cat.nameBn : cat.name}
              </h4>
              <span className="text-[10px] text-zinc-400 mt-0.5">{cat.itemCount} Items</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Main Product Catalog & Filter Bar */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        {/* Section Heading & Filter Header */}
        <div className="border-b border-zinc-200 pb-5 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
              {language === 'bn' ? 'এক্সক্লুসিভ পোশাক' : 'THE LUXURY WARDROBE'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
              {activeCategory === 'all'
                ? t('allProducts')
                : categories.find((c) => c.slug === activeCategory)?.name || activeCategory.toUpperCase()}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Showing {sortedProducts.length} verified pieces crafted with distinction
            </p>
          </div>

          {/* Controls: Segmented Category Buttons + Price + Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium p-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-800 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>

            {/* Quick Price Threshold Slider */}
            <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-zinc-300 text-xs">
              <span className="text-zinc-500">Max:</span>
              <span className="font-mono font-bold text-zinc-900 tabular-nums">৳{priceRange}</span>
              <input
                type="range"
                min="1000"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-20 accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 space-y-3">
            <p className="text-sm font-semibold text-zinc-700">
              No garments found matching the selected filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setPriceRange(5000);
              }}
              className="px-5 py-2 rounded-full bg-[#111111] text-[#D4AF37] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Brand Heritage & Atelier Story Section */}
      <section className="bg-[#111111] text-white py-16 px-4 sm:px-8 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 aspect-[4/3] bg-zinc-900 shadow-2xl">
              <img
                src="/src/assets/images/hero_mns_fashion_1794462653823.jpg"
                alt="Palashbari Atelier"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#181818] border border-[#D4AF37]/50 p-4 rounded-xl shadow-xl hidden sm:block">
              <p className="font-serif text-xs font-bold text-[#D4AF37]">Palashbari, Gaibandha</p>
              <p className="text-[10px] text-zinc-400">Headquarters of MNS Craftsmanship</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
              THE FOUNDER'S VISION
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Crafted in Bangladesh. <br />
              <span className="text-[#D4AF37] italic font-normal">Revered Worldwide.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Founded by <strong>{settings.founderName}</strong> in <strong>{settings.businessAddress}</strong>,
              MNS Fashion Brand was born from the belief that authentic Bangladeshi heritage craftsmanship
              deserves to stand side-by-side with global high fashion.
            </p>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Every drop is developed through rigorous pattern drafting, bespoke fabric dyeing, and double-needle
              stitching. When you wear MNS, you wear confidence, identity, and prestige.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setPolicyModal({ isOpen: true, type: 'about' })}
                className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Read Founder Story
              </button>
              <button
                onClick={() => setPolicyModal({ isOpen: true, type: 'shipping' })}
                className="px-6 py-3 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Delivery Guidelines
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPolicy={(type) => setPolicyModal({ isOpen: true, type })}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODALS */}
      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={(p) => setSelectedProduct(p)}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* Full Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setConfirmedOrder(order)}
      />

      {/* Order Confirmation & Printable Invoice */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleOpenTrackingWithOrder}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingInitialOrderId}
        initialPhone={trackingInitialPhone}
      />

      {/* Customer Account Dashboard Modal */}
      <CustomerDashboardModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onViewInvoice={(o) => setConfirmedOrder(o)}
        onTrackOrder={handleOpenTrackingWithOrder}
        initialTab={accountInitialTab}
      />

      {/* Auth Modal (Login / Register / Forgot Password OTP) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAdminSwitch={() => {
          setIsAuthOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Admin Command Console */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => {
            setIsAdminOpen(false);
            setProducts(storageService.getProducts());
            setCategories(storageService.getCategories());
          }}
          onViewInvoice={(o) => setConfirmedOrder(o)}
        />
      )}

      {/* Policy Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        type={policyModal.type}
        onClose={() => setPolicyModal({ isOpen: false, type: 'about' })}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <MainStorefront />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}
