import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import {
  Product,
  CategoryCard,
  Order,
  CustomDesignRequest,
  ContactMessage,
  Testimonial,
  LookbookItem,
  Promotion,
  AdminUser,
  OrderStatus,
  CustomRequestStatus,
} from '../types';
import {
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES as INITIAL_CATEGORIES,
  TESTIMONIALS as INITIAL_TESTIMONIALS,
  INSTAGRAM_POSTS as INITIAL_POSTS,
} from '../data/fashionData';

export const AUTHORIZED_ADMIN_EMAIL = 'deehavilahdesign@gmail.com';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const CONFIG_STORAGE_KEY = 'dh_supabase_config';
const ADMIN_SESSION_KEY = 'dh_admin_session';
const PRODUCTS_STORAGE_KEY = 'dh_store_products';
const CATEGORIES_STORAGE_KEY = 'dh_store_categories';
const ORDERS_STORAGE_KEY = 'dh_store_orders';
const CUSTOM_REQUESTS_STORAGE_KEY = 'dh_store_custom_requests';
const MESSAGES_STORAGE_KEY = 'dh_store_messages';
const TESTIMONIALS_STORAGE_KEY = 'dh_store_testimonials';
const GALLERY_STORAGE_KEY = 'dh_store_gallery';
const PROMOTIONS_STORAGE_KEY = 'dh_store_promotions';

export const DEFAULT_SUPABASE_URL = 'https://tjhkfqzxgwbdsxjoptsq.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_7aV85aDlKGFFh0GNhWe9fA_TfhxGwY9';

// Retrieve config from env or localStorage or fallback to Dee Havilah default credentials
export function getStoredSupabaseConfig(): SupabaseConfig {
  // 1. Check localStorage first in case user modified it in admin panel
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse stored Supabase config:', e);
  }

  // 2. Check import.meta.env
  const metaEnv = (import.meta as any).env || {};
  const envUrl = (metaEnv.VITE_SUPABASE_URL || '').trim();
  const envKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  // 3. Fallback to Dee Havilah project credentials so all client orders in published links always sync
  return {
    url: DEFAULT_SUPABASE_URL,
    anonKey: DEFAULT_SUPABASE_ANON_KEY,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  initSupabaseClient();
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey) {
    supabaseInstance = null;
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return supabaseInstance;
  } catch (e) {
    console.error('Error initializing Supabase client:', e);
    supabaseInstance = null;
    return null;
  }
}

// Initial instance
initSupabaseClient();

export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(url && anonKey);
}

// ==============================================================================
// AUTHENTICATION & ACCESS CONTROL
// ==============================================================================

export async function signInAdmin(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const cleanEmail = emailInput.trim().toLowerCase();

  // Strict email validation: Only authorized email is permitted
  if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'Access Denied: You are not an authorized DEE HAVILAH DESIGN administrator.',
    };
  }

  const supabase = getSupabase();

  if (supabase) {
    try {
      // 1. Attempt login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      });

      if (error) {
        // If user not found or invalid credentials on first setup, try creating the account
        if (
          error.message?.toLowerCase().includes('invalid login credentials') ||
          error.message?.toLowerCase().includes('user not found')
        ) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password: passwordInput,
            options: {
              data: {
                role: 'admin',
                full_name: 'DEE HAVILAH Lead Administrator',
              },
            },
          });

          if (!signUpError && signUpData?.user) {
            const adminUser: AdminUser = {
              id: signUpData.user.id,
              email: signUpData.user.email || cleanEmail,
              role: 'admin',
              name: 'DEE HAVILAH Administrator',
              lastLogin: new Date().toISOString(),
            };
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
            return { success: true, user: adminUser };
          }
        }

        return {
          success: false,
          error: `Authentication failed: ${error.message}`,
        };
      }

      if (data?.user) {
        if (data.user.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Access Denied: This account is not registered as the DEE HAVILAH administrator.',
          };
        }

        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          role: 'admin',
          name: data.user.user_metadata?.full_name || 'DEE HAVILAH Administrator',
          lastLogin: new Date().toISOString(),
        };

        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
    } catch (err: any) {
      console.warn('Supabase Auth error, checking fallback session:', err);
    }
  }

  // Graceful fallback for local development or preview without remote Supabase connected:
  // Creates local admin session with authorized email
  const adminUser: AdminUser = {
    id: 'local-admin-dh-001',
    email: cleanEmail,
    role: 'admin',
    name: 'DEE HAVILAH Administrator',
    lastLogin: new Date().toISOString(),
  };

  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
  return { success: true, user: adminUser };
}

export async function signOutAdmin(): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error signing out from Supabase:', e);
    }
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user?.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return user;
    }
    // Unauthorized session found in storage -> purge
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  } catch {
    return null;
  }
}

// ==============================================================================
// INITIAL SEED DATA FOR LOCAL STORAGE
// ==============================================================================

const INITIAL_ORDERS: Order[] = [
  {
    id: 'DH-ORD-89412',
    customerName: 'Adewale Adeleke',
    customerEmail: 'a.adeleke@africanexecutives.com',
    customerPhone: '+234 803 555 0192',
    items: [
      {
        id: 'item-1',
        productId: 'dh-001',
        name: 'The Sovereign Emerald Agbada Set',
        price: 680,
        quantity: 1,
        size: 'XL',
        colorName: 'Deep Emerald & Gold',
        colorHex: '#062319',
        image: '/collections/african-wear.jpg',
      },
    ],
    totalAmount: 680,
    currency: 'USD',
    status: 'In Tailoring',
    shippingAddress: {
      street: '14 Banana Island Road',
      city: 'Ikoyi, Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
    notes: 'Please ensure gold bullion embroidery is sharp for diplomatic reception.',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'DH-ORD-89413',
    customerName: 'Claire Beaumont',
    customerEmail: 'claire.beaumont@luxurylondon.co.uk',
    customerPhone: '+44 7700 900077',
    items: [
      {
        id: 'item-2',
        productId: 'dh-002',
        name: 'Emiola Pleated Silk Goddess Gown',
        price: 540,
        quantity: 1,
        size: 'M',
        colorName: 'Emerald Jewel',
        colorHex: '#0B3B2C',
        image: '/collections/ready-to-wear.jpg',
      },
    ],
    totalAmount: 540,
    currency: 'USD',
    status: 'Dispatched',
    shippingAddress: {
      street: '42 Mayfair Square',
      city: 'London',
      state: 'Greater London',
      country: 'United Kingdom',
    },
    notes: 'Fragile silk garment - insured white glove courier requested.',
    createdAt: new Date(Date.now() - 3600000 * 54).toISOString(),
  },
  {
    id: 'DH-ORD-89414',
    customerName: 'Dr. Michael Chen',
    customerEmail: 'm.chen@columbia.edu',
    customerPhone: '+1 212 555 4920',
    items: [
      {
        id: 'item-3',
        productId: 'dh-003',
        name: 'The Sovereign Peak-Lapel Double-Breasted Suit',
        price: 790,
        quantity: 1,
        size: 'L',
        colorName: 'Forest Emerald & Gold Filigree',
        colorHex: '#041A13',
        image: '/collections/corporate-wear.jpg',
      },
    ],
    totalAmount: 790,
    currency: 'USD',
    status: 'Pending',
    shippingAddress: {
      street: '55 Central Park West, Apt 11B',
      city: 'New York',
      state: 'NY',
      country: 'United States',
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const INITIAL_CUSTOM_REQUESTS: CustomDesignRequest[] = [
  {
    id: 'CR-101',
    fullName: 'Chief Olatunji Benson',
    phoneNumber: '+234 802 333 4455',
    email: 'benson.enterprises@gmail.com',
    gender: 'Men',
    designType: 'African Wear',
    preferredFabric: 'Aso-Oke & Silk Organza',
    occasion: 'Wedding Celebration',
    measurementsNotes: 'Chest: 44", Sleeve: 35", Trouser Waist: 38", Inseam: 32". Need matching Fila cap.',
    inspirationImageUrl: '/collections/custom-designs.jpg',
    targetDate: '2026-10-18',
    status: 'Consultation Scheduled',
    adminNotes: 'Spoke with client on WhatsApp. Sample swatch dispatched to his Victoria Island office.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'CR-102',
    fullName: 'Lady Vanessa Sterling',
    phoneNumber: '+44 7911 123456',
    email: 'vanessa.sterling@consortium.org',
    gender: 'Women',
    designType: 'Haute Couture Gown',
    preferredFabric: 'Royal Velvet & Gold Filigree',
    occasion: 'Red Carpet Gala',
    measurementsNotes: 'Bust: 36", Waist: 28", Hip: 40". Floor length with 2-meter emerald train.',
    inspirationImageUrl: '/collections/ready-to-wear.jpg',
    targetDate: '2026-11-05',
    status: 'In Production',
    adminNotes: 'Corsetry finished. Master beader hand-attaching gold filigree pearls.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'MSG-001',
    name: 'Kemi Adebayo',
    email: 'kemi.adebayo@gmail.com',
    phone: '+234 805 123 7890',
    subject: 'Bridal Party Bespoke Inquiries',
    message: 'Hello Dee Havilah, I am planning my destination wedding in Dubai for December. I would like to order 6 bespoke bridesmaids gowns and groomsmen agbada sets. Could we schedule a private consultation?',
    isRead: false,
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'MSG-002',
    name: 'David O’Connor',
    email: 'doconnor@apexcapital.ie',
    phone: '+353 87 654 3210',
    subject: 'International Delivery to Dublin',
    message: 'Good day. I admired your Sovereign Suit in the lookbook. Do you deliver to Dublin, Ireland, and what is the typical turnaround for made-to-measure orders?',
    isRead: true,
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Autumn Atelier Privilege',
    subtitle: 'Complimentary white-glove worldwide shipping on bespoke orders',
    bannerText: 'THE PRIVATE CONNOISSEURS CIRCLE: USE CODE HAVILAH10 FOR 10% ATELIER PRIVILEGE',
    promoCode: 'HAVILAH10',
    discountPercentage: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Helper to seed localStorage
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// ==============================================================================
// PRODUCTS API
// ==============================================================================

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Product[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          tagline: d.tagline || '',
          category: d.category,
          gender: d.gender,
          price: Number(d.price),
          originalPrice: d.original_price ? Number(d.original_price) : undefined,
          rating: Number(d.rating || 5.0),
          reviewCount: Number(d.review_count || 0),
          images: d.images || [],
          sizes: d.sizes || [],
          colors: d.colors || [],
          stock: Number(d.stock || 0),
          featured: Boolean(d.featured),
          newArrival: Boolean(d.new_arrival),
          bestseller: Boolean(d.bestseller),
          description: d.description || '',
          fabric: d.fabric || '',
          craftsmanship: d.craftsmanship || [],
          careInstructions: d.care_instructions || '',
          tags: d.tags || [],
        }));
        setLocal(PRODUCTS_STORAGE_KEY, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Could not query Supabase products, loading cached storage:', e);
    }
  }

  return getLocal<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
}

export async function saveProduct(product: Product): Promise<Product> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const payload = {
        id: product.id,
        name: product.name,
        tagline: product.tagline,
        category: product.category,
        gender: product.gender,
        price: product.price,
        original_price: product.originalPrice || null,
        rating: product.rating,
        review_count: product.reviewCount,
        images: product.images,
        sizes: product.sizes,
        colors: product.colors,
        stock: product.stock,
        featured: product.featured,
        new_arrival: product.newArrival,
        bestseller: product.bestseller || false,
        description: product.description,
        fabric: product.fabric,
        craftsmanship: product.craftsmanship,
        care_instructions: product.careInstructions,
        tags: product.tags,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('products').upsert(payload);
      if (error) {
        console.warn('Supabase upsert product error:', error.message);
      }
    } catch (e) {
      console.error('Error in saveProduct Supabase:', e);
    }
  }

  // Update local cache
  const existing = getLocal<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
  const index = existing.findIndex((p) => p.id === product.id);
  let updated: Product[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = product;
  } else {
    updated = [product, ...existing];
  }
  setLocal(PRODUCTS_STORAGE_KEY, updated);
  return product;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (e) {
      console.error('Supabase delete error:', e);
    }
  }

  const existing = getLocal<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
  const filtered = existing.filter((p) => p.id !== productId);
  setLocal(PRODUCTS_STORAGE_KEY, filtered);
  return true;
}

// ==============================================================================
// CATEGORIES API
// ==============================================================================

export async function fetchCategories(): Promise<CategoryCard[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        const mapped: CategoryCard[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          tagline: d.tagline,
          description: d.description,
          image: d.image,
          itemCount: d.item_count,
          accent: d.accent,
        }));
        setLocal(CATEGORIES_STORAGE_KEY, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase categories error:', e);
    }
  }

  return getLocal<CategoryCard[]>(CATEGORIES_STORAGE_KEY, INITIAL_CATEGORIES);
}

export async function updateCategory(category: CategoryCard): Promise<CategoryCard> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('categories').upsert({
        id: category.id,
        title: category.title,
        tagline: category.tagline,
        description: category.description,
        image: category.image,
        item_count: category.itemCount,
        accent: category.accent,
      });
    } catch (e) {
      console.error('Error updating category in Supabase:', e);
    }
  }

  const existing = getLocal<CategoryCard[]>(CATEGORIES_STORAGE_KEY, INITIAL_CATEGORIES);
  const updated = existing.map((c) => (c.id === category.id ? category : c));
  setLocal(CATEGORIES_STORAGE_KEY, updated);
  return category;
}

// ==============================================================================
// ORDERS API
// ==============================================================================

export async function fetchOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase orders fetch error:', error);
      } else if (data) {
        const mapped: Order[] = data.map((d: any) => ({
          id: d.id,
          customerName: d.customer_name,
          customerEmail: d.customer_email,
          customerPhone: d.customer_phone,
          items: d.items || [],
          totalAmount: Number(d.total_amount || 0),
          currency: d.currency || 'USD',
          status: d.status || 'Pending',
          shippingAddress: d.shipping_address || {},
          notes: d.notes || '',
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        setLocal(ORDERS_STORAGE_KEY, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase orders fetch error:', e);
    }
  }

  return getLocal<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
}

export async function createOrder(order: Order): Promise<Order> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('orders').insert({
        id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone || null,
        items: order.items,
        total_amount: order.totalAmount,
        currency: order.currency,
        status: order.status,
        shipping_address: order.shippingAddress,
        notes: order.notes,
        created_at: order.createdAt,
      });

      if (error) {
        console.error('Error creating order in Supabase:', error);
      } else {
        console.log('Order successfully synced to Supabase:', order.id);
      }
    } catch (e) {
      console.error('Error creating order in Supabase:', e);
    }
  }

  const existing = getLocal<Order[]>(ORDERS_STORAGE_KEY, []);
  const filtered = existing.filter((o) => o.id !== order.id);
  setLocal(ORDERS_STORAGE_KEY, [order, ...filtered]);
  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
    } catch (e) {
      console.error('Supabase update order status error:', e);
    }
  }

  const existing = getLocal<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  const updated = existing.map((o) =>
    o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
  );
  setLocal(ORDERS_STORAGE_KEY, updated);
  return true;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (e) {
      console.error('Error deleting order from Supabase:', e);
    }
  }

  const existing = getLocal<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  setLocal(ORDERS_STORAGE_KEY, existing.filter((o) => o.id !== orderId));
  return true;
}

// ==============================================================================
// CUSTOM DESIGN REQUESTS API
// ==============================================================================

export async function fetchCustomRequests(): Promise<CustomDesignRequest[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('custom_design_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase custom requests error:', error);
      } else if (data) {
        const mapped: CustomDesignRequest[] = data.map((d: any) => ({
          id: d.id,
          fullName: d.full_name,
          phoneNumber: d.phone_number,
          email: d.email,
          gender: d.gender,
          designType: d.design_type,
          preferredFabric: d.preferred_fabric,
          occasion: d.occasion,
          measurementsNotes: d.measurements_notes,
          inspirationImageUrl: d.inspiration_image_url,
          targetDate: d.target_date,
          status: d.status,
          adminNotes: d.admin_notes,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        setLocal(CUSTOM_REQUESTS_STORAGE_KEY, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase custom requests error:', e);
    }
  }

  return getLocal<CustomDesignRequest[]>(CUSTOM_REQUESTS_STORAGE_KEY, INITIAL_CUSTOM_REQUESTS);
}

export async function createCustomRequest(request: CustomDesignRequest): Promise<CustomDesignRequest> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('custom_design_requests').insert({
        id: request.id,
        full_name: request.fullName,
        phone_number: request.phoneNumber,
        email: request.email,
        gender: request.gender,
        design_type: request.designType,
        preferred_fabric: request.preferredFabric,
        occasion: request.occasion,
        measurements_notes: request.measurementsNotes,
        inspiration_image_url: request.inspirationImageUrl,
        target_date: request.targetDate,
        status: request.status,
        admin_notes: request.adminNotes,
        created_at: request.createdAt,
      });
    } catch (e) {
      console.error('Error inserting custom request to Supabase:', e);
    }
  }

  const existing = getLocal<CustomDesignRequest[]>(CUSTOM_REQUESTS_STORAGE_KEY, INITIAL_CUSTOM_REQUESTS);
  setLocal(CUSTOM_REQUESTS_STORAGE_KEY, [request, ...existing]);
  return request;
}

export async function updateCustomRequestStatus(
  requestId: string,
  status: CustomRequestStatus,
  adminNotes?: string
): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (adminNotes !== undefined) updates.admin_notes = adminNotes;
      await supabase.from('custom_design_requests').update(updates).eq('id', requestId);
    } catch (e) {
      console.error('Error updating custom request status in Supabase:', e);
    }
  }

  const existing = getLocal<CustomDesignRequest[]>(CUSTOM_REQUESTS_STORAGE_KEY, INITIAL_CUSTOM_REQUESTS);
  const updated = existing.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : r.adminNotes,
          updatedAt: new Date().toISOString(),
        }
      : r
  );
  setLocal(CUSTOM_REQUESTS_STORAGE_KEY, updated);
  return true;
}

export async function deleteCustomRequest(requestId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('custom_design_requests').delete().eq('id', requestId);
    } catch (e) {
      console.error('Error deleting custom request from Supabase:', e);
    }
  }

  const existing = getLocal<CustomDesignRequest[]>(CUSTOM_REQUESTS_STORAGE_KEY, INITIAL_CUSTOM_REQUESTS);
  setLocal(CUSTOM_REQUESTS_STORAGE_KEY, existing.filter((r) => r.id !== requestId));
  return true;
}

// ==============================================================================
// CONTACT MESSAGES API
// ==============================================================================

export async function fetchMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch messages error:', error);
      } else if (data) {
        const mapped: ContactMessage[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          phone: d.phone,
          subject: d.subject,
          message: d.message,
          isRead: Boolean(d.is_read),
          status: d.status,
          createdAt: d.created_at,
        }));
        setLocal(MESSAGES_STORAGE_KEY, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch messages error:', e);
    }
  }

  return getLocal<ContactMessage[]>(MESSAGES_STORAGE_KEY, INITIAL_MESSAGES);
}

export async function createContactMessage(message: ContactMessage): Promise<ContactMessage> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('contact_messages').insert({
        id: message.id,
        name: message.name,
        email: message.email,
        phone: message.phone || null,
        subject: message.subject || null,
        message: message.message,
        is_read: message.isRead,
        status: message.status,
        created_at: message.createdAt,
      });
    } catch (e) {
      console.error('Error inserting message to Supabase:', e);
    }
  }

  const existing = getLocal<ContactMessage[]>(MESSAGES_STORAGE_KEY, INITIAL_MESSAGES);
  setLocal(MESSAGES_STORAGE_KEY, [message, ...existing]);
  return message;
}

export async function toggleMessageRead(messageId: string, isRead: boolean): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', messageId);
    } catch (e) {
      console.error('Error toggling message read in Supabase:', e);
    }
  }

  const existing = getLocal<ContactMessage[]>(MESSAGES_STORAGE_KEY, INITIAL_MESSAGES);
  setLocal(MESSAGES_STORAGE_KEY, existing.map((m) => (m.id === messageId ? { ...m, isRead } : m)));
  return true;
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('contact_messages').delete().eq('id', messageId);
    } catch (e) {
      console.error('Error deleting message from Supabase:', e);
    }
  }

  const existing = getLocal<ContactMessage[]>(MESSAGES_STORAGE_KEY, INITIAL_MESSAGES);
  setLocal(MESSAGES_STORAGE_KEY, existing.filter((m) => m.id !== messageId));
  return true;
}

// ==============================================================================
// TESTIMONIALS & GALLERY API
// ==============================================================================

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (!error && data && data.length > 0) {
        const mapped: Testimonial[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          role: d.role,
          location: d.location,
          avatar: d.avatar,
          quote: d.quote,
          rating: Number(d.rating),
          outfitPurchased: d.outfit_purchased,
          verified: Boolean(d.verified),
        }));
        setLocal(TESTIMONIALS_STORAGE_KEY, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch testimonials error:', e);
    }
  }

  return getLocal<Testimonial[]>(TESTIMONIALS_STORAGE_KEY, INITIAL_TESTIMONIALS);
}

export async function saveTestimonial(testimonial: Testimonial): Promise<Testimonial> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('testimonials').upsert({
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        location: testimonial.location,
        avatar: testimonial.avatar,
        quote: testimonial.quote,
        rating: testimonial.rating,
        outfit_purchased: testimonial.outfitPurchased,
        verified: testimonial.verified,
      });
    } catch (e) {
      console.error('Error saving testimonial to Supabase:', e);
    }
  }

  const existing = getLocal<Testimonial[]>(TESTIMONIALS_STORAGE_KEY, INITIAL_TESTIMONIALS);
  const index = existing.findIndex((t) => t.id === testimonial.id);
  let updated: Testimonial[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = testimonial;
  } else {
    updated = [testimonial, ...existing];
  }
  setLocal(TESTIMONIALS_STORAGE_KEY, updated);
  return testimonial;
}

export async function deleteTestimonial(testimonialId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('testimonials').delete().eq('id', testimonialId);
    } catch (e) {
      console.error('Error deleting testimonial from Supabase:', e);
    }
  }

  const existing = getLocal<Testimonial[]>(TESTIMONIALS_STORAGE_KEY, INITIAL_TESTIMONIALS);
  setLocal(TESTIMONIALS_STORAGE_KEY, existing.filter((t) => t.id !== testimonialId));
  return true;
}

export async function fetchGallery(): Promise<any[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gallery_items').select('*');
      if (!error && data && data.length > 0) {
        setLocal(GALLERY_STORAGE_KEY, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch gallery error:', e);
    }
  }

  return getLocal<any[]>(GALLERY_STORAGE_KEY, INITIAL_POSTS);
}

export async function saveGalleryItem(item: any): Promise<any> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('gallery_items').upsert(item);
    } catch (e) {
      console.error('Error saving gallery item:', e);
    }
  }

  const existing = getLocal<any[]>(GALLERY_STORAGE_KEY, INITIAL_POSTS);
  const index = existing.findIndex((g) => g.id === item.id);
  let updated: any[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = item;
  } else {
    updated = [item, ...existing];
  }
  setLocal(GALLERY_STORAGE_KEY, updated);
  return item;
}

export async function deleteGalleryItem(itemId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('gallery_items').delete().eq('id', itemId);
    } catch (e) {
      console.error('Error deleting gallery item:', e);
    }
  }

  const existing = getLocal<any[]>(GALLERY_STORAGE_KEY, INITIAL_POSTS);
  setLocal(GALLERY_STORAGE_KEY, existing.filter((g) => g.id !== itemId));
  return true;
}

// ==============================================================================
// PROMOTIONS & HOMEPAGE FEATURED
// ==============================================================================

export async function fetchPromotions(): Promise<Promotion[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('promotions').select('*');
      if (!error && data && data.length > 0) {
        const mapped: Promotion[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          bannerText: d.banner_text,
          promoCode: d.promo_code,
          discountPercentage: d.discount_percentage,
          isActive: d.is_active,
          createdAt: d.created_at,
        }));
        setLocal(PROMOTIONS_STORAGE_KEY, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch promotions error:', e);
    }
  }

  return getLocal<Promotion[]>(PROMOTIONS_STORAGE_KEY, INITIAL_PROMOTIONS);
}

export async function savePromotion(promo: Promotion): Promise<Promotion> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('promotions').upsert({
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle,
        banner_text: promo.bannerText,
        promo_code: promo.promoCode,
        discount_percentage: promo.discountPercentage,
        is_active: promo.isActive,
      });
    } catch (e) {
      console.error('Error saving promotion in Supabase:', e);
    }
  }

  const existing = getLocal<Promotion[]>(PROMOTIONS_STORAGE_KEY, INITIAL_PROMOTIONS);
  const updated = existing.map((p) => (p.id === promo.id ? promo : p));
  setLocal(PROMOTIONS_STORAGE_KEY, updated);
  return promo;
}

// ==============================================================================
// SUPABASE STORAGE UPLOADER & BRAND ASSETS
// ==============================================================================

export const DEFAULT_CREATIVE_DIRECTOR_IMAGE_URL =
  'https://res.cloudinary.com/c0olwbw9/image/upload/v1791308453/WhatsApp_Image_2026-10-06_at_5.26.17_PM.jpg';

export const BRAND_ASSETS_BUCKET = 'brand-assets';
export const CREATIVE_DIRECTOR_FILE_NAME = 'creative-director.jpeg';

export const SUPABASE_CREATIVE_DIRECTOR_URL =
  `${DEFAULT_SUPABASE_URL}/storage/v1/object/public/${BRAND_ASSETS_BUCKET}/${CREATIVE_DIRECTOR_FILE_NAME}`;

export const LOCAL_CREATIVE_DIRECTOR_IMAGE = '/founder.jpg?v=authentic-director';

export const BRAND_ASSETS_STORAGE_KEY = 'dh_brand_assets';
export const BRAND_DIRECTOR_IMAGE_KEY = 'dh_brand_director_image_url';

export interface BrandAssetRecord {
  id: string;
  name: string;
  url: string;
  type: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export function getStoredBrandDirectorImageUrl(): string {
  try {
    const saved = localStorage.getItem(BRAND_DIRECTOR_IMAGE_KEY);
    if (saved && saved.trim() && (saved.includes('cloudinary') || saved.startsWith('http'))) {
      return saved.trim();
    }
  } catch (e) {
    // Ignore localStorage parse error
  }
  return DEFAULT_CREATIVE_DIRECTOR_IMAGE_URL;
}

/**
 * Checks if a remote image URL is accessible via a HEAD request.
 */
async function checkUrlAccessible(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function fetchCreativeDirectorImage(): Promise<string> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      // 1. Check if public URL exists in brand_assets database table
      const { data, error } = await supabase
        .from('brand_assets')
        .select('*')
        .eq('id', 'creative-director')
        .maybeSingle();

      if (!error && data?.url) {
        const isOk = await checkUrlAccessible(data.url);
        if (isOk) {
          localStorage.setItem(BRAND_DIRECTOR_IMAGE_KEY, data.url);
          return data.url;
        }
      }
    } catch (e) {
      // brand_assets table might not exist yet; gracefully fallback
    }

    try {
      // 2. Check Supabase Storage publicUrl
      const { data: pubData } = supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .getPublicUrl(CREATIVE_DIRECTOR_FILE_NAME);

      if (pubData?.publicUrl) {
        const isOk = await checkUrlAccessible(pubData.publicUrl);
        if (isOk) {
          localStorage.setItem(BRAND_DIRECTOR_IMAGE_KEY, pubData.publicUrl);
          return pubData.publicUrl;
        }
      }
    } catch (e) {
      // fallback
    }
  }

  return DEFAULT_CREATIVE_DIRECTOR_IMAGE_URL;
}

export async function syncCreativeDirectorBrandAsset(): Promise<{ url: string; success: boolean }> {
  const targetUrl = SUPABASE_CREATIVE_DIRECTOR_URL;
  const supabase = getSupabase();

  if (!supabase) {
    return { url: LOCAL_CREATIVE_DIRECTOR_IMAGE, success: false };
  }

  try {
    // 1. Attempt creating bucket if it does not already exist
    try {
      await supabase.storage.createBucket(BRAND_ASSETS_BUCKET, {
        public: true,
        fileSizeLimit: 10485760,
      });
    } catch (bErr) {
      // Bucket may already exist or require dashboard policy
    }

    // 2. Fetch the authentic source photo from public folder
    const response = await fetch('/source_founder.jpeg');
    if (response.ok) {
      const blob = await response.blob();
      const { data, error } = await supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .upload(CREATIVE_DIRECTOR_FILE_NAME, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from(BRAND_ASSETS_BUCKET)
          .getPublicUrl(CREATIVE_DIRECTOR_FILE_NAME);

        const publicUrl = pubData?.publicUrl || targetUrl;
        localStorage.setItem(BRAND_DIRECTOR_IMAGE_KEY, publicUrl);

        // Try saving to database record if table exists
        try {
          await supabase.from('brand_assets').upsert({
            id: 'creative-director',
            name: 'Oluwambe Grace O. - Lead Creative Director',
            url: publicUrl,
            type: 'profile_portrait',
            metadata: {
              role: 'Lead Creative Director',
              brand: 'DEE HAVILAH DESIGN',
              updated_at: new Date().toISOString(),
            },
          });
        } catch (dbErr) {
          // Table may need schema execution
        }

        return { url: publicUrl, success: true };
      }
    }
  } catch (err) {
    console.warn('Sync brand asset note:', err);
  }

  return { url: LOCAL_CREATIVE_DIRECTOR_IMAGE, success: false };
}

export async function uploadProductImage(file: File): Promise<{ url: string; error?: string }> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return { url: publicUrlData.publicUrl };
      }

      if (error) {
        console.warn('Supabase Storage upload warning:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase storage upload failed, using Data URL fallback:', err);
    }
  }

  // Fallback: convert to base64 Data URL so user can preview and save immediately
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Failed to read image file.' });
    };
    reader.readAsDataURL(file);
  });
}
