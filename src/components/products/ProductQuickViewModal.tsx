import React, { useState } from 'react';
import { X, Star, Check, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product, ProductColor } from '../../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
  onDirectCheckout: (product: Product, size: string, color: ProductColor, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
  onDirectCheckout,
}) => {
  if (!product) return null;

  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#111111' }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    onDirectCheckout(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-zinc-100 text-zinc-700 transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="md:w-1/2 bg-zinc-100 p-6 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-inner">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-[#111111] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold px-2.5 py-1 rounded">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === idx ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Module */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span className="uppercase tracking-wider font-semibold text-[#D4AF37]">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                <span className="font-bold text-zinc-900">{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-zinc-900 leading-tight">
              {language === 'bn' ? product.nameBn : product.name}
            </h2>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums">
                ৳{product.salePrice.toLocaleString()}
              </span>
              {product.regularPrice > product.salePrice && (
                <span className="text-sm text-zinc-400 line-through font-mono tabular-nums">
                  ৳{product.regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description Snippet */}
            <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
              {language === 'bn' ? product.descriptionBn : product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-zinc-800 block mb-1.5">
                  Color: <span className="font-normal text-zinc-600">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor.name === c.name
                          ? 'border-[#D4AF37] scale-110 shadow-sm'
                          : 'border-zinc-300 hover:border-zinc-400'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor.name === c.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.hex === '#FFFFFF' || c.hex.toLowerCase().includes('white')
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-zinc-800 block mb-1.5">
                  Size: <span className="font-normal text-zinc-600">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#111111] text-[#D4AF37] border-[#111111] shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-zinc-900 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-emerald-600 font-medium">
                ✓ {t('inStock')} ({product.stock} units ready in Gaibandha)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-zinc-100">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#111111] hover:bg-zinc-800 text-[#FAF9F6] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>{addedToast ? 'Added to Bag ✓' : t('addToCart')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {t('buyNow')}
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full text-center py-1 text-xs text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
            >
              View Full Specifications, Size Chart & Reviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
