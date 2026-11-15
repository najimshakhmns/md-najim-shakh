import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle,
  Clock,
  Truck,
  Package,
  MapPin,
  AlertCircle,
  Calendar,
  Building,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storage';
import { Order, OrderStage } from '../../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  initialPhone?: string;
}

const STAGES_CONFIG: { stage: OrderStage; label: string; labelBn: string; step: number }[] = [
  { stage: 'placed', label: 'Order Placed', labelBn: 'অর্ডার গ্রহণ', step: 1 },
  { stage: 'confirmed', label: 'Order Confirmed', labelBn: 'অর্ডার নিশ্চিতকরণ', step: 2 },
  { stage: 'processing', label: 'Processing at Atelier', labelBn: 'প্রসেসিং সম্পন্ন', step: 3 },
  { stage: 'ready_to_ship', label: 'Ready to Ship', labelBn: 'শিপিংয়ের জন্য প্রস্তুত', step: 4 },
  { stage: 'shipped', label: 'Shipped (In Transit)', labelBn: 'কুরিয়ারে পাঠানো হয়েছে', step: 5 },
  { stage: 'out_for_delivery', label: 'Out for Delivery', labelBn: 'ডেলিভারিতে বের হয়েছে', step: 6 },
  { stage: 'delivered', label: 'Delivered', labelBn: 'সফলভাবে ডেলিভারি', step: 7 },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  initialPhone = '',
}) => {
  if (!isOpen) return null;

  const { language, t } = useLanguage();

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || 'MNS-2026-8941');
  const [phoneInput, setPhoneInput] = useState(initialPhone || '01711002233');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      const orders = storageService.getOrders();
      return orders.find((o) => o.id.toLowerCase() === initialOrderId.trim().toLowerCase()) || null;
    }
    // Default show first demo order for instant review
    const orders = storageService.getOrders();
    return orders[0] || null;
  });
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');

    if (!orderIdInput.trim()) {
      setSearchError('Please provide your Order ID (e.g. MNS-2026-8941).');
      return;
    }

    const cleanId = orderIdInput.trim().toUpperCase();
    const cleanPhone = phoneInput.trim().replace(/\s+/g, '');

    const orders = storageService.getOrders();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === cleanId &&
        (cleanPhone ? o.customer.mobileNumber.replace(/\s+/g, '') === cleanPhone : true)
    );

    if (found) {
      setMatchedOrder(found);
    } else {
      setMatchedOrder(null);
      setSearchError(`No verified order found with ID "${cleanId}". Please check your order confirmation SMS or receipt.`);
    }
  };

  const getStageIndex = (stage: OrderStage) => {
    if (stage === 'cancelled') return -1;
    return STAGES_CONFIG.findIndex((s) => s.stage === stage);
  };

  const currentStageIndex = matchedOrder ? getStageIndex(matchedOrder.orderStatus) : -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold">
                {t('trackOrderTitle')}
              </h2>
              <p className="text-[11px] text-zinc-400">
                Palashbari Central Dispatch · Steadfast & RedX Courier Logistics
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

        {/* Tracking Search Form */}
        <div className="p-6 bg-[#FAF9F6] border-b border-zinc-200">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="MNS-2026-8941"
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white uppercase font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Registered Phone Number
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-zinc-800 text-[#D4AF37] text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </div>
          </form>

          {searchError && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Tracking Details & Stages Timeline */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {matchedOrder ? (
            <div className="space-y-6">
              {/* Order Quick Summary Card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Active Consignment
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-sm text-zinc-950">
                      {matchedOrder.id}
                    </span>
                    <span className="font-mono text-[11px] text-[#D4AF37] bg-black px-2 py-0.5 rounded">
                      {matchedOrder.trackingNumber}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Recipient & Hub
                  </span>
                  <p className="font-bold text-zinc-900 mt-0.5">
                    {matchedOrder.customer.fullName} · {matchedOrder.customer.upazila},{' '}
                    {matchedOrder.customer.district}
                  </p>
                </div>
              </div>

              {/* 7-Stage Horizontal / Vertical Stepper */}
              <div>
                <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-xs mb-4">
                  Logistics Milestones (7-Stage Tracking)
                </h4>

                <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-zinc-200">
                  {STAGES_CONFIG.map((stageConfig, index) => {
                    const isPassed = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const matchingHistoryItem = matchedOrder.trackingHistory.find(
                      (h) => h.stage === stageConfig.stage
                    );

                    return (
                      <div key={stageConfig.stage} className="relative">
                        {/* Dot / Icon */}
                        <div
                          className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCurrent
                              ? 'bg-[#D4AF37] border-[#111111] text-black shadow-md ring-4 ring-[#D4AF37]/20 scale-110'
                              : isPassed
                              ? 'bg-zinc-900 border-zinc-900 text-[#D4AF37]'
                              : 'bg-white border-zinc-300 text-zinc-300'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle className="w-3.5 h-3.5 fill-current text-white" />
                          ) : (
                            <span className="text-[10px] font-mono font-bold">{stageConfig.step}</span>
                          )}
                        </div>

                        {/* Stage Info */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold text-xs uppercase tracking-wide ${
                                isCurrent
                                  ? 'text-zinc-950 font-extrabold'
                                  : isPassed
                                  ? 'text-zinc-800'
                                  : 'text-zinc-400'
                              }`}
                            >
                              {stageConfig.step}. {stageConfig.label}
                            </span>
                            {matchingHistoryItem && (
                              <span className="text-[10px] font-mono text-zinc-400">
                                {new Date(matchingHistoryItem.timestamp).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {matchingHistoryItem ? (
                            <p className="text-zinc-600 bg-zinc-50 border border-zinc-100 p-2.5 rounded-lg text-xs leading-relaxed">
                              {matchingHistoryItem.note}
                              {matchingHistoryItem.location && (
                                <span className="block text-[11px] font-medium text-[#D4AF37] mt-0.5">
                                  Location: {matchingHistoryItem.location}
                                </span>
                              )}
                            </p>
                          ) : isPassed ? (
                            <p className="text-zinc-400 text-[11px]">Milestone completed.</p>
                          ) : (
                            <p className="text-zinc-300 text-[11px]">Pending verification.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Package Content Preview */}
              <div className="border-t border-zinc-200 pt-4 space-y-2">
                <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-xs">
                  Parcel Contents ({matchedOrder.items.length} items)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchedOrder.items.map((it) => (
                    <div key={it.id} className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded bg-white" />
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 truncate text-xs">{it.name}</p>
                        <p className="text-[11px] text-zinc-500">
                          Size {it.selectedSize} · Qty {it.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <Package className="w-10 h-10 mx-auto text-zinc-300" />
              <p className="text-xs font-semibold text-zinc-600">
                Enter your Order ID above to view live logistics status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
