export type ProductCategory = 
  | 'African Wear'
  | 'Ready-to-Wear'
  | 'Corporate Wear'
  | 'Casual Fashion'
  | 'Native Attire'
  | 'Custom Designs';

export type GenderTarget = 'men' | 'women' | 'all';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  gender: 'men' | 'women' | 'unisex';
  price: number; // in USD base
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  bestseller?: boolean;
  description: string;
  fabric: string;
  craftsmanship: string[];
  careInstructions: string;
  tags: string[];
}

export interface CategoryCard {
  id: ProductCategory;
  title: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
  accent: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
  customMeasurements?: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  category: ProductCategory;
  gender: 'men' | 'women' | 'editorial';
  image: string;
  aspectRatio: 'portrait' | 'tall' | 'square';
  caption: string;
  collectionSeason: string;
  featuredProductId?: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
  outfitPurchased: string;
  verified: boolean;
}

export interface CustomDesignFormState {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: 'Men' | 'Women' | 'Unisex';
  designType: string;
  preferredFabric: string;
  occasion: string;
  measurementsNotes: string;
  inspirationImageUrl?: string;
  targetDate: string;
}

export type CurrencyCode = 'USD' | 'NGN' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier from USD
  label: string;
}

export type OrderStatus =
  | 'Pending'
  | 'In Tailoring'
  | 'Quality Check'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
  colorHex: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  currency: CurrencyCode;
  status: OrderStatus;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CustomRequestStatus =
  | 'New'
  | 'Consultation Scheduled'
  | 'Sketches In Progress'
  | 'Approved'
  | 'In Production'
  | 'Completed'
  | 'Archived';

export interface CustomDesignRequest extends CustomDesignFormState {
  id: string;
  status: CustomRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle?: string;
  bannerText: string;
  promoCode?: string;
  discountPercentage?: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  name?: string;
  avatarUrl?: string;
  lastLogin?: string;
}
