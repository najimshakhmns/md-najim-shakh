export type Currency = 'BDT';

export interface ProductColor {
  name: string;
  nameBn?: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  images: string[];
  featured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  material: string;
  careInstructions?: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  id: string; // unique item id (productId + size + color)
  productId: string;
  name: string;
  nameBn?: string;
  price: number;
  regularPrice: number;
  image: string;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  stock: number;
}

export type OrderStage =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'ready_to_ship'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface TrackingEvent {
  stage: OrderStage;
  title: string;
  timestamp: string;
  note: string;
  location?: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface OrderCustomer {
  fullName: string;
  mobileNumber: string;
  email: string;
  district: string;
  upazila: string;
  deliveryAddress: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. MNS-2026-9281
  createdAt: string;
  updatedAt: string;
  userId?: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  senderPhone?: string;
  orderStatus: OrderStage;
  trackingNumber: string;
  trackingHistory: TrackingEvent[];
  cancellationReason?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  district: string;
  upazila: string;
  address: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: 'customer' | 'admin';
  avatar?: string;
  district?: string;
  upazila?: string;
  address?: string;
  savedAddresses?: SavedAddress[];
  createdAt: string;
  status: 'active' | 'suspended';
}

export interface UserNotification {
  id: string;
  userId: string; // 'all' or specific user id
  title: string;
  titleBn?: string;
  message: string;
  messageBn?: string;
  type: 'order_status' | 'payment' | 'announcement' | 'security' | 'promo';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface PaymentGatewayConfig {
  enabled: boolean;
  merchantNumber: string;
  type: 'Merchant' | 'Personal';
  instructions: string;
  instructionsBn?: string;
}

export interface WebsiteSettings {
  companyName: string;
  founderName: string;
  tagline: string;
  taglineBn: string;
  contactNumber: string;
  emailAddress: string;
  businessAddress: string;
  announcementText: string;
  announcementTextBn: string;
  heroHeadline: string;
  heroHeadlineBn: string;
  heroDescription: string;
  heroDescriptionBn: string;
  heroImage: string;
  brandLogo: string;
  deliveryCharges: {
    insideDhaka: number;
    outsideDhaka: number;
    freeShippingThreshold: number;
  };
  paymentGateways: {
    bkash: PaymentGatewayConfig;
    nagad: PaymentGatewayConfig;
    rocket: PaymentGatewayConfig;
    cod: {
      enabled: boolean;
      instructions: string;
      instructionsBn?: string;
    };
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
  };
  policies: {
    shipping: string;
    returns: string;
    privacy: string;
    terms: string;
  };
}

export interface AuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}
