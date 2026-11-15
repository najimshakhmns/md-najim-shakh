import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  MapPin,
  ShieldCheck,
  Globe,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { Product } from '../../types';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (categorySlug: string) => void;
  activeCategory: string;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenNotifications: () => void;
  unreadNotifCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenAccount,
  onOpenTracking,
  onOpenAdmin,
  onSelectCategory,
  activeCategory,
  allProducts,
  onSelectProduct,
  onOpenNotifications,
  unreadNotifCount,
}) => {
  const { settings } = useSettings();
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, adminUser, isAuthenticated } = useAuth();
  const { totalItemCount, wishlist, setIsCartOpen } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchResults = searchQuery.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameBn.includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const navLinks = [
    { label: t('allProducts'), slug: 'all' },
    { label: t('men'), slug: 'men' },
    { label: 'Panjabi', slug: 'panjabi' },
    { label: 'Shirts', slug: 'shirts' },
    { label: 'Streetwear', slug: 'streetwear' },
    { label: t('women'), slug: 'women' },
    { label: t('kids'), slug: 'kids' },
    { label: t('newArrivals'), slug: 'new-arrivals' },
    { label: t('bestSellers'), slug: 'best-sellers' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111111] text-[#FAF9F6] border-b border-[#2A2A2A] shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#181818] border-b border-[#262626] text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <p className="truncate text-zinc-300">
            <span className="text-[#D4AF37] font-medium mr-2">MNS EXCLUSIVE:</span>
            {language === 'bn' ? settings.announcementTextBn : settings.announcementText}
          </p>

          <div className="flex items-center gap-4 shrink-0 text-zinc-400">
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t('orderTracking')}</span>
            </button>

            <span className="text-zinc-600">|</span>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors font-medium whitespace-nowrap cursor-pointer"
              title="Toggle Bangla / English"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            <span className="text-zinc-600">|</span>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#FAF9F6] transition-colors font-medium cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{adminUser ? 'Admin Console' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Left: Brand Identity with Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3.5 group text-left cursor-pointer"
          >
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-[#1A1A1A] shrink-0 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={settings.brandLogo}
                alt="MNS Fashion Brand"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#FAF9F6] block leading-none">
                MNS <span className="text-[#D4AF37]">FASHION</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-zinc-400 block mt-0.5">
                {settings.founderName} · Bangladesh
              </span>
            </div>
          </button>
        </div>

        {/* Center: Live Product Search */}
        <div className="hidden lg:block flex-1 max-w-md relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#1F1F1F] text-sm text-[#FAF9F6] placeholder-zinc-500 pl-10 pr-4 py-2 rounded-full border border-zinc-700 focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Matching Products ({searchResults.length})
              </div>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#252525] transition-colors text-left cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded bg-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{product.name}</p>
                    <p className="text-xs text-[#D4AF37] font-mono tabular-nums">
                      ৳{product.salePrice.toLocaleString()}{' '}
                      <span className="line-through text-zinc-500 text-[10px] ml-1">
                        ৳{product.regularPrice.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions: Notifications, Account, Wishlist, Cart, Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Notifications Center */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-[#111111] text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onSelectCategory('all')}
            className="relative p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors cursor-pointer hidden sm:block"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {isAuthenticated && currentUser ? (
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F1F1F] border border-zinc-700 hover:border-[#D4AF37] transition-colors text-xs font-medium cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#111111] font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline max-w-[100px] truncate text-zinc-200">
                {currentUser.fullName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors text-xs font-medium cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t('login')}</span>
            </button>
          )}

          {/* Cart Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] font-semibold px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-[#D4AF37] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#D4AF37]">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline">{t('cart')}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white lg:hidden cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="hidden lg:block bg-[#161616] border-t border-[#242424] px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 overflow-x-auto py-2.5 text-xs font-medium">
          <div className="flex items-center gap-7 shrink-0">
            {navLinks.map((link) => {
              const isActive = activeCategory === link.slug;
              return (
                <button
                  key={link.slug}
                  onClick={() => onSelectCategory(link.slug)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider text-[11px] font-semibold ${
                    isActive
                      ? 'text-[#D4AF37]'
                      : 'text-zinc-300 hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-zinc-400 font-mono tracking-tight shrink-0 hidden xl:block">
            <span>HELPLINE:</span> <span className="text-[#D4AF37]">{settings.contactNumber}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181818] border-t border-zinc-800 px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#202020] text-sm text-white placeholder-zinc-500 pl-9 pr-3 py-2 rounded-lg border border-zinc-700"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
            {navLinks.map((link) => (
              <button
                key={link.slug}
                onClick={() => {
                  onSelectCategory(link.slug);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === link.slug
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                    : 'text-zinc-300 hover:bg-[#222222]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <button
              onClick={() => {
                onOpenTracking();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 hover:text-[#D4AF37]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t('orderTracking')}</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-[#D4AF37] font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
