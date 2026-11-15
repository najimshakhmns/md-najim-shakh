import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    collections: 'Collections',
    aboutUs: 'About Us',
    contact: 'Contact',
    searchPlaceholder: 'Search Panjabi, Hoodies, Shirts, Kurtis...',
    myAccount: 'My Account',
    wishlist: 'Wishlist',
    cart: 'Shopping Cart',
    login: 'Login',
    register: 'Register',
    adminPanel: 'Admin Panel',
    shopNow: 'Shop Now',
    exploreCollection: 'Explore Collection',
    bdtCurrency: '৳',
    freeShippingNotice: 'Free shipping on orders over ৳2,500 across Bangladesh',
    featuredProducts: 'Curated Signatures',
    allProducts: 'All Collections',
    quickView: 'Quick View',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    selectSize: 'Select Size',
    selectColor: 'Select Color',
    quantity: 'Quantity',
    cartSubtotal: 'Subtotal',
    deliveryCharge: 'Delivery Charge',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    emptyCart: 'Your cart is currently empty',
    continueShopping: 'Continue Shopping',
    orderSummary: 'Order Summary',
    billingDetails: 'Delivery Details',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number',
    email: 'Email Address',
    district: 'District',
    upazila: 'Upazila / Area',
    deliveryAddress: 'Full Street Address',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery (COD)',
    bkash: 'bKash Merchant Pay',
    nagad: 'Nagad Merchant Pay',
    rocket: 'Rocket Merchant Pay',
    trxId: 'Transaction ID (TrxID)',
    placeOrder: 'Confirm & Place Order',
    orderTracking: 'Track Order',
    trackOrderTitle: 'Track Your Parcel in Bangladesh',
    trackOrderSub: 'Enter your MNS Order ID and registered phone number to track real-time delivery',
    enterOrderId: 'Order ID (e.g., MNS-2026-8941)',
    enterPhone: 'Registered Phone Number (e.g., 01341422732)',
    trackNow: 'Track Shipment',
    orderHistory: 'My Orders',
    notifications: 'Notifications',
    profile: 'Profile Settings',
    logout: 'Logout',
    founderTitle: 'Founder & Owner',
    founderName: 'MD: Najim Shakh',
    addressGaibandha: 'Palashbari, Gaibandha, Bangladesh',
    contactPhone: '01341422732',
    allRightsReserved: 'All Rights Reserved.',
    tagline: 'Your Style, Your Identity.',
  },
  bn: {
    home: 'হোম',
    men: 'পুরুষ',
    women: 'নারী',
    kids: 'শিশু',
    newArrivals: 'নতুন আগমন',
    bestSellers: 'সেরা বিক্রয়',
    collections: 'কালেকশন',
    aboutUs: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    searchPlaceholder: 'পাঞ্জাবি, হুডি, শার্ট, কুর্তি খুঁজুন...',
    myAccount: 'আমার অ্যাকাউন্ট',
    wishlist: 'পছন্দের তালিকা',
    cart: 'শপিং ব্যাগ',
    login: 'লগইন',
    register: 'রেজিস্টার',
    adminPanel: 'অ্যাডমিন প্যানেল',
    shopNow: 'এখনই কিনুন',
    exploreCollection: 'কালেকশন দেখুন',
    bdtCurrency: '৳',
    freeShippingNotice: '২,৫০০ টাকার অধিক অর্ডারে সারা বাংলাদেশে ফ্রি ডেলিভারি',
    featuredProducts: 'সেরা সিগনেচার কালেকশন',
    allProducts: 'সকল পোশাক',
    quickView: 'একনজরে দেখুন',
    addToCart: 'ব্যাগে যুক্ত করুন',
    buyNow: 'এখনই কিনুন',
    inStock: 'স্টকে আছে',
    outOfStock: 'স্টক শেষ',
    selectSize: 'সাইজ নির্বাচন করুন',
    selectColor: 'কালার নির্বাচন করুন',
    quantity: 'পরিমাণ',
    cartSubtotal: 'সাবটোটাল',
    deliveryCharge: 'ডেলিভারি চার্জ',
    total: 'মোট মূল্য',
    checkout: 'অর্ডার সম্পন্ন করুন',
    emptyCart: 'আপনার শপিং ব্যাগ খালি রয়েছে',
    continueShopping: 'শপিং চালিয়ে যান',
    orderSummary: 'অর্ডার সারাংশ',
    billingDetails: 'ডেলিভারির ঠিকানা',
    fullName: 'আপনার পূর্ণ নাম',
    mobileNumber: 'মোবাইল নম্বর',
    email: 'ইমেইল অ্যাড্রেস',
    district: 'জেলা',
    upazila: 'উপজেলা / এলাকা',
    deliveryAddress: 'পূর্ণ ডেলিভারি ঠিকানা',
    paymentMethod: 'পেমেন্ট মাধ্যম',
    cashOnDelivery: 'ক্যাশ অন ডেলিভারি (ক্যাশ পেয়ে টাকা)',
    bkash: 'বিকাশ মার্চেন্ট পেমেন্ট',
    nagad: 'নগদ মার্চেন্ট পেমেন্ট',
    rocket: 'রকেট মার্চেন্ট পেমেন্ট',
    trxId: 'ট্রানজেকশন আইডি (TrxID)',
    placeOrder: 'অর্ডার কনফার্ম করুন',
    orderTracking: 'অর্ডার ট্র্যাকিং',
    trackOrderTitle: 'আপনার পার্সেল ট্র্যাক করুন',
    trackOrderSub: 'রিয়েল-টাইম ডেলিভারি তথ্য পেতে অর্ডার আইডি এবং ফোন নম্বর দিন',
    enterOrderId: 'অর্ডার আইডি (যেমন: MNS-2026-8941)',
    enterPhone: 'রেজিস্টার্ড ফোন নম্বর (যেমন: 01341422732)',
    trackNow: 'পার্সেল খুঁজুন',
    orderHistory: 'আমার অর্ডারসমূহ',
    notifications: 'নোটিফিকেশন',
    profile: 'প্রোফাইল সেটিংস',
    logout: 'লগআউট',
    founderTitle: 'প্রতিষ্ঠাতা ও স্বত্বাধিকারী',
    founderName: 'মোঃ নাজিম শাখ',
    addressGaibandha: 'পলাশবাড়ী, গাইবান্ধা, বাংলাদেশ',
    contactPhone: '০১৩৪১৪২২৭৩২',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
    tagline: 'আপনার স্টাইল, আপনার পরিচয়।',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mns_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mns_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const t = (key: string, defaultText?: string): string => {
    return translations[language][key] || defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
