import React from 'react';
import { CheckCircle2, Printer, MapPin, Package, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { Order } from '../../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string, phone: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  const { settings } = useSettings();
  const { language, t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[90vh] flex flex-col print:max-h-none print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111111] text-white p-6 text-center relative border-b border-zinc-800 print:bg-white print:text-black">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Order Confirmed!
          </h2>
          <p className="text-xs text-zinc-300 mt-1">
            Thank you for shopping with MNS Fashion Brand. Your order is being prepared with care.
          </p>

          <div className="inline-block mt-3 px-4 py-1.5 bg-[#1C1C1C] rounded-full border border-zinc-700 text-xs font-mono">
            <span className="text-zinc-400">Order ID: </span>
            <span className="text-[#D4AF37] font-bold">{order.id}</span>
          </div>
        </div>

        {/* Invoice / Details Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-zinc-700">
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF9F6] rounded-xl border border-zinc-200 text-center">
            <div>
              <p className="text-zinc-400 font-medium">Order Date</p>
              <p className="font-bold text-zinc-900 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 font-medium">Tracking Code</p>
              <p className="font-bold font-mono text-[#D4AF37] mt-0.5">
                {order.trackingNumber}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 font-medium">Payment Method</p>
              <p className="font-bold uppercase text-zinc-900 mt-0.5">
                {order.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 font-medium">Payment Status</p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                  order.paymentStatus === 'verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="border border-zinc-200 rounded-xl p-4 space-y-1 bg-white">
            <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Delivery Recipient & Destination</span>
            </h4>
            <p className="font-semibold text-zinc-800 pt-1">
              {order.customer.fullName} ({order.customer.mobileNumber})
            </p>
            <p className="text-zinc-600">
              {order.customer.deliveryAddress}, {order.customer.upazila}, {order.customer.district}, Bangladesh
            </p>
            {order.customer.notes && (
              <p className="text-zinc-500 italic pt-1">Note: "{order.customer.notes}"</p>
            )}
          </div>

          {/* Purchased Items */}
          <div className="space-y-3">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Purchased Garments ({order.items.length})</span>
            </h4>
            <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded bg-zinc-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-zinc-900">{item.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        Size: {item.selectedSize} · Color: {item.selectedColor.name} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 tabular-nums">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 bg-[#FAF9F6] p-4 rounded-xl border border-zinc-200">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono tabular-nums">৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-mono tabular-nums">-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-mono tabular-nums">
                {order.deliveryCharge === 0 ? 'FREE' : `৳${order.deliveryCharge.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-300">
              <span>Total Paid / Payable:</span>
              <span className="font-mono text-base text-[#111111] tabular-nums">
                ৳{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Palashbari Headquarters Note */}
          <div className="text-center text-zinc-500 text-[11px] pt-1">
            <p className="font-semibold text-zinc-700">{settings.companyName}</p>
            <p>Founder & Owner: {settings.founderName} · Helpline: {settings.contactNumber}</p>
            <p>{settings.businessAddress}</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-zinc-200 bg-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.id, order.customer.mobileNumber);
              }}
              className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-zinc-800 text-[#D4AF37] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Track Parcel</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
