import React from 'react';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickView }) => {
  const { language, t } = useLanguage();
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use first available size and color
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#111111' };
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-zinc-200 hover:border-[#D4AF37]/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow'
              : 'bg-white/80 text-zinc-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Discount Tag */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-[#111111] text-[#D4AF37] border border-[#D4AF37]/50 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
            -{product.discountPercentage}% OFF
          </div>
        )}

        {/* Floating Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-zinc-900 text-xs font-semibold py-2.5 px-3 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-600" />
            <span>{t('quickView')}</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className="bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] p-2.5 rounded-lg shadow-md transition-colors cursor-pointer"
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-wider mb-1 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.material.split(',')[0]}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-[#B89628] transition-colors line-clamp-2 leading-snug">
            {language === 'bn' ? product.nameBn : product.name}
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-zinc-950 font-mono tabular-nums">
              ৳{product.salePrice.toLocaleString()}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xs text-zinc-400 line-through font-mono tabular-nums">
                ৳{product.regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Product Rating */}
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span className="font-semibold text-zinc-800 tabular-nums">{product.rating}</span>
            <span className="text-[10px] text-zinc-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Available Color Swatches Preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-zinc-300 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[10px] text-zinc-400 ml-1">
              {product.sizes.length} sizes
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
