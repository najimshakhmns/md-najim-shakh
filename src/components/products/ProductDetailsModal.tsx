import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Ruler,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storage';
import { Product, ProductColor, ProductReview } from '../../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onDirectCheckout: (product: Product, size: string, color: ProductColor, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onDirectCheckout,
}) => {
  if (!product) return null;

  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#111111' }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'sizeChart' | 'reviews'>('details');
  const [addedToast, setAddedToast] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>(() =>
    storageService.getReviews(product.id)
  );
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    storageService.addReview(newRev);
    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Title and Close */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#111111] px-2.5 py-1 rounded">
              MNS LUXURY
            </span>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 truncate max-w-md">
              {language === 'bn' ? product.nameBn : product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner relative">
                <img
                  src={product.images[activeImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-[#111111] text-[#D4AF37] border border-[#D4AF37] text-xs font-mono font-bold px-3 py-1 rounded-md">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImage === i ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-zinc-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quality Guarantee Box */}
              <div className="bg-[#FAF9F6] border border-amber-200/60 rounded-xl p-4 flex items-center gap-4 text-xs text-zinc-700">
                <Sparkles className="w-6 h-6 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="font-bold text-zinc-900">Crafted in Bangladesh under MD: Najim Shakh</p>
                  <p className="text-zinc-600">
                    Inspected for zero fabric defects, luxury stitch count, and pure gold zari thread work.
                  </p>
                </div>
              </div>
            </div>

            {/* Purchase & Details Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  {product.category} · {product.subcategory || 'Signature Line'}
                </p>
                <h1 className="font-serif text-2xl font-bold text-zinc-900 leading-tight">
                  {language === 'bn' ? product.nameBn : product.name}
                </h1>

                {/* Rating & reviews */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-[#D4AF37]' : 'text-zinc-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-zinc-800">{product.rating}</span>
                  <span className="text-xs text-zinc-500">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-zinc-950 font-mono tabular-nums">
                    ৳{product.salePrice.toLocaleString()}
                  </span>
                  {product.regularPrice > product.salePrice && (
                    <span className="text-sm text-zinc-400 line-through font-mono tabular-nums ml-2">
                      ৳{product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                  In Stock ({product.stock} units)
                </span>
              </div>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 mb-2">
                    <span>Color: {selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                          selectedColor.name === c.name
                            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-110 shadow-sm'
                            : 'border-zinc-300 hover:border-zinc-500'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor.name === c.name && (
                          <Check
                            className={`w-4 h-4 ${
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

              {/* Size Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 mb-2">
                    <span>Size: {selectedSize}</span>
                    <button
                      onClick={() => setActiveTab('sizeChart')}
                      className="text-[#B89628] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#111111] text-[#D4AF37] border-[#111111] shadow-sm'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-zinc-800">Quantity:</span>
                <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-zinc-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="bg-[#111111] hover:bg-zinc-800 text-[#FAF9F6] text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>{addedToast ? 'Added to Bag ✓' : t('addToCart')}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {t('buyNow')}
                  </button>
                </div>
              </div>

              {/* Shipping info checklist */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    <strong>Inside Dhaka:</strong> 24–48 hours (৳70) · <strong>Outside Dhaka:</strong> 2–4 days (৳130)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <span>bKash, Nagad, Rocket, or Cash on Delivery at your door.</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                  <span>7 days exchange guarantee. Helpline: 01341422732.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Section: Description & Specs | Size Guide | Customer Reviews */}
          <div className="pt-6 border-t border-zinc-200">
            <div className="flex items-center gap-6 border-b border-zinc-200 pb-3 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`transition-colors cursor-pointer pb-2 relative ${
                  activeTab === 'details' ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Specifications & Care
                {activeTab === 'details' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('sizeChart')}
                className={`transition-colors cursor-pointer pb-2 relative ${
                  activeTab === 'sizeChart' ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Size Chart
                {activeTab === 'sizeChart' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`transition-colors cursor-pointer pb-2 relative ${
                  activeTab === 'reviews' ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Customer Reviews ({reviews.length})
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>
            </div>

            {/* Tab 1: Details */}
            {activeTab === 'details' && (
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700">
                <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900 text-sm">Product Description</h4>
                  <p className="leading-relaxed font-light">{product.description}</p>
                  <p className="leading-relaxed font-light text-zinc-500">{product.descriptionBn}</p>
                </div>
                <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <h4 className="font-bold text-zinc-900 text-sm">Fabric & Care Details</h4>
                  <p>
                    <strong>Material:</strong> {product.material}
                  </p>
                  <p>
                    <strong>Care Instructions:</strong> {product.careInstructions || 'Dry clean recommended.'}
                  </p>
                  <p>
                    <strong>Origin:</strong> Made in Bangladesh (Gaibandha Atelier)
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Size Chart */}
            {activeTab === 'sizeChart' && (
              <div className="pt-6 space-y-4">
                <p className="text-xs text-zinc-600">
                  All measurements are in inches. Standard Bangladesh executive fitting.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-zinc-200">
                    <thead className="bg-zinc-100 font-bold text-zinc-900">
                      <tr>
                        <th className="p-3 border border-zinc-200">Size Label</th>
                        <th className="p-3 border border-zinc-200">Chest (Inches)</th>
                        <th className="p-3 border border-zinc-200">Length (Inches)</th>
                        <th className="p-3 border border-zinc-200">Sleeve (Inches)</th>
                        <th className="p-3 border border-zinc-200">Collar (Inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 font-mono">
                      <tr>
                        <td className="p-3 border border-zinc-200 font-sans font-bold">38 / S</td>
                        <td className="p-3 border border-zinc-200">38 - 39</td>
                        <td className="p-3 border border-zinc-200">40</td>
                        <td className="p-3 border border-zinc-200">24.5</td>
                        <td className="p-3 border border-zinc-200">15.0</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-zinc-200 font-sans font-bold">40 / M</td>
                        <td className="p-3 border border-zinc-200">40 - 41</td>
                        <td className="p-3 border border-zinc-200">42</td>
                        <td className="p-3 border border-zinc-200">25.0</td>
                        <td className="p-3 border border-zinc-200">15.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-zinc-200 font-sans font-bold">42 / L</td>
                        <td className="p-3 border border-zinc-200">42 - 43</td>
                        <td className="p-3 border border-zinc-200">44</td>
                        <td className="p-3 border border-zinc-200">25.5</td>
                        <td className="p-3 border border-zinc-200">16.0</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-zinc-200 font-sans font-bold">44 / XL</td>
                        <td className="p-3 border border-zinc-200">44 - 45</td>
                        <td className="p-3 border border-zinc-200">45</td>
                        <td className="p-3 border border-zinc-200">26.0</td>
                        <td className="p-3 border border-zinc-200">16.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Reviews List */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-zinc-900 text-sm">Verified Customer Feedback</h4>
                    {reviews.length === 0 ? (
                      <p className="text-xs text-zinc-400">No reviews yet for this product. Be the first to share your experience!</p>
                    ) : (
                      <div className="space-y-3">
                        {reviews.map((r) => (
                          <div key={r.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-zinc-900">{r.userName}</span>
                              <div className="flex items-center text-[#D4AF37]">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < r.rating ? 'fill-[#D4AF37]' : 'text-zinc-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-zinc-700 leading-relaxed">{r.comment}</p>
                            <span className="text-[10px] text-zinc-400 block pt-1">
                              Verified Purchase · {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleSubmitReview} className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-4">
                    <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                      <span>Write a Customer Review</span>
                    </h4>

                    {reviewSubmitted && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                        Thank you! Your verified review has been posted.
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g., Ahsan Habib (Dhaka)"
                        className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Rating</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                      >
                        <option value={5}>★★★★★ (5 - Excellent Luxury Quality)</option>
                        <option value={4}>★★★★☆ (4 - Great Fitting & Fabric)</option>
                        <option value={3}>★★★☆☆ (3 - Average)</option>
                        <option value={2}>★★☆☆☆ (2 - Below Expectations)</option>
                        <option value={1}>★☆☆☆☆ (1 - Poor)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Your Review</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Describe the fabric feel, embroidery, fitting and packaging..."
                        className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#111111] hover:bg-zinc-800 text-[#D4AF37] text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
