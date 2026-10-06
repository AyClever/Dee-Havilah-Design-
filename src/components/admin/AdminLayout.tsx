import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Package,
  Scissors,
  Mail,
  Star,
  Tag,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '../Logo';
import { AdminUser, Product, CategoryCard, Order, CustomDesignRequest, ContactMessage, Testimonial, Promotion, OrderStatus, CustomRequestStatus } from '../../types';
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  fetchCategories,
  updateCategory,
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
  fetchCustomRequests,
  updateCustomRequestStatus,
  deleteCustomRequest,
  fetchMessages,
  toggleMessageRead,
  deleteMessage,
  fetchTestimonials,
  saveTestimonial,
  deleteTestimonial,
  fetchGallery,
  saveGalleryItem,
  deleteGalleryItem,
  fetchPromotions,
  savePromotion,
  signOutAdmin,
  AUTHORIZED_ADMIN_EMAIL,
} from '../../services/supabase';

// Sub-components
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCollections } from './AdminCollections';
import { AdminOrders } from './AdminOrders';
import { AdminCustomRequests } from './AdminCustomRequests';
import { AdminMessages } from './AdminMessages';
import { AdminTestimonialsGallery } from './AdminTestimonialsGallery';
import { AdminPromotions } from './AdminPromotions';

interface AdminLayoutProps {
  user: AdminUser;
  onLogout: () => void;
  onBackToBoutique: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout, onBackToBoutique }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomDesignRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);

  // Refresh orders on demand
  const handleRefreshOrders = async () => {
    setIsRefreshingOrders(true);
    try {
      const ords = await fetchOrders();
      setOrders(ords);
    } catch (err) {
      console.error('Error refreshing orders:', err);
    } finally {
      setIsRefreshingOrders(false);
    }
  };

  // Load all data on mount
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [
        prods,
        cats,
        ords,
        custs,
        msgs,
        tests,
        galls,
        proms,
      ] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchCustomRequests(),
        fetchMessages(),
        fetchTestimonials(),
        fetchGallery(),
        fetchPromotions(),
      ]);

      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setCustomRequests(custs);
      setMessages(msgs);
      setTestimonials(tests);
      setGalleryItems(galls);
      setPromotions(proms);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();

    // Background poller every 20 seconds to keep incoming orders synced
    const timer = setInterval(async () => {
      try {
        const latest = await fetchOrders();
        setOrders(latest);
      } catch (e) {
        // silent background check
      }
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  // Product Actions
  const handleSaveProduct = async (product: Product) => {
    await saveProduct(product);
    await loadAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    await loadAllData();
  };

  const handleToggleProductFeatured = async (productId: string, featured: boolean) => {
    const target = products.find((p) => p.id === productId);
    if (target) {
      await saveProduct({ ...target, featured });
      await loadAllData();
    }
  };

  // Category Actions
  const handleUpdateCategory = async (cat: CategoryCard) => {
    await updateCategory(cat);
    await loadAllData();
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    await loadAllData();
  };

  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId);
    await loadAllData();
  };

  // Custom Request Actions
  const handleUpdateCustomRequestStatus = async (
    id: string,
    status: CustomRequestStatus,
    adminNotes?: string
  ) => {
    await updateCustomRequestStatus(id, status, adminNotes);
    await loadAllData();
  };

  const handleDeleteCustomRequest = async (id: string) => {
    await deleteCustomRequest(id);
    await loadAllData();
  };

  // Messages Actions
  const handleToggleMessageRead = async (id: string, isRead: boolean) => {
    await toggleMessageRead(id, isRead);
    await loadAllData();
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id);
    await loadAllData();
  };

  // Testimonials & Gallery Actions
  const handleSaveTestimonial = async (t: Testimonial) => {
    await saveTestimonial(t);
    await loadAllData();
  };

  const handleDeleteTestimonial = async (id: string) => {
    await deleteTestimonial(id);
    await loadAllData();
  };

  const handleSaveGallery = async (item: any) => {
    await saveGalleryItem(item);
    await loadAllData();
  };

  const handleDeleteGallery = async (id: string) => {
    await deleteGalleryItem(id);
    await loadAllData();
  };

  // Promotion Actions
  const handleSavePromotion = async (p: Promotion) => {
    await savePromotion(p);
    await loadAllData();
  };

  // Badges calculation
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'In Tailoring').length;
  const newRequestsCount = customRequests.filter((r) => r.status === 'New').length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Garment Catalog', icon: ShoppingBag, badge: products.length },
    { id: 'collections', label: 'Signature Collections', icon: Layers, badge: categories.length },
    { id: 'orders', label: 'Client Orders', icon: Package, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-amber-400 text-[#041A13]' },
    { id: 'custom-requests', label: 'Bespoke Requests', icon: Scissors, badge: newRequestsCount > 0 ? newRequestsCount : undefined, badgeColor: 'bg-[#D4AF37] text-[#041A13]' },
    { id: 'messages', label: 'Salon Inquiries', icon: Mail, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'testimonials-gallery', label: 'Lookbook & VIP Reviews', icon: Star },
    { id: 'promotions', label: 'Homepage & Privileges', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#041A13] text-cream-50 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#062319]/95 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-cream-200/80 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <Logo variant="emblem-only" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-[0.18em] text-cream-50">
                  DEE HAVILAH
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  Staff Atelier
                </span>
              </div>
              <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] font-medium block">
                HAUTE COUTURE MANAGEMENT
              </span>
            </div>
          </div>
        </div>

        {/* Right Header items */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin User Chip */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#041A13] border border-[#D4AF37]/20 rounded-full text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-cream-200/90 font-mono text-[11px] truncate max-w-[180px]">
              {AUTHORIZED_ADMIN_EMAIL}
            </span>
          </div>

          {/* View Boutique Button */}
          <button
            type="button"
            onClick={onBackToBoutique}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-[#D4AF37]/30 text-cream-100 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">View Boutique</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={async () => {
              await signOutAdmin();
              onLogout();
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sign out of Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#062319] border-r border-[#D4AF37]/30 flex flex-col justify-between pt-16 md:pt-0 transition-transform duration-300 md:static md:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Atelier Operations
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#041A13] font-bold shadow-lg shadow-[#D4AF37]/20'
                      : 'text-cream-200/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#041A13]' : 'text-[#D4AF37]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isActive
                          ? 'bg-[#041A13] text-[#D4AF37]'
                          : item.badgeColor || 'bg-white/10 text-cream-100'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-[#D4AF37]/20 bg-[#041A13]/60 text-xs">
            <div className="flex items-center gap-2 text-cream-200/70 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>RLS Security: Enforced</span>
            </div>
            <p className="text-[10px] text-cream-200/40 mt-1 font-mono">
              Authorized: {AUTHORIZED_ADMIN_EMAIL}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#041A13]">
          {isLoadingData ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-cream-200/70">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest font-mono text-[#D4AF37]">
                Synchronizing Atelier Records...
              </p>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && (
                <AdminOverview
                  products={products}
                  categories={categories}
                  orders={orders}
                  customRequests={customRequests}
                  messages={messages}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenProductModal={() => setActiveTab('products')}
                />
              )}

              {activeTab === 'products' && (
                <AdminProducts
                  products={products}
                  onSaveProduct={handleSaveProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === 'collections' && (
                <AdminCollections
                  categories={categories}
                  onUpdateCategory={handleUpdateCategory}
                />
              )}

              {activeTab === 'orders' && (
                <AdminOrders
                  orders={orders}
                  onUpdateStatus={handleUpdateOrderStatus}
                  onDeleteOrder={handleDeleteOrder}
                  onRefreshOrders={handleRefreshOrders}
                  isRefreshing={isRefreshingOrders}
                />
              )}

              {activeTab === 'custom-requests' && (
                <AdminCustomRequests
                  requests={customRequests}
                  onUpdateStatus={handleUpdateCustomRequestStatus}
                  onDeleteRequest={handleDeleteCustomRequest}
                />
              )}

              {activeTab === 'messages' && (
                <AdminMessages
                  messages={messages}
                  onToggleRead={handleToggleMessageRead}
                  onDeleteMessage={handleDeleteMessage}
                />
              )}

              {activeTab === 'testimonials-gallery' && (
                <AdminTestimonialsGallery
                  testimonials={testimonials}
                  galleryItems={galleryItems}
                  onSaveTestimonial={handleSaveTestimonial}
                  onDeleteTestimonial={handleDeleteTestimonial}
                  onSaveGalleryItem={handleSaveGallery}
                  onDeleteGalleryItem={handleDeleteGallery}
                />
              )}

              {activeTab === 'promotions' && (
                <AdminPromotions
                  promotions={promotions}
                  products={products}
                  onSavePromotion={handleSavePromotion}
                  onToggleProductFeatured={handleToggleProductFeatured}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
