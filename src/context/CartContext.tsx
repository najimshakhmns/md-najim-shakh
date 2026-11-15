import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductColor } from '../types';
import { useSettings } from './SettingsContext';

interface CartContextType {
  items: CartItem[];
  wishlist: string[]; // product IDs
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  subtotal: number;
  deliveryCharge: (district: string) => number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem('mns_cart_items_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    // Default initial luxury item in cart for quick inspection
    return [
      {
        id: 'prod-001-42-Onyx Black',
        productId: 'prod-001',
        name: 'Royal Heritage Onyx Panjabi with Gold Zari Collar',
        nameBn: 'রয়্যাল হেরিটেজ ওনিক্স পাঞ্জাবি (গোল্ড জরি কাজ)',
        price: 3200,
        regularPrice: 3850,
        image: '/src/assets/images/product_panjabi_royal_1794462654499.jpg',
        selectedSize: '42',
        selectedColor: { name: 'Onyx Black', hex: '#111111' },
        quantity: 1,
        stock: 24,
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const raw = localStorage.getItem('mns_wishlist_items_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    return ['prod-002'];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountFlat, setDiscountFlat] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('mns_cart_items_v1', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('mns_wishlist_items_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    const itemId = `${product.id}-${size}-${color.name}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item
        );
      }
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        nameBn: product.nameBn,
        price: product.salePrice,
        regularPrice: product.regularPrice,
        image: product.images[0] || '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
        selectedSize: size,
        selectedColor: color,
        quantity,
        stock: product.stock,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.min(newQty, item.stock) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
    setDiscountFlat(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryCharge = (district: string) => {
    if (subtotal === 0) return 0;
    if (subtotal >= settings.deliveryCharges.freeShippingThreshold) return 0;
    const isDhaka = district.trim().toLowerCase() === 'dhaka';
    return isDhaka ? settings.deliveryCharges.insideDhaka : settings.deliveryCharges.outsideDhaka;
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MNS10' || clean === 'MNSGOLD') {
      setCouponCode(clean);
      setDiscountPercent(10);
      setDiscountFlat(0);
      return { success: true, message: 'Coupon applied! 10% discount on order.' };
    }
    if (clean === 'NAJIM100') {
      setCouponCode(clean);
      setDiscountFlat(100);
      setDiscountPercent(0);
      return { success: true, message: 'Coupon applied! ৳100 flat discount.' };
    }
    return { success: false, message: 'Invalid promotional code. Try MNSGOLD or NAJIM100.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setDiscountFlat(0);
  };

  const discount = Math.round(
    discountFlat > 0 ? discountFlat : (subtotal * discountPercent) / 100
  );

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        subtotal,
        deliveryCharge,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
