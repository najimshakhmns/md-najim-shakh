import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { settings } = useSettings();
  const { language, t } = useLanguage();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(
    null
  );

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.deliveryCharges.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-lg font-bold tracking-wide">
              {t('cart')} ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#FAF9F6] border-b border-zinc-200 px-5 py-3 text-xs">
          <div className="flex items-center justify-between text-zinc-700 font-medium mb-1.5">
            <span className="flex items-center gap-1.5 text-zinc-900">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              {amountNeededForFree > 0
                ? `Add ৳${amountNeededForFree.toLocaleString()} more for FREE Delivery!`
                : 'Congratulations! You unlocked FREE Delivery across Bangladesh!'}
            </span>
            <span className="font-mono font-bold text-[#D4AF37]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Item List Container */}
        <div className="p-5 flex-1 overflow-y-auto divide-y divide-zinc-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-500">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-800">{t('emptyCart')}</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Discover our signature Panjabis, hoodies and shirts designed for confidence and individuality.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#111111] text-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-900 truncate">
                    {language === 'bn' && item.nameBn ? item.nameBn : item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span>Size: {item.selectedSize}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-zinc-300"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      {item.selectedColor.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Stepper */}
                    <div className="flex items-center border border-zinc-200 rounded-md overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-mono font-bold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-900 font-mono tabular-nums">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-[#FAF9F6] space-y-4">
            {/* Promo Code Form */}
            {!couponCode ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. MNSGOLD)"
                    className="w-full text-xs uppercase pl-8 pr-3 py-2 bg-white rounded-lg border border-zinc-300 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs text-emerald-800">
                <span className="font-semibold">Coupon '{couponCode}' Applied (-৳{discount})</span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {couponFeedback && !couponCode && (
              <p
                className={`text-[11px] ${
                  couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {couponFeedback.message}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>{t('cartSubtotal')}</span>
                <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Discount</span>
                  <span className="font-mono font-semibold tabular-nums">-৳{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
                <span>Delivery Charge</span>
                <span>Calculated at Checkout (Free over ৳2,500)</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Estimated Total</span>
                <span className="font-mono text-base text-[#111111] tabular-nums">
                  ৳{(subtotal - discount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] text-xs uppercase tracking-widest font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
