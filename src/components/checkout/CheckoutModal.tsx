import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  PhoneCall,
  CreditCard,
  Truck,
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { storageService } from '../../services/storage';
import { Order, PaymentMethod } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  if (!isOpen) return null;

  const { items, subtotal, discount, deliveryCharge, clearCart } = useCart();
  const { settings } = useSettings();
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '01');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Dhaka');
  const [upazila, setUpazila] = useState(currentUser?.upazila || 'Dhanmondi');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || 'House 14, Road 7, Dhanmondi, Dhaka'
  );
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [senderPhone, setSenderPhone] = useState(currentUser?.mobileNumber || '01');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Find upazilas for selected district
  const selectedDistrictData = BANGLADESH_DISTRICTS.find(
    (d) => d.district.toLowerCase() === district.toLowerCase()
  ) || BANGLADESH_DISTRICTS[0];

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const dData = BANGLADESH_DISTRICTS.find((d) => d.district === newDistrict);
    if (dData && dData.upazilas.length > 0) {
      setUpazila(dData.upazilas[0].en);
    }
  };

  const calculatedDelivery = deliveryCharge(district);
  const grandTotal = Math.max(0, subtotal - discount + calculatedDelivery);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    // BD Phone validation: must start with 01 and be 11 digits
    const cleanPhone = mobileNumber.replace(/\s+/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 11-digit Bangladesh mobile number (e.g., 01341422732).');
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage('Please enter your full street delivery address.');
      return;
    }

    if (paymentMethod !== 'cod' && !transactionId.trim()) {
      setErrorMessage(`Please enter the ${paymentMethod.toUpperCase()} Transaction ID (TrxID) after payment.`);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const orderIdNumber = Math.floor(1000 + Math.random() * 9000);
      const uniqueOrderId = `MNS-2026-${orderIdNumber}`;
      const trackingCode = `STE-MNS-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder: Order = {
        id: uniqueOrderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: currentUser?.id,
        customer: {
          fullName: fullName.trim(),
          mobileNumber: cleanPhone,
          email: email.trim() || 'customer@mnsfashion.com',
          district,
          upazila,
          deliveryAddress: deliveryAddress.trim(),
          notes: notes.trim(),
        },
        items: [...items],
        subtotal,
        deliveryCharge: calculatedDelivery,
        discount,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'verified',
        transactionId: paymentMethod !== 'cod' ? transactionId.trim().toUpperCase() : undefined,
        senderPhone: paymentMethod !== 'cod' ? senderPhone.trim() : undefined,
        orderStatus: 'placed',
        trackingNumber: trackingCode,
        trackingHistory: [
          {
            stage: 'placed',
            title: 'Order Placed Online',
            timestamp: new Date().toISOString(),
            note: `Order booked successfully. Payment method: ${paymentMethod.toUpperCase()}.`,
          },
          {
            stage: 'confirmed',
            title: 'Automated System Verification',
            timestamp: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
            note: 'Order details forwarded to Palashbari processing facility.',
          },
        ],
      };

      // Save to database
      const created = storageService.createOrder(newOrder);

      // Audit log
      storageService.addAuditLog(
        newOrder.customer.fullName,
        newOrder.customer.email,
        'ORDER_CREATED',
        `New order ${newOrder.id} placed for ৳${newOrder.total.toLocaleString()} via ${paymentMethod}`
      );

      clearCart();
      setSubmitting(false);
      onClose();
      onOrderSuccess(created);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#111111] text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center text-xs">
              MNS
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold tracking-wide">
                Bangladesh Express Checkout
              </h2>
              <p className="text-[11px] text-zinc-400">
                Official MNS Fashion Store · Powered by Palashbari Headquarters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Delivery Address (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Details */}
              <div className="space-y-4">
                <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-200 pb-2">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>1. {t('billingDetails')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Ahsan Habib"
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      {t('mobileNumber')} (11 digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="01341422732"
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {t('email')} (For digital invoice)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* District */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      {t('district')} *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district} ({d.districtBn})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      {t('upazila')} *
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {selectedDistrictData.upazilas.map((u) => (
                        <option key={u.en} value={u.en}>
                          {u.en} ({u.bn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {t('deliveryAddress')} *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House/Holding no, Road/Lane name, Area or Bazar, Postal code"
                    className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Order Note / Delivery Instruction (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, ring doorbell twice"
                    className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-4 pt-2">
                <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-200 pb-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  <span>2. Bangladesh Payment Gateway</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                      paymentMethod === 'bkash'
                        ? 'border-[#D12053] bg-pink-50/50 shadow-sm ring-2 ring-[#D12053]/20'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#D12053] tracking-wide">bKash</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Merchant Pay</div>
                    {paymentMethod === 'bkash' && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D12053]" />
                    )}
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                      paymentMethod === 'nagad'
                        ? 'border-[#F7941D] bg-orange-50/50 shadow-sm ring-2 ring-[#F7941D]/20'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#F7941D] tracking-wide">Nagad</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Merchant Pay</div>
                    {paymentMethod === 'nagad' && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F7941D]" />
                    )}
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('rocket')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                      paymentMethod === 'rocket'
                        ? 'border-[#8C3494] bg-purple-50/50 shadow-sm ring-2 ring-[#8C3494]/20'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#8C3494] tracking-wide">Rocket</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">DBBL Rocket</div>
                    {paymentMethod === 'rocket' && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8C3494]" />
                    )}
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                      paymentMethod === 'cod'
                        ? 'border-[#111111] bg-zinc-100 shadow-sm ring-2 ring-black/20'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-zinc-900 tracking-wide">Cash on Delivery</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Pay at Door</div>
                    {paymentMethod === 'cod' && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black" />
                    )}
                  </button>
                </div>

                {/* Method instructions box */}
                {paymentMethod !== 'cod' ? (
                  <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center justify-between text-zinc-900">
                      <span className="font-bold">
                        {paymentMethod.toUpperCase()} Merchant Number:
                      </span>
                      <span className="font-mono font-bold text-sm text-[#D4AF37] bg-black px-2.5 py-0.5 rounded">
                        {settings.paymentGateways[paymentMethod].merchantNumber}
                      </span>
                    </div>

                    <p className="text-zinc-600 leading-relaxed">
                      {settings.paymentGateways[paymentMethod].instructions}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                          Sender Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-700 block mb-1 flex items-center justify-between">
                          <span>{paymentMethod.toUpperCase()} TrxID *</span>
                          <button
                            type="button"
                            onClick={() =>
                              setTransactionId(
                                `${paymentMethod.toUpperCase().slice(0, 2)}${Math.floor(
                                  10000000 + Math.random() * 90000000
                                )}`
                              )
                            }
                            className="text-[10px] text-[#B89628] hover:underline cursor-pointer"
                          >
                            Fill Demo TrxID
                          </button>
                        </label>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g., 9K72J8Q11"
                          className="w-full text-xs uppercase p-2.5 rounded-lg border border-zinc-300 bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-xs text-zinc-700 space-y-1">
                    <p className="font-semibold text-zinc-900">Cash on Delivery Terms:</p>
                    <p className="text-zinc-600 leading-relaxed">
                      {settings.paymentGateways.cod.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Review (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF9F6] border border-zinc-200 rounded-xl p-5 space-y-4">
              <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-wider pb-2 border-b border-zinc-200">
                Order Review ({items.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-zinc-200/60">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded bg-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-zinc-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        Size: {item.selectedSize} · {item.selectedColor.name} · Qty: {item.quantity}
                      </p>
                      <p className="font-mono font-bold text-zinc-900 pt-0.5">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Calculations */}
              <div className="space-y-2 pt-3 border-t border-zinc-200 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">৳{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-৳{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>
                    Delivery ({district.toLowerCase() === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span className="font-mono tabular-nums">
                    {calculatedDelivery === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `৳${calculatedDelivery.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-300">
                  <span>Grand Total</span>
                  <span className="font-mono text-lg text-[#111111] tabular-nums">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-1 text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Official MNS Brand Warranty</span>
                </div>
                <p>Inspected at Palashbari, Gaibandha before courier dispatch.</p>
              </div>

              {/* Confirm Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#D4AF37] hover:bg-[#B89628] disabled:bg-zinc-400 text-[#111111] font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {submitting
                    ? 'Processing Order...'
                    : `Confirm Order (৳${grandTotal.toLocaleString()})`}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
