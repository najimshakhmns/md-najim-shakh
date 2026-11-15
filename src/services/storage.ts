import {
  AuditLog,
  Category,
  Order,
  OrderStage,
  PaymentGatewayConfig,
  PaymentStatus,
  Product,
  ProductReview,
  User,
  UserNotification,
  WebsiteSettings,
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'mns_products_v1',
  CATEGORIES: 'mns_categories_v1',
  ORDERS: 'mns_orders_v1',
  USERS: 'mns_users_v1',
  NOTIFICATIONS: 'mns_notifications_v1',
  SETTINGS: 'mns_settings_v1',
  AUDIT_LOGS: 'mns_audit_logs_v1',
  REVIEWS: 'mns_reviews_v1',
  CURRENT_USER: 'mns_auth_user_v1',
  ADMIN_USER: 'mns_auth_admin_v1',
};

// Initial Default Settings as per user brief
export const DEFAULT_SETTINGS: WebsiteSettings = {
  companyName: 'MNS Fashion Brand',
  founderName: 'MD: Najim Shakh',
  tagline: 'Your Style, Your Identity.',
  taglineBn: 'আপনার স্টাইল, আপনার পরিচয়।',
  contactNumber: '01341422732',
  emailAddress: 'contact@mnsfashion.com',
  businessAddress: 'Palashbari, Gaibandha, Bangladesh',
  announcementText: 'Welcome to MNS Fashion Brand – Discover Your Style. Free delivery on orders over ৳2,500 across Bangladesh!',
  announcementTextBn: 'এমএনএস ফ্যাশন ব্র্যান্ডে স্বাগতম – আপনার নিজস্ব স্টাইল আবিষ্কার করুন। ২,৫০০ টাকার অর্ডারে সারা দেশে ফ্রি ডেলিভারি!',
  heroHeadline: 'DEFINE YOUR STYLE. OWN YOUR IDENTITY.',
  heroHeadlineBn: 'নিজের স্টাইল তৈরি করুন, নিজস্ব পরিচয় গড়ে তুলুন।',
  heroDescription: 'Discover modern fashion collections designed for confidence, comfort, and individuality. Crafted with master craftsmanship in Bangladesh.',
  heroDescriptionBn: 'আত্মবিশ্বাস, আভিজাত্য এবং আরামের অনন্য মেলবন্ধনে তৈরি আধুনিক ফ্যাশন কালেকশন। গাইবান্ধার পলাশবাড়ী থেকে সারা বাংলাদেশে পরিবেশন।',
  heroImage: '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
  brandLogo: '/public/assets/aistudio/image_fe4b7042.png',
  deliveryCharges: {
    insideDhaka: 70,
    outsideDhaka: 130,
    freeShippingThreshold: 2500,
  },
  paymentGateways: {
    bkash: {
      enabled: true,
      merchantNumber: '01341422732',
      type: 'Merchant',
      instructions: 'Go to bKash App > Make Payment > Enter Merchant No: 01341422732 > Enter Amount > Use Reference: OrderID > Enter TrxID below.',
      instructionsBn: 'বিকাশ অ্যাপে যান > পেমেন্ট সিলেক্ট করুন > মার্চেন্ট নম্বর 01341422732 দিন > টাকার পরিমাণ দিন > রেফারেন্সে অর্ডার আইডি দিন > ট্রানজেকশন আইডি (TrxID) দিন।',
    },
    nagad: {
      enabled: true,
      merchantNumber: '01341422732',
      type: 'Merchant',
      instructions: 'Go to Nagad App > Merchant Pay > Enter Merchant No: 01341422732 > Enter Amount > Counter 1 > Enter TrxID below.',
      instructionsBn: 'নগদ অ্যাপে যান > মার্চেন্ট পে সিলেক্ট করুন > মার্চেন্ট নম্বর 01341422732 দিন > টাকার পরিমাণ দিন > কাউন্টারে 1 দিন > ট্রানজেকশন আইডি দিন।',
    },
    rocket: {
      enabled: true,
      merchantNumber: '01341422732-7',
      type: 'Merchant',
      instructions: 'Dial *322# or use Rocket App > Merchant Pay > Enter Merchant No: 01341422732-7 > Enter TrxID below.',
      instructionsBn: 'রকেট অ্যাপ বা *322# এ যান > মার্চেন্ট পে সিলেক্ট করুন > নম্বর 01341422732-7 দিন > ট্রানজেকশন আইডি দিন।',
    },
    cod: {
      enabled: true,
      instructions: 'Pay in cash to the delivery courier when receiving your luxury parcel at your doorstep. Check package before accepting.',
      instructionsBn: 'হোম ডেলিভারিতে পার্সেল হাতে পেয়ে ক্যাশ টাকা পরিশোধ করুন। ডেলিভারি ম্যানের উপস্থিতিতে পণ্য পরীক্ষা করে নিন।',
    },
  },
  socialLinks: {
    facebook: 'https://facebook.com/mnsfashionbrand',
    instagram: 'https://instagram.com/mnsfashionbrand',
    whatsapp: 'https://wa.me/8801341422732',
  },
  policies: {
    shipping: 'We deliver nationwide across Bangladesh. Inside Dhaka deliveries take 24–48 hours, while districts and upazilas across Bangladesh (including Gaibandha, Rangpur, Bogura, Chittagong, Sylhet, etc.) take 2–4 business days via reliable courier partners.',
    returns: 'Easy 7-day hassle-free return and exchange policy for unworn items with original tags and packaging. Contact our helpline 01341422732 for immediate assistance.',
    privacy: 'MNS Fashion Brand respects your personal data. We never share your phone number or shipping details with third parties except verified delivery couriers.',
    terms: 'All orders placed are verified via automated SMS/Call. Prices are inclusive of all applicable VAT in Bangladeshi Taka (৳).',
  },
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'men',
    name: "Men's Fashion",
    nameBn: 'পুরুষদের ফ্যাশন',
    slug: 'men',
    description: 'Bespoke Panjabis, formal shirts, polo t-shirts and trousers.',
    image: '/src/assets/images/product_panjabi_royal_1794462654499.jpg',
    itemCount: 18,
  },
  {
    id: 'women',
    name: "Women's Fashion",
    nameBn: 'নারীদের ফ্যাশন',
    slug: 'women',
    description: 'Designer fusion kurtis, statement tunics and modest silhouettes.',
    image: '/src/assets/images/product_women_kurti_1794462656471.jpg',
    itemCount: 14,
  },
  {
    id: 'panjabi',
    name: 'Panjabi Collection',
    nameBn: 'পাঞ্জাবি কালেকশন',
    slug: 'panjabi',
    description: 'Hand-detailed embroidery, royal cuts, and luxurious silk-cotton blends.',
    image: '/src/assets/images/product_panjabi_royal_1794462654499.jpg',
    itemCount: 12,
  },
  {
    id: 'shirts',
    name: 'Luxury Shirts',
    nameBn: 'লাক্সারি শার্ট',
    slug: 'shirts',
    description: 'Egyptian cotton shirts tailored for executive power dressing.',
    image: '/src/assets/images/product_formal_shirt_1794462656156.jpg',
    itemCount: 9,
  },
  {
    id: 'streetwear',
    name: 'Hoodies & Streetwear',
    nameBn: 'হুডি ও আধুনিক পোশাক',
    slug: 'streetwear',
    description: 'Heavyweight loopback French terry hoodies and modern streetwear.',
    image: '/src/assets/images/product_premium_hoodie_1794462656110.jpg',
    itemCount: 11,
  },
  {
    id: 'kids',
    name: 'Kids Fashion',
    nameBn: 'বাচ্চাদের ফ্যাশন',
    slug: 'kids',
    description: 'Comfortable, breathable festive wear and playful modern designs.',
    image: '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
    itemCount: 8,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Royal Heritage Onyx Panjabi with Gold Zari Collar',
    nameBn: 'রয়্যাল হেরিটেজ ওনিক্স পাঞ্জাবি (গোল্ড জরি কাজ)',
    slug: 'royal-heritage-onyx-panjabi',
    description:
      'Crafted from high-density hand-spun Mercerized cotton blend with pure gold zari embroidered mandarin collar and sleeve cuffs. Designed for Eid festivals, wedding receptions, and celebratory evenings.',
    descriptionBn:
      'উচ্চমানের মার্সারাইজড কটন ও সিল্ক ব্লেন্ডে তৈরি, কলার ও হাতায় সূক্ষ্ম সোনালী জরি এমব্রয়ডারি। ঈদ, বিবাহ ও বিশেষ উৎসবের জন্য নিখুঁত পছন্দ।',
    regularPrice: 3850,
    salePrice: 3200,
    discountPercentage: 17,
    rating: 4.9,
    reviewCount: 42,
    category: 'panjabi',
    subcategory: "Men's Fashion",
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Onyx Black', nameBn: 'অনিক্স ব্ল্যাক', hex: '#111111' },
      { name: 'Royal Navy', nameBn: 'রয়্যাল নেভি', hex: '#0B192C' },
      { name: 'Ivory White', nameBn: 'আইভরি হোয়াইট', hex: '#F8F9FA' },
    ],
    stock: 24,
    images: [
      '/src/assets/images/product_panjabi_royal_1794462654499.jpg',
      '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
    ],
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    material: '90% Mercerized Cotton, 10% Raw Silk blend',
    careInstructions: 'Dry clean recommended. Gentle hand wash inside out with mild liquid detergent.',
  },
  {
    id: 'prod-002',
    name: 'MNS Monarch Heavyweight Oversized Hoodie (450 GSM)',
    nameBn: 'এমএনএস মোনার্ক হেভিওয়েট ওভারসাইজড হুডি',
    slug: 'mns-monarch-heavyweight-hoodie',
    description:
      'Premium 450 GSM custom-milled French terry cotton with structured drop-shoulder drape. Features tonal MNS high-density embroidery, custom antique brass zip hardware, and double-layered warm hood.',
    descriptionBn:
      '৪৫০ জিএসএম প্রিমিয়াম ফ্রেঞ্চ টেরি কটনে তৈরি। ড্রপ শোল্ডার কাটিং, অ্যান্টিক ব্রাস জিপার ও রাজকীয় ফিনিশিং।',
    regularPrice: 2850,
    salePrice: 2390,
    discountPercentage: 16,
    rating: 4.8,
    reviewCount: 38,
    category: 'streetwear',
    subcategory: "Men's Fashion",
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Jet Black', nameBn: 'জেট ব্ল্যাক', hex: '#161616' },
      { name: 'Olive Drab', nameBn: 'অলিভ ড্র্যাব', hex: '#444B3C' },
      { name: 'Heather Gray', nameBn: 'হিদার গ্রে', hex: '#71717A' },
    ],
    stock: 32,
    images: [
      '/src/assets/images/product_premium_hoodie_1794462656110.jpg',
      '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
    ],
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    material: '100% Ring-Spun Combed Cotton (450 GSM)',
    careInstructions: 'Machine wash cold with like colors. Hang dry in shade.',
  },
  {
    id: 'prod-003',
    name: 'Executive Contrast Collar Formal Shirt',
    nameBn: 'এক্সিকিউটিভ কনট্রাস্ট কলার ফর্মাল শার্ট',
    slug: 'executive-contrast-collar-formal-shirt',
    description:
      'Italian-styled slim luxury formal shirt featuring crisp contrast spread collar, French cuffs with included onyx cufflinks, and silky easy-iron 100s 2-ply Egyptian cotton fabric.',
    descriptionBn:
      '১০০এস টু-প্লাই মিশরীয় সুতি কাপড়ে প্রস্তুত, কনট্রাস্ট কলার ও ফ্রেঞ্চ কাফ। সাথে রয়েছে লাক্সারি কাফলিংকস।',
    regularPrice: 2450,
    salePrice: 1950,
    discountPercentage: 20,
    rating: 4.9,
    reviewCount: 29,
    category: 'shirts',
    subcategory: "Men's Fashion",
    sizes: ['15 (M)', '15.5 (L)', '16 (XL)', '16.5 (XXL)'],
    colors: [
      { name: 'Onyx Contrast', nameBn: 'অনিক্স কনট্রাস্ট', hex: '#1C1917' },
      { name: 'Sky Stripe', nameBn: 'স্কাই স্ট্রাইপ', hex: '#38BDF8' },
      { name: 'Pure White', nameBn: 'পিউর হোয়াইট', hex: '#FFFFFF' },
    ],
    stock: 19,
    images: [
      '/src/assets/images/product_formal_shirt_1794462656156.jpg',
      '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
    ],
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: '100% 2-Ply Long Staple Egyptian Cotton',
    careInstructions: 'Warm iron while slightly damp. Machine wash cold.',
  },
  {
    id: 'prod-004',
    name: 'Imperial Sapphire Tunic Kurti with Gold Piping',
    nameBn: 'ইম্পেরিয়াল স্যাফায়ার টিউনিখ কুর্তি (গোল্ড পাইপিং)',
    slug: 'imperial-sapphire-tunic-kurti',
    description:
      'Contemporary asymmetric hem kurti tailored in mulberry silk georgette with fine gold corded piping along the high-mandarin neckline and placket. Flattering A-line silhouette with concealed pockets.',
    descriptionBn:
      'মালবেরি সিল্ক জর্জেটে তৈরি মডার্ন এ-লাইন কুর্তি। গলায় সূক্ষ্ম সোনালী পাইপিং এবং সাইড পকেট।',
    regularPrice: 3200,
    salePrice: 2650,
    discountPercentage: 17,
    rating: 4.9,
    reviewCount: 51,
    category: 'women',
    subcategory: "Women's Fashion",
    sizes: ['36', '38', '40', '42', '44'],
    colors: [
      { name: 'Sapphire Navy', nameBn: 'স্যাফায়ার নেভি', hex: '#1E3A8A' },
      { name: 'Ruby Wine', nameBn: 'রুবি ওয়াইন', hex: '#881337' },
      { name: 'Emerald Forest', nameBn: 'এমারেল্ড ফরেস্ট', hex: '#064E3B' },
    ],
    stock: 18,
    images: [
      '/src/assets/images/product_women_kurti_1794462656471.jpg',
      '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
    ],
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    material: 'Pure Mulberry Silk & Modal blend with crepe lining',
    careInstructions: 'Dry clean only. Steam iron from reverse.',
  },
  {
    id: 'prod-005',
    name: 'Signature MNS Gold Embroidered Luxury Polo T-Shirt',
    nameBn: 'সিগনেচার এমএনএস গোল্ড এমব্রয়ডার্ড লাক্সারি পোলো টি-শার্ট',
    slug: 'signature-mns-gold-polo-shirt',
    description:
      'Finely knit honeycomb pique cotton polo with micro rib collar, genuine mother-of-pearl buttons, and delicate gold signature MNS monogram embroidered on the left chest.',
    descriptionBn:
      'প্রিমিয়াম কম্বড হানিকম্ব পিকে কটন পোলো। বুটিক ফিনিশ এবং বুকে সোনালী এমএনএস লোগো।',
    regularPrice: 1650,
    salePrice: 1290,
    discountPercentage: 22,
    rating: 4.7,
    reviewCount: 64,
    category: 'men',
    subcategory: 'T-Shirts',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Midnight Charcoal', nameBn: 'মিডনাইট চারকোল', hex: '#262626' },
      { name: 'Deep Burgundy', nameBn: 'ডিপ বার্গান্ডি', hex: '#4A0E17' },
      { name: 'Off White', nameBn: 'অফ হোয়াইট', hex: '#F5F5F0' },
    ],
    stock: 45,
    images: [
      '/src/assets/images/product_formal_shirt_1794462656156.jpg',
      '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
    ],
    featured: false,
    isNewArrival: false,
    isBestSeller: true,
    material: '100% Combed Compact Cotton Pique',
    careInstructions: 'Machine wash 30°C. Do not tumble dry.',
  },
  {
    id: 'prod-006',
    name: 'MNS Master Tailored Chino Trousers (Slim Fit)',
    nameBn: 'এমএনএস মাস্টার টেইলর্ড চিনো ট্রাউজার্স',
    slug: 'mns-master-chino-trousers',
    description:
      'Stretch cotton twill luxury chinos engineered with internal waistband curtain, horn buttons, coin pocket, and comfort stretch. Perfect for smart-casual and business attire.',
    descriptionBn:
      'কমফোর্ট স্ট্রেচ কটন টুইলে তৈরি স্লিম ফিট চিনো প্যান্ট। অফিস ও ক্যাজুয়াল উভয় পরিবেশের উপযোগী।',
    regularPrice: 2100,
    salePrice: 1750,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 31,
    category: 'men',
    subcategory: 'Jeans & Trousers',
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Desert Khaki', nameBn: 'ডিজার্ট খাকি', hex: '#C2B280' },
      { name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1E293B' },
      { name: 'Charcoal Black', nameBn: 'চারকোল ব্ল্যাক', hex: '#18181B' },
    ],
    stock: 28,
    images: [
      '/src/assets/images/product_panjabi_royal_1794462654499.jpg',
      '/src/assets/images/hero_mns_fashion_1794462653823.jpg',
    ],
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    material: '98% Cotton, 2% Spandex',
    careInstructions: 'Machine wash cold inside out. Tumble dry low.',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-001',
    fullName: 'MD: Najim Shakh',
    email: 'najimshakh28@gmail.com',
    mobileNumber: '01341422732',
    role: 'admin',
    avatar: '/public/assets/aistudio/image_fe4b7042.png',
    district: 'Gaibandha',
    upazila: 'Palashbari',
    address: 'Palashbari Bazar, Gaibandha, Bangladesh',
    createdAt: '2026-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'user-002',
    fullName: 'Tanvir Hossain',
    email: 'tanvir@example.com',
    mobileNumber: '01711002233',
    role: 'customer',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    address: 'House 14, Road 7, Dhanmondi, Dhaka',
    createdAt: '2026-02-10T11:20:00Z',
    status: 'active',
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        recipientName: 'Tanvir Hossain',
        phone: '01711002233',
        district: 'Dhaka',
        upazila: 'Dhanmondi',
        address: 'House 14, Road 7, Dhanmondi, Dhaka',
        isDefault: true,
      },
    ],
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'MNS-2026-8941',
    createdAt: '2026-11-09T14:32:00Z',
    updatedAt: '2026-11-10T09:15:00Z',
    userId: 'user-002',
    customer: {
      fullName: 'Tanvir Hossain',
      mobileNumber: '01711002233',
      email: 'tanvir@example.com',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      deliveryAddress: 'House 14, Road 7, Dhanmondi, Dhaka',
      notes: 'Please call before delivery',
    },
    items: [
      {
        id: 'prod-001-42-Onyx Black',
        productId: 'prod-001',
        name: 'Royal Heritage Onyx Panjabi with Gold Zari Collar',
        nameBn: 'রয়্যাল হেরিটেজ ওনিক্স পাঞ্জাবি',
        price: 3200,
        regularPrice: 3850,
        image: '/src/assets/images/product_panjabi_royal_1794462654499.jpg',
        selectedSize: '42',
        selectedColor: { name: 'Onyx Black', hex: '#111111' },
        quantity: 1,
        stock: 24,
      },
    ],
    subtotal: 3200,
    deliveryCharge: 0,
    discount: 0,
    total: 3200,
    paymentMethod: 'bkash',
    paymentStatus: 'verified',
    transactionId: 'BK9A7721QX',
    senderPhone: '01711002233',
    orderStatus: 'shipped',
    trackingNumber: 'STE-MNS-99120',
    trackingHistory: [
      {
        stage: 'placed',
        title: 'Order Placed',
        timestamp: '2026-11-09T14:32:00Z',
        note: 'Customer placed order online with bKash payment.',
      },
      {
        stage: 'confirmed',
        title: 'Payment Verified & Order Confirmed',
        timestamp: '2026-11-09T15:10:00Z',
        note: 'bKash TrxID BK9A7721QX verified by accounts team.',
      },
      {
        stage: 'processing',
        title: 'Quality Check & Packing',
        timestamp: '2026-11-09T18:40:00Z',
        note: 'Dispatched to luxury packaging line in Palashbari.',
      },
      {
        stage: 'ready_to_ship',
        title: 'Manifested with Courier',
        timestamp: '2026-11-10T08:00:00Z',
        note: 'Handed over to Steadfast Express Courier.',
      },
      {
        stage: 'shipped',
        title: 'In Transit to Dhaka Hub',
        timestamp: '2026-11-10T09:15:00Z',
        location: 'Tejgaon Central Sorting Hub',
        note: 'Consignment sorted, arriving at Dhanmondi delivery branch.',
      },
    ],
  },
  {
    id: 'MNS-2026-7832',
    createdAt: '2026-11-11T10:15:00Z',
    updatedAt: '2026-11-11T11:00:00Z',
    userId: 'user-001',
    customer: {
      fullName: 'MD: Najim Shakh',
      mobileNumber: '01341422732',
      email: 'najimshakh28@gmail.com',
      district: 'Gaibandha',
      upazila: 'Palashbari',
      deliveryAddress: 'Palashbari Main Market, Gaibandha',
    },
    items: [
      {
        id: 'prod-002-L-Jet Black',
        productId: 'prod-002',
        name: 'MNS Monarch Heavyweight Oversized Hoodie (450 GSM)',
        nameBn: 'এমএনএস মোনার্ক হেভিওয়েট ওভারসাইজড হুডি',
        price: 2390,
        regularPrice: 2850,
        image: '/src/assets/images/product_premium_hoodie_1794462656110.jpg',
        selectedSize: 'L',
        selectedColor: { name: 'Jet Black', hex: '#161616' },
        quantity: 1,
        stock: 32,
      },
    ],
    subtotal: 2390,
    deliveryCharge: 70,
    discount: 100,
    total: 2360,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    trackingNumber: 'STE-MNS-11048',
    trackingHistory: [
      {
        stage: 'placed',
        title: 'Order Placed',
        timestamp: '2026-11-11T10:15:00Z',
        note: 'Cash on Delivery order booked.',
      },
      {
        stage: 'confirmed',
        title: 'Phone Verified & Confirmed',
        timestamp: '2026-11-11T11:00:00Z',
        note: 'Order details confirmed by MNS Customer Care.',
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    adminName: 'MD: Najim Shakh',
    adminEmail: 'najimshakh28@gmail.com',
    action: 'SYSTEM_INITIALIZATION',
    details: 'Initial MNS Fashion Brand e-commerce platform launched.',
    timestamp: '2026-11-01T08:00:00Z',
  },
  {
    id: 'log-002',
    adminName: 'MD: Najim Shakh',
    adminEmail: 'najimshakh28@gmail.com',
    action: 'ORDER_STATUS_UPDATE',
    details: 'Updated order MNS-2026-8941 status to SHIPPED (TrxID verified).',
    timestamp: '2026-11-10T09:15:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    userId: 'all',
    title: 'New Winter & Festive Collection Live!',
    titleBn: 'নতুন উইন্টার ও ফেস্টিভ কালেকশন এসে গেছে!',
    message: 'Explore our latest Royal Heritage Panjabi and 450 GSM Monarch Heavyweight Hoodies designed by MD: Najim Shakh.',
    messageBn: 'এমএনএস ফ্যাশন ব্র্যান্ডের নতুন রাজকীয় পাঞ্জাবি এবং প্রিমিয়াম হুডি কালেকশন এখন লাইভ।',
    type: 'announcement',
    read: false,
    createdAt: '2026-11-11T09:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-002',
    title: 'Order Shipped: MNS-2026-8941',
    titleBn: 'আপনার অর্ডার পাঠানো হয়েছে: MNS-2026-8941',
    message: 'Your Panjabi order is on the way with Steadfast Courier (Tracking: STE-MNS-99120). Expected delivery in 24 hours.',
    messageBn: 'আপনার পাঞ্জাবি অর্ডারটি কুরিয়ারে দেওয়া হয়েছে। ট্র্যাকিং কোড: STE-MNS-99120।',
    type: 'order_status',
    read: false,
    createdAt: '2026-11-10T09:15:00Z',
    link: 'order-tracking',
  },
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-001',
    userName: 'Shakil Ahmed (Dhaka)',
    rating: 5,
    comment: 'The gold zari collar work on this Panjabi is exceptional. The fabric feels luxurious and breathable. Received compliments all evening at my brother’s engagement!',
    createdAt: '2026-11-08T18:20:00Z',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-002',
    userName: 'Kazi Mahfuz (Rangpur)',
    rating: 5,
    comment: 'Best heavyweight hoodie in Bangladesh. The 450 GSM feel is thick and warm, and the drop shoulder cut is perfectly international.',
    createdAt: '2026-11-09T12:40:00Z',
    verifiedPurchase: true,
  },
];

// Helper methods to read and write to localStorage
export const storageService = {
  // Settings
  getSettings(): WebsiteSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: WebsiteSettings, adminUser?: { name: string; email: string }): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.addAuditLog(
      adminUser?.name || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'WEBSITE_SETTINGS_UPDATE',
      'Updated website brand info, delivery charges, or payment gateways'
    );
  },

  // Products
  getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct(product: Product, adminUser?: { name: string; email: string }): void {
    const products = this.getProducts();
    products.unshift(product);
    this.saveProducts(products);
    this.addAuditLog(
      adminUser?.name || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'PRODUCT_CREATED',
      `Added product: ${product.name} (SKU: ${product.id})`
    );
  },

  updateProduct(product: Product, adminUser?: { name: string; email: string }): void {
    const products = this.getProducts().map((p) => (p.id === product.id ? product : p));
    this.saveProducts(products);
    this.addAuditLog(
      adminUser?.name || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'PRODUCT_UPDATED',
      `Updated product: ${product.name} (Price: ৳${product.salePrice})`
    );
  },

  deleteProduct(productId: string, adminUser?: { name: string; email: string }): void {
    const product = this.getProducts().find((p) => p.id === productId);
    const products = this.getProducts().filter((p) => p.id !== productId);
    this.saveProducts(products);
    this.addAuditLog(
      adminUser?.name || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'PRODUCT_DELETED',
      `Deleted product: ${product?.name || productId}`
    );
  },

  // Categories
  getCategories(): Category[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // Orders
  getOrders(): Order[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);

    // Create notification for customer
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: order.userId || 'guest',
      title: `Order Placed: ${order.id}`,
      titleBn: `অর্ডার গ্রহণ করা হয়েছে: ${order.id}`,
      message: `Your order for ৳${order.total.toLocaleString()} has been placed via ${order.paymentMethod.toUpperCase()}.`,
      messageBn: `আপনার ৳${order.total.toLocaleString()} টাকার অর্ডার সফলভাবে গৃহীত হয়েছে।`,
      type: 'order_status',
      read: false,
      createdAt: new Date().toISOString(),
      link: 'orders',
    });

    return order;
  },

  updateOrderStatus(
    orderId: string,
    newStatus: OrderStage,
    note: string,
    adminUser?: { name: string; email: string }
  ): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const stageTitles: Record<OrderStage, string> = {
      placed: 'Order Placed',
      confirmed: 'Order Confirmed',
      processing: 'Processing at Palashbari Warehouse',
      ready_to_ship: 'Ready for Courier Dispatch',
      shipped: 'Shipped with Courier',
      out_for_delivery: 'Out for Doorstep Delivery',
      delivered: 'Delivered Successfully',
      cancelled: 'Order Cancelled',
    };

    const newEvent = {
      stage: newStatus,
      title: stageTitles[newStatus],
      timestamp: new Date().toISOString(),
      note: note || `Order updated to ${stageTitles[newStatus]} by operations team.`,
    };

    orders[index].orderStatus = newStatus;
    orders[index].updatedAt = newEvent.timestamp;
    orders[index].trackingHistory.push(newEvent);

    if (newStatus === 'delivered' && orders[index].paymentMethod === 'cod') {
      orders[index].paymentStatus = 'verified';
    }

    this.saveOrders(orders);

    // Notify user
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: orders[index].userId || 'guest',
      title: `Order Update: ${orders[index].id}`,
      titleBn: `অর্ডার আপডেট: ${orders[index].id}`,
      message: `Your order status changed to: ${stageTitles[newStatus]}. ${note}`,
      type: 'order_status',
      read: false,
      createdAt: new Date().toISOString(),
      link: 'orders',
    });

    this.addAuditLog(
      adminUser?.name || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'ORDER_STATUS_CHANGED',
      `Order ${orderId} changed to ${newStatus}. Note: ${note}`
    );

    return orders[index];
  },

  updateOrderPayment(
    orderId: string,
    paymentStatus: PaymentStatus,
    adminUser?: { name: string; email: string }
  ): void {
    const orders = this.getOrders().map((o) =>
      o.id === orderId ? { ...o, paymentStatus, updatedAt: new Date().toISOString() } : o
    );
    this.saveOrders(orders);
    this.addAuditLog(
      adminUser?.name || 'Admin',
      adminUser?.email || 'admin@mnsfashion.com',
      'PAYMENT_STATUS_UPDATED',
      `Order ${orderId} payment status set to ${paymentStatus}`
    );
  },

  // Users
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  updateUser(user: User): void {
    const users = this.getUsers().map((u) => (u.id === user.id ? user : u));
    this.saveUsers(users);
  },

  // Notifications
  getNotifications(): UserNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: UserNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  addNotification(notif: UserNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    this.saveNotifications(list);
  },

  markNotificationRead(id: string): void {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(list);
  },

  markAllNotificationsRead(userId?: string): void {
    const list = this.getNotifications().map((n) =>
      userId === undefined || n.userId === userId || n.userId === 'all'
        ? { ...n, read: true }
        : n
    );
    this.saveNotifications(list);
  },

  deleteNotification(id: string): void {
    const list = this.getNotifications().filter((n) => n.id !== id);
    this.saveNotifications(list);
  },

  // Reviews
  getReviews(productId?: string): ProductReview[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    let list: ProductReview[] = INITIAL_REVIEWS;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_REVIEWS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
    if (productId) {
      return list.filter((r) => r.productId === productId);
    }
    return list;
  },

  addReview(review: ProductReview): void {
    const list = this.getReviews();
    list.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));

    // Update product rating
    const prodReviews = list.filter((r) => r.productId === review.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const products = this.getProducts().map((p) =>
      p.id === review.productId
        ? { ...p, rating: parseFloat(avg.toFixed(1)), reviewCount: prodReviews.length }
        : p
    );
    this.saveProducts(products);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog(adminName: string, adminEmail: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminName,
      adminEmail,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  },
};
