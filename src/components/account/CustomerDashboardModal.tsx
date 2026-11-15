import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Package,
  Bell,
  MapPin,
  LogOut,
  Save,
  CheckCircle,
  Truck,
  FileText,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshLocations';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storage';
import { Order, UserNotification } from '../../types';

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
  onTrackOrder: (orderId: string, phone: string) => void;
  initialTab?: 'profile' | 'orders' | 'notifications';
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  isOpen,
  onClose,
  onViewInvoice,
  onTrackOrder,
  initialTab = 'profile',
}) => {
  if (!isOpen) return null;

  const { currentUser, updateProfile, logoutCustomer, addSavedAddress, deleteSavedAddress } = useAuth();
  const { addToCart } = useCart();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'notifications'>(initialTab);

  // Profile Form state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Gaibandha');
  const [upazila, setUpazila] = useState(currentUser?.upazila || 'Palashbari');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Address modal state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Office');
  const [newAddrRecipient, setNewAddrRecipient] = useState(currentUser?.fullName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.mobileNumber || '');
  const [newAddrDistrict, setNewAddrDistrict] = useState('Dhaka');
  const [newAddrUpazila, setNewAddrUpazila] = useState('Gulshan');
  const [newAddrText, setNewAddrText] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const all = storageService.getOrders();
    if (currentUser) {
      return all.filter((o) => o.userId === currentUser.id || o.customer.email === currentUser.email);
    }
    return all;
  });
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Notifications state
  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    const all = storageService.getNotifications();
    if (currentUser) {
      return all.filter((n) => n.userId === currentUser.id || n.userId === 'all');
    }
    return all;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      district,
      upazila,
      address: address.trim(),
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;
    addSavedAddress({
      label: newAddrLabel,
      recipientName: newAddrRecipient,
      phone: newAddrPhone,
      district: newAddrDistrict,
      upazila: newAddrUpazila,
      address: newAddrText.trim(),
    });
    setShowAddAddress(false);
    setNewAddrText('');
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to cancel order ${orderId}?`)) {
      storageService.updateOrderStatus(orderId, 'cancelled', 'Cancelled by customer from account dashboard');
      setOrders(storageService.getOrders().filter((o) => o.userId === currentUser?.id || o.customer.email === currentUser?.email));
    }
  };

  const handleReorder = (order: Order) => {
    const products = storageService.getProducts();
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.selectedSize, item.selectedColor, item.quantity);
      }
    });
    onClose();
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead(currentUser?.id);
    setNotifications(
      storageService
        .getNotifications()
        .filter((n) => n.userId === currentUser?.id || n.userId === 'all')
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.orderStatus === orderFilter;
  });

  const selectedDistrictData =
    BANGLADESH_DISTRICTS.find((d) => d.district === district) || BANGLADESH_DISTRICTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center text-sm">
              {currentUser?.fullName.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">{currentUser?.fullName}</h2>
              <p className="text-[11px] text-zinc-400">
                {currentUser?.email} · {currentUser?.mobileNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutCustomer();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('logout')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-zinc-100 border-b border-zinc-200 px-6 flex gap-6 text-xs font-bold uppercase tracking-wider shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-[#111111]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <UserIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>{t('profile')}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-[#111111]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {t('orderHistory')} ({orders.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-[#D4AF37] text-[#111111]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Bell className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {t('notifications')} (
              {notifications.filter((n) => !n.read).length})
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* TAB 1: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {profileSavedToast && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <h3 className="font-bold text-zinc-900 text-sm border-b border-zinc-200 pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">
                      Mobile Number (BD)
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">District</label>
                    <select
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        const d = BANGLADESH_DISTRICTS.find((x) => x.district === e.target.value);
                        if (d && d.upazilas.length > 0) setUpazila(d.upazilas[0].en);
                      }}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district} ({d.districtBn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">
                      Upazila / Police Station
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white"
                    >
                      {selectedDistrictData.upazilas.map((u) => (
                        <option key={u.en} value={u.en}>
                          {u.en} ({u.bn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">
                      Primary Street Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Holding no, Road, Area"
                      className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>

              {/* Saved Addresses Section */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900 text-sm">Saved Delivery Addresses</h4>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs text-[#B89628] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleCreateAddress} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Label</label>
                        <input
                          type="text"
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          placeholder="e.g. Office / Atelier"
                          className="w-full text-xs p-2 rounded border bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={newAddrRecipient}
                          onChange={(e) => setNewAddrRecipient(e.target.value)}
                          className="w-full text-xs p-2 rounded border bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Phone</label>
                        <input
                          type="tel"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          className="w-full text-xs p-2 rounded border bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Full Address</label>
                      <input
                        type="text"
                        required
                        value={newAddrText}
                        onChange={(e) => setNewAddrText(e.target.value)}
                        placeholder="House, Road, Block, Sector"
                        className="w-full text-xs p-2 rounded border bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 text-zinc-500 hover:text-zinc-800 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#111111] text-[#D4AF37] font-bold text-xs rounded"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentUser?.savedAddresses || []).map((addr) => (
                    <div key={addr.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded text-[10px] uppercase">
                          {addr.label}
                        </span>
                        <p className="font-semibold text-zinc-800 pt-1">{addr.recipientName} ({addr.phone})</p>
                        <p className="text-zinc-600 text-[11px]">{addr.address}, {addr.upazila}, {addr.district}</p>
                      </div>
                      <button
                        onClick={() => deleteSavedAddress(addr.id)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Order History */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-200">
                {['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      orderFilter === st
                        ? 'bg-[#111111] text-[#D4AF37]'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 space-y-2">
                  <Package className="w-8 h-8 mx-auto text-zinc-300" />
                  <p>No orders found matching this filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-zinc-950 text-sm">{order.id}</span>
                          <span className="text-[11px] text-zinc-400">· {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-800">
                            {order.orderStatus}
                          </span>
                          <span className="font-mono font-bold text-zinc-900">
                            ৳{order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((it) => (
                          <div key={it.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5">
                              <img src={it.image} alt={it.name} className="w-9 h-11 object-cover rounded bg-zinc-200" />
                              <div>
                                <p className="font-semibold text-zinc-900 truncate max-w-xs">{it.name}</p>
                                <p className="text-[11px] text-zinc-500">Size: {it.selectedSize} · Qty: {it.quantity}</p>
                              </div>
                            </div>
                            <span className="font-mono tabular-nums font-semibold">
                              ৳{(it.price * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-zinc-500">
                          Tracking: <span className="font-mono text-[#B89628] font-bold">{order.trackingNumber}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              onTrackOrder(order.id, order.customer.mobileNumber);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-200 text-zinc-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Parcel</span>
                          </button>

                          <button
                            onClick={() => onViewInvoice(order)}
                            className="px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-200 text-zinc-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          <button
                            onClick={() => handleReorder(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-zinc-800 text-[#D4AF37] font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder</span>
                          </button>

                          {order.orderStatus === 'placed' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Notifications Center */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <span className="font-bold text-zinc-900">Notifications ({notifications.length})</span>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#B89628] hover:underline font-semibold cursor-pointer"
                >
                  Mark All as Read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-zinc-300" />
                  <p>You have no notifications at this time.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                        n.read ? 'bg-zinc-50 border-zinc-200' : 'bg-amber-50/50 border-[#D4AF37]/50 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-zinc-900 text-xs">{n.title}</h4>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" title="Unread" />
                          )}
                        </div>
                        <p className="text-zinc-600 leading-relaxed text-xs">{n.message}</p>
                        <span className="text-[10px] text-zinc-400 block pt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          storageService.deleteNotification(n.id);
                          setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                        }}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
