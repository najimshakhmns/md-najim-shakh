import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Settings,
  CreditCard,
  Bell,
  ShieldCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  ArrowUpRight,
  TrendingUp,
  Download,
  LogOut,
  X,
  FileText,
  AlertTriangle,
  History,
  Send,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { storageService } from '../../services/storage';
import {
  AuditLog,
  Category,
  Order,
  OrderStage,
  PaymentGatewayConfig,
  PaymentStatus,
  Product,
  User,
  WebsiteSettings,
} from '../../types';

interface AdminDashboardProps {
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onViewInvoice }) => {
  const { adminUser, loginAdmin, logoutAdmin, isAdminAuthenticated } = useAuth();
  const { settings, updateSettings } = useSettings();

  // Admin login form state if not authenticated
  const [adminEmail, setAdminEmail] = useState('admin@mnsfashion.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'users' | 'payments' | 'website' | 'logs'
  >('overview');

  // Live Data State
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => storageService.getAuditLogs());

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Order Details Modal / Update State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateStatusVal, setUpdateStatusVal] = useState<OrderStage>('confirmed');
  const [statusNoteVal, setStatusNoteVal] = useState('');
  const [updatePaymentVal, setUpdatePaymentVal] = useState<PaymentStatus>('verified');

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    nameBn: '',
    category: 'panjabi',
    regularPrice: 2500,
    salePrice: 1950,
    stock: 20,
    sizes: ['38', '40', '42', '44'],
    colors: [{ name: 'Black', hex: '#111111' }],
    description: '',
    descriptionBn: '',
    material: 'Mercerized Cotton',
    images: ['/src/assets/images/product_panjabi_royal_1794462654499.jpg'],
    featured: true,
  });

  // Website Settings Form State
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>({ ...settings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Broadcast announcement
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastToast, setBroadcastToast] = useState(false);

  // Handle Admin Login
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAdmin(adminEmail, adminPassword);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  // Reload data
  const refreshData = () => {
    setOrders(storageService.getOrders());
    setProducts(storageService.getProducts());
    setUsers(storageService.getUsers());
    setAuditLogs(storageService.getAuditLogs());
  };

  // 1. Order Status Updates
  const handleApplyOrderStatus = () => {
    if (!selectedOrder) return;
    const updated = storageService.updateOrderStatus(
      selectedOrder.id,
      updateStatusVal,
      statusNoteVal || `Status updated to ${updateStatusVal} by admin`,
      { name: adminUser?.fullName || 'Admin', email: adminUser?.email || 'admin@mnsfashion.com' }
    );
    if (updated) {
      setSelectedOrder(updated);
      refreshData();
    }
  };

  const handleApplyOrderPayment = () => {
    if (!selectedOrder) return;
    storageService.updateOrderPayment(selectedOrder.id, updatePaymentVal, {
      name: adminUser?.fullName || 'Admin',
      email: adminUser?.email || 'admin@mnsfashion.com',
    });
    refreshData();
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: updatePaymentVal });
    }
  };

  // 2. Product Save (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingProduct;
    const discount =
      prodForm.regularPrice && prodForm.salePrice && prodForm.regularPrice > prodForm.salePrice
        ? Math.round(((prodForm.regularPrice - prodForm.salePrice) / prodForm.regularPrice) * 100)
        : 0;

    const targetProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodForm.name || 'New MNS Product',
      nameBn: prodForm.nameBn || prodForm.name || 'নতুন পোশাক',
      slug: (prodForm.name || 'new-product').toLowerCase().replace(/\s+/g, '-'),
      category: prodForm.category || 'panjabi',
      regularPrice: Number(prodForm.regularPrice) || 2000,
      salePrice: Number(prodForm.salePrice) || 1800,
      discountPercentage: discount,
      stock: Number(prodForm.stock) || 10,
      sizes: prodForm.sizes || ['M', 'L', 'XL'],
      colors: prodForm.colors || [{ name: 'Black', hex: '#111111' }],
      description: prodForm.description || '',
      descriptionBn: prodForm.descriptionBn || '',
      material: prodForm.material || 'Premium Fabric',
      images: prodForm.images && prodForm.images.length > 0
        ? prodForm.images
        : ['/src/assets/images/product_panjabi_royal_1794462654499.jpg'],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      featured: prodForm.featured ?? true,
      isNewArrival: true,
      isBestSeller: false,
    };

    if (isNew) {
      storageService.addProduct(targetProduct, {
        name: adminUser?.fullName || 'Admin',
        email: adminUser?.email || 'admin@mnsfashion.com',
      });
    } else {
      storageService.updateProduct(targetProduct, {
        name: adminUser?.fullName || 'Admin',
        email: adminUser?.email || 'admin@mnsfashion.com',
      });
    }

    setShowProductModal(false);
    setEditingProduct(null);
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Delete this product permanently from the catalog?')) {
      storageService.deleteProduct(id, {
        name: adminUser?.fullName || 'Admin',
        email: adminUser?.email || 'admin@mnsfashion.com',
      });
      refreshData();
    }
  };

  // 3. User toggle status
  const handleToggleUserStatus = (u: User) => {
    const updatedStatus = u.status === 'active' ? 'suspended' : 'active';
    const updated: User = { ...u, status: updatedStatus };
    storageService.updateUser(updated);
    storageService.addAuditLog(
      adminUser?.fullName || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'USER_STATUS_CHANGE',
      `Changed user ${u.email} status to ${updatedStatus.toUpperCase()}`
    );
    refreshData();
  };

  // 4. Save Website Settings
  const handleSaveWebsiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm, {
      name: adminUser?.fullName || 'Admin',
      email: adminUser?.email || 'admin@mnsfashion.com',
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
    refreshData();
  };

  // 5. Send Broadcast Announcement
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      userId: 'all',
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      type: 'announcement',
      read: false,
      createdAt: new Date().toISOString(),
    });
    storageService.addAuditLog(
      adminUser?.fullName || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'BROADCAST_ANNOUNCEMENT',
      `Dispatched announcement: "${broadcastTitle}" to all customers.`
    );
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastToast(true);
    setTimeout(() => setBroadcastToast(false), 3000);
    refreshData();
  };

  // Export Sales Report JSON
  const handleExportData = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      company: settings.companyName,
      founder: settings.founderName,
      totalRevenue: orders.reduce((sum, o) => sum + (o.paymentStatus === 'verified' ? o.total : 0), 0),
      totalOrders: orders.length,
      orders,
      products,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MNS-Sales-Report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculations for Overview
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === 'verified' || o.orderStatus === 'delivered' ? o.total : 0),
    0
  );
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'placed').length;
  const processingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'confirmed' || o.orderStatus === 'processing'
  ).length;
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.orderStatus === 'cancelled').length;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  // If NOT authenticated as admin, show Admin Login Box
  if (!isAdminAuthenticated || !adminUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
        <div className="relative w-full max-w-md bg-[#161616] text-white rounded-2xl shadow-2xl border border-zinc-800 p-8 space-y-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] p-1 mx-auto overflow-hidden bg-black">
              <img
                src={settings.brandLogo}
                alt="MNS Admin"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight">
              MNS Command Console
            </h2>
            <p className="text-xs text-zinc-400">
              Admin & Operations Portal · Palashbari Headquarters
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-zinc-700 bg-[#202020] text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">
                Master Security Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-zinc-700 bg-[#202020] text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Authenticate & Enter
            </button>

            <div className="pt-2 text-center text-[11px] text-zinc-500">
              Founder & Superadmin: <span className="text-[#D4AF37]">MD: Najim Shakh</span> (Palashbari)
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0F0F0F] text-zinc-100 overflow-hidden">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#161616] border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full border border-[#D4AF37] overflow-hidden bg-black p-0.5">
            <img src={settings.brandLogo} alt="MNS" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span>MNS FASHION</span>
              <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                ADMIN CONSOLE
              </span>
            </h1>
            <p className="text-[11px] text-zinc-400">
              Operator: {adminUser.fullName} ({adminUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            title="Export JSON Sales & Order Report"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Return to Public Storefront"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Admin Body: Left Sidebar + Right Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-56 bg-[#141414] border-r border-zinc-800 p-4 space-y-1 shrink-0 overflow-y-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment & Courier</span>
          </button>

          <button
            onClick={() => setActiveTab('website')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'website'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Website Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-[#121212] overflow-y-auto p-6 space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#181818] border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <p className="text-2xl font-bold font-mono text-[#D4AF37] tabular-nums">
                    ৳{totalRevenue.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>Nationwide sales across Bangladesh</span>
                  </span>
                </div>

                <div className="bg-[#181818] border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Total Orders
                  </span>
                  <p className="text-2xl font-bold font-mono text-white tabular-nums">
                    {orders.length}
                  </p>
                  <span className="text-[10px] text-zinc-400">
                    {pendingOrdersCount} pending · {processingOrdersCount} in transit
                  </span>
                </div>

                <div className="bg-[#181818] border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Registered Customers
                  </span>
                  <p className="text-2xl font-bold font-mono text-white tabular-nums">
                    {users.length}
                  </p>
                  <span className="text-[10px] text-zinc-400">
                    Dhaka, Gaibandha, Chittagong & more
                  </span>
                </div>

                <div className="bg-[#181818] border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Catalog Products
                  </span>
                  <p className="text-2xl font-bold font-mono text-white tabular-nums">
                    {products.length}
                  </p>
                  <span className="text-[10px] text-amber-400">
                    {lowStockProducts.length} low stock warnings
                  </span>
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#181818] p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Pending</span>
                  <span className="font-mono font-bold text-amber-400">{pendingOrdersCount}</span>
                </div>
                <div className="bg-[#181818] p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Processing</span>
                  <span className="font-mono font-bold text-blue-400">{processingOrdersCount}</span>
                </div>
                <div className="bg-[#181818] p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Delivered</span>
                  <span className="font-mono font-bold text-emerald-400">{deliveredOrdersCount}</span>
                </div>
                <div className="bg-[#181818] p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Cancelled</span>
                  <span className="font-mono font-bold text-rose-400">{cancelledOrdersCount}</span>
                </div>
              </div>

              {/* Revenue & Sales Visual Representation */}
              <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-white">Daily Sales Trajectory</h3>
                    <p className="text-[11px] text-zinc-400">November 2026 sales velocity</p>
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37] font-bold">
                    Peak: ৳24,500 / day
                  </span>
                </div>

                {/* SVG Visual Chart */}
                <div className="h-44 w-full flex items-end gap-3 pt-6 px-2 border-b border-zinc-800">
                  {[
                    { day: 'Nov 05', amount: 8200 },
                    { day: 'Nov 06', amount: 12400 },
                    { day: 'Nov 07', amount: 9800 },
                    { day: 'Nov 08', amount: 16500 },
                    { day: 'Nov 09', amount: 22100 },
                    { day: 'Nov 10', amount: 18400 },
                    { day: 'Nov 11', amount: 24500 },
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] text-zinc-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        ৳{d.amount.toLocaleString()}
                      </div>
                      <div
                        className="w-full bg-[#D4AF37]/80 hover:bg-[#D4AF37] rounded-t transition-all"
                        style={{ height: `${(d.amount / 25000) * 120}px` }}
                      />
                      <span className="text-[10px] text-zinc-400 font-mono">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Broadcast Box */}
              <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-3">
                <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Send Customer Announcement Broadcast</span>
                </h3>

                {broadcastToast && (
                  <div className="p-2.5 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-lg">
                    Announcement broadcast sent to all registered customers!
                  </div>
                )}

                <form onSubmit={handleSendBroadcast} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="Title: New Flash Eid Collection..."
                      className="w-full p-2.5 rounded-lg border border-zinc-700 bg-[#202020] text-white"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      required
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Message text for customer notification drawer..."
                      className="w-full p-2.5 rounded-lg border border-zinc-700 bg-[#202020] text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold p-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Broadcast
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Phone, Customer..."
                    className="w-full p-2 pl-8 text-xs rounded-lg border border-zinc-700 bg-[#1A1A1A] text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex gap-1.5 overflow-x-auto text-[11px]">
                  {['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1 rounded-md uppercase font-semibold transition-colors cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#181818] border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#202020] text-zinc-300 uppercase font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Total</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {orders
                        .filter((o) => {
                          const matchesFilter =
                            orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
                          const matchesSearch =
                            o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customer.mobileNumber.includes(orderSearch);
                          return matchesFilter && matchesSearch;
                        })
                        .map((o) => (
                          <tr key={o.id} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-[#D4AF37]">{o.id}</td>
                            <td className="p-3 text-zinc-400 font-mono">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-white">{o.customer.fullName}</p>
                              <p className="text-[10px] text-zinc-400">{o.customer.mobileNumber}</p>
                            </td>
                            <td className="p-3 text-zinc-300">
                              {o.customer.upazila}, {o.customer.district}
                            </td>
                            <td className="p-3">
                              <span className="uppercase font-bold text-[10px] text-zinc-300 block">
                                {o.paymentMethod}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                                  o.paymentStatus === 'verified'
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : 'bg-amber-950 text-amber-400'
                                }`}
                              >
                                {o.paymentStatus}
                              </span>
                              {o.transactionId && (
                                <p className="font-mono text-[9px] text-zinc-400">
                                  Trx: {o.transactionId}
                                </p>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-800 text-zinc-200">
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-white tabular-nums">
                              ৳{o.total.toLocaleString()}
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setUpdateStatusVal(o.orderStatus);
                                  setUpdatePaymentVal(o.paymentStatus);
                                }}
                                className="px-2.5 py-1 rounded bg-[#D4AF37] hover:bg-[#B89628] text-black font-semibold text-[11px] cursor-pointer"
                              >
                                Manage
                              </button>
                              <button
                                onClick={() => onViewInvoice(o)}
                                className="p-1 text-zinc-400 hover:text-white"
                                title="Print Invoice"
                              >
                                <FileText className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Manage Drawer / Sub-modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                  <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl w-full max-w-lg p-6 space-y-5 text-xs text-white">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#D4AF37]">
                          Manage Order {selectedOrder.id}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          Customer: {selectedOrder.customer.fullName} ({selectedOrder.customer.mobileNumber})
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-zinc-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Status Update */}
                    <div className="space-y-3 bg-[#222222] p-4 rounded-xl border border-zinc-800">
                      <h5 className="font-bold text-zinc-200">Update Logistics Milestone</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">New Stage</label>
                          <select
                            value={updateStatusVal}
                            onChange={(e) => setUpdateStatusVal(e.target.value as OrderStage)}
                            className="w-full p-2 bg-[#161616] border border-zinc-700 rounded text-xs text-white"
                          >
                            <option value="placed">1. Placed</option>
                            <option value="confirmed">2. Confirmed</option>
                            <option value="processing">3. Processing</option>
                            <option value="ready_to_ship">4. Ready to Ship</option>
                            <option value="shipped">5. Shipped</option>
                            <option value="out_for_delivery">6. Out for Delivery</option>
                            <option value="delivered">7. Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Payment Status</label>
                          <select
                            value={updatePaymentVal}
                            onChange={(e) => setUpdatePaymentVal(e.target.value as PaymentStatus)}
                            className="w-full p-2 bg-[#161616] border border-zinc-700 rounded text-xs text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          Operational Dispatch Note
                        </label>
                        <input
                          type="text"
                          value={statusNoteVal}
                          onChange={(e) => setStatusNoteVal(e.target.value)}
                          placeholder="e.g. Handed to Steadfast Palashbari courier agent"
                          className="w-full p-2 bg-[#161616] border border-zinc-700 rounded text-xs text-white"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleApplyOrderPayment}
                          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-xs font-semibold cursor-pointer"
                        >
                          Save Payment Status
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyOrderStatus}
                          className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#B89628] text-black rounded text-xs font-bold cursor-pointer"
                        >
                          Update Status & Notify User
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-zinc-800 text-white rounded text-xs"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title or category..."
                    className="w-full p-2 pl-8 text-xs rounded-lg border border-zinc-700 bg-[#1A1A1A] text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdForm({
                      name: '',
                      nameBn: '',
                      category: 'panjabi',
                      regularPrice: 2800,
                      salePrice: 2200,
                      stock: 25,
                      sizes: ['38', '40', '42', '44'],
                      colors: [{ name: 'Black', hex: '#111111' }],
                      material: 'Pure Mercerized Cotton',
                      description: 'Handcrafted luxury ethnic attire.',
                      descriptionBn: 'প্রিমিয়াম সুতি ও সিল্কের অনন্য মেলবন্ধন।',
                      images: ['/src/assets/images/product_panjabi_royal_1794462654499.jpg'],
                      featured: true,
                    });
                    setShowProductModal(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Cards Grid in Admin */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#181818] border border-zinc-800 rounded-xl p-4 flex gap-3 text-xs"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-20 h-24 object-cover rounded-lg bg-zinc-900 border border-zinc-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-[#D4AF37] uppercase font-bold">
                          {p.category}
                        </span>
                        <h4 className="font-bold text-white truncate">{p.name}</h4>
                        <p className="font-mono text-zinc-300 font-bold">
                          ৳{p.salePrice.toLocaleString()}{' '}
                          <span className="text-[10px] line-through text-zinc-500">
                            ৳{p.regularPrice.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Stock: <span className="font-bold text-white">{p.stock} units</span>
                        </p>

                        <div className="flex gap-2 pt-2 border-t border-zinc-800">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProdForm({ ...p });
                              setShowProductModal(true);
                            }}
                            className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-[#D4AF37] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Product Create/Edit Modal */}
              {showProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
                  <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl w-full max-w-2xl p-6 space-y-4 text-xs text-white max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <h4 className="font-serif font-bold text-base text-[#D4AF37]">
                        {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalog'}
                      </h4>
                      <button
                        onClick={() => setShowProductModal(false)}
                        className="text-zinc-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 font-semibold block mb-1">
                            Product Name (English) *
                          </label>
                          <input
                            type="text"
                            required
                            value={prodForm.name}
                            onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                            className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-400 font-semibold block mb-1">
                            Product Name (Bangla)
                          </label>
                          <input
                            type="text"
                            value={prodForm.nameBn}
                            onChange={(e) => setProdForm({ ...prodForm, nameBn: e.target.value })}
                            className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-zinc-400 font-semibold block mb-1">Category</label>
                          <select
                            value={prodForm.category}
                            onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                            className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white"
                          >
                            <option value="panjabi">Panjabi</option>
                            <option value="streetwear">Hoodies & Streetwear</option>
                            <option value="shirts">Luxury Shirts</option>
                            <option value="women">Women's Kurtis</option>
                            <option value="men">Men's Apparel</option>
                            <option value="kids">Kids Collection</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-zinc-400 font-semibold block mb-1">Regular Price (৳)</label>
                          <input
                            type="number"
                            required
                            value={prodForm.regularPrice}
                            onChange={(e) =>
                              setProdForm({ ...prodForm, regularPrice: Number(e.target.value) })
                            }
                            className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-400 font-semibold block mb-1">Sale Price (৳)</label>
                          <input
                            type="number"
                            required
                            value={prodForm.salePrice}
                            onChange={(e) =>
                              setProdForm({ ...prodForm, salePrice: Number(e.target.value) })
                            }
                            className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 font-semibold block mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            required
                            value={prodForm.stock}
                            onChange={(e) =>
                              setProdForm({ ...prodForm, stock: Number(e.target.value) })
                            }
                            className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-400 font-semibold block mb-1">Material Details</label>
                          <input
                            type="text"
                            value={prodForm.material}
                            onChange={(e) =>
                              setProdForm({ ...prodForm, material: e.target.value })
                            }
                            className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-zinc-400 font-semibold block mb-1">
                          Image Asset Path / URL
                        </label>
                        <input
                          type="text"
                          required
                          value={prodForm.images?.[0] || ''}
                          onChange={(e) =>
                            setProdForm({ ...prodForm, images: [e.target.value] })
                          }
                          className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-400 font-semibold block mb-1">
                          Product Description
                        </label>
                        <textarea
                          rows={3}
                          value={prodForm.description}
                          onChange={(e) =>
                            setProdForm({ ...prodForm, description: e.target.value })
                          }
                          className="w-full p-2.5 bg-[#222222] border border-zinc-700 rounded text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowProductModal(false)}
                          className="px-4 py-2 bg-zinc-800 text-white rounded text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold rounded text-xs"
                        >
                          Save Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-white">Registered Customer Accounts</h3>
              <div className="bg-[#181818] border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#202020] text-zinc-300 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Mobile Phone</th>
                      <th className="p-3">District</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {u.fullName} <br />
                          <span className="text-[10px] text-zinc-400 font-normal">{u.email}</span>
                        </td>
                        <td className="p-3 font-mono text-zinc-300">{u.mobileNumber}</td>
                        <td className="p-3 text-zinc-300">
                          {u.upazila || 'Gaibandha'}, {u.district || 'Gaibandha'}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.status === 'active'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-rose-950 text-rose-400'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                                u.status === 'active'
                                  ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-300'
                                  : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300'
                              }`}
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT & COURIER SETTINGS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="font-serif text-sm font-bold text-white">
                Bangladesh Payment Gateway & Courier Logistics Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* bKash Config */}
                <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#D12053] text-sm">bKash Gateway</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.paymentGateways.bkash.enabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            paymentGateways: {
                              ...settingsForm.paymentGateways,
                              bkash: {
                                ...settingsForm.paymentGateways.bkash,
                                enabled: e.target.checked,
                              },
                            },
                          })
                        }
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Merchant Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.paymentGateways.bkash.merchantNumber}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          paymentGateways: {
                            ...settingsForm.paymentGateways,
                            bkash: {
                              ...settingsForm.paymentGateways.bkash,
                              merchantNumber: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2 bg-[#202020] border border-zinc-700 rounded text-white font-mono"
                    />
                  </div>
                </div>

                {/* Nagad Config */}
                <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F7941D] text-sm">Nagad Gateway</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.paymentGateways.nagad.enabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            paymentGateways: {
                              ...settingsForm.paymentGateways,
                              nagad: {
                                ...settingsForm.paymentGateways.nagad,
                                enabled: e.target.checked,
                              },
                            },
                          })
                        }
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Merchant Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.paymentGateways.nagad.merchantNumber}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          paymentGateways: {
                            ...settingsForm.paymentGateways,
                            nagad: {
                              ...settingsForm.paymentGateways.nagad,
                              merchantNumber: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2 bg-[#202020] border border-zinc-700 rounded text-white font-mono"
                    />
                  </div>
                </div>

                {/* Rocket Config */}
                <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#8C3494] text-sm">Rocket Gateway</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.paymentGateways.rocket.enabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            paymentGateways: {
                              ...settingsForm.paymentGateways,
                              rocket: {
                                ...settingsForm.paymentGateways.rocket,
                                enabled: e.target.checked,
                              },
                            },
                          })
                        }
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Rocket Account with Check Digit</label>
                    <input
                      type="text"
                      value={settingsForm.paymentGateways.rocket.merchantNumber}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          paymentGateways: {
                            ...settingsForm.paymentGateways,
                            rocket: {
                              ...settingsForm.paymentGateways.rocket,
                              merchantNumber: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2 bg-[#202020] border border-zinc-700 rounded text-white font-mono"
                    />
                  </div>
                </div>

                {/* Delivery Rates */}
                <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-3 text-xs">
                  <span className="font-bold text-white text-sm">Nationwide Delivery Rates</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-zinc-400 block mb-1">Inside Dhaka (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryCharges.insideDhaka}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            deliveryCharges: {
                              ...settingsForm.deliveryCharges,
                              insideDhaka: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2 bg-[#202020] border border-zinc-700 rounded text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Outside Dhaka (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryCharges.outsideDhaka}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            deliveryCharges: {
                              ...settingsForm.deliveryCharges,
                              outsideDhaka: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2 bg-[#202020] border border-zinc-700 rounded text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Free Delivery Over (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryCharges.freeShippingThreshold}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            deliveryCharges: {
                              ...settingsForm.deliveryCharges,
                              freeShippingThreshold: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2 bg-[#202020] border border-zinc-700 rounded text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveWebsiteSettings}
                  className="bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold px-6 py-2.5 rounded-lg text-xs cursor-pointer"
                >
                  Save Gateway & Delivery Rates
                </button>
              </div>
            </div>
          )}

          {/* TAB: WEBSITE SETTINGS */}
          {activeTab === 'website' && (
            <form onSubmit={handleSaveWebsiteSettings} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-white">Brand & Storefront Settings</h3>
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>

              {settingsSavedToast && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-xl">
                  Website settings saved! Public storefront updated immediately.
                </div>
              )}

              <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-4 text-xs">
                <h4 className="font-bold text-[#D4AF37]">Company & Leadership</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 block mb-1">Company Name</label>
                    <input
                      type="text"
                      value={settingsForm.companyName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, companyName: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#202020] border border-zinc-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Founder & Owner</label>
                    <input
                      type="text"
                      value={settingsForm.founderName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, founderName: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#202020] border border-zinc-700 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 block mb-1">Official Contact Phone</label>
                    <input
                      type="text"
                      value={settingsForm.contactNumber}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactNumber: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#202020] border border-zinc-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Business Physical Address</label>
                    <input
                      type="text"
                      value={settingsForm.businessAddress}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, businessAddress: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#202020] border border-zinc-700 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#181818] border border-zinc-800 p-5 rounded-xl space-y-4 text-xs">
                <h4 className="font-bold text-[#D4AF37]">Announcement & Hero Copy</h4>
                <div>
                  <label className="text-zinc-400 block mb-1">Announcement Bar (English)</label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#202020] border border-zinc-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Announcement Bar (Bangla)</label>
                  <input
                    type="text"
                    value={settingsForm.announcementTextBn}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementTextBn: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#202020] border border-zinc-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Hero Section Headline</label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#202020] border border-zinc-700 rounded text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-white">System Security & Operations Audit Trail</h3>
              <div className="bg-[#181818] border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#202020] text-zinc-300 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Operational Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/40">
                        <td className="p-3 text-zinc-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3 text-zinc-300 font-sans font-semibold">
                          {log.adminName}
                        </td>
                        <td className="p-3 font-bold text-[#D4AF37]">{log.action}</td>
                        <td className="p-3 text-zinc-300 font-sans">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
