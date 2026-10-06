import React from 'react';
import {
  ShoppingBag,
  Layers,
  Package,
  Scissors,
  Mail,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Product, Order, CustomDesignRequest, ContactMessage, CategoryCard } from '../../types';

interface AdminOverviewProps {
  products: Product[];
  categories: CategoryCard[];
  orders: Order[];
  customRequests: CustomDesignRequest[];
  messages: ContactMessage[];
  onNavigateTab: (tabId: string) => void;
  onOpenProductModal?: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  categories,
  orders,
  customRequests,
  messages,
  onNavigateTab,
}) => {
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'In Tailoring');
  const unreadMessages = messages.filter((m) => !m.isRead);
  const pendingCustomRequests = customRequests.filter(
    (r) => r.status === 'New' || r.status === 'Consultation Scheduled'
  );

  const totalRevenueUsd = orders.reduce((sum, o) => {
    if (o.status !== 'Cancelled') {
      return sum + o.totalAmount;
    }
    return sum;
  }, 0);

  const totalRevenueNgn = totalRevenueUsd * 1550;

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#062319]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-[#D4AF37] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cream-200/70">
              Total Garments
            </span>
            <div className="p-2 rounded-lg bg-[#041A13] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-cream-50">{products.length}</div>
          <div className="text-[11px] text-cream-200/60 mt-1 flex items-center gap-1">
            <span className="text-[#D4AF37] font-semibold">
              {products.filter((p) => p.featured).length}
            </span>{' '}
            featured on showcase
          </div>
        </div>

        {/* Metric 2: Collections */}
        <div
          onClick={() => onNavigateTab('collections')}
          className="bg-[#062319]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-[#D4AF37] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cream-200/70">
              Collections
            </span>
            <div className="p-2 rounded-lg bg-[#041A13] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-cream-50">{categories.length}</div>
          <div className="text-[11px] text-cream-200/60 mt-1">6 Signature lines active</div>
        </div>

        {/* Metric 3: Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-[#062319]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-[#D4AF37] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cream-200/70">
              Client Orders
            </span>
            <div className="p-2 rounded-lg bg-[#041A13] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-cream-50">{orders.length}</div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" />
            <span>{pendingOrders.length} pending fulfillment</span>
          </div>
        </div>

        {/* Metric 4: Custom Requests */}
        <div
          onClick={() => onNavigateTab('custom-requests')}
          className="bg-[#062319]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-[#D4AF37] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cream-200/70">
              Bespoke Requests
            </span>
            <div className="p-2 rounded-lg bg-[#041A13] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-cream-50">
            {customRequests.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>{pendingCustomRequests.length} awaiting review</span>
          </div>
        </div>

        {/* Metric 5: Messages */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="bg-[#062319]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-[#D4AF37] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cream-200/70">
              Inquiries
            </span>
            <div className="p-2 rounded-lg bg-[#041A13] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-cream-50">{messages.length}</div>
          <div className="text-[11px] text-rose-400 mt-1 font-medium">
            {unreadMessages.length > 0 ? `${unreadMessages.length} unread messages` : 'All inquiries read'}
          </div>
        </div>

        {/* Metric 6: Revenue */}
        <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#D4AF37] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cream-200/70">
              Atelier Revenue
            </span>
            <div className="p-2 rounded-lg bg-[#041A13] border border-[#D4AF37]/20">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-cream-50">
            ${totalRevenueUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-cream-200/50 mt-1 font-mono">
            ≈ ₦{totalRevenueNgn.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Recent Bespoke Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Client Orders */}
        <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-cream-50">Recent Client Orders</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-cream-200/50 italic py-6 text-center">
              No orders recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-white/5 space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#D4AF37]">{order.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : order.status === 'Dispatched'
                            ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                            : order.status === 'In Tailoring'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            : 'bg-stone-900 text-cream-200 border border-white/20'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-cream-100">{order.customerName}</p>
                    <p className="text-[11px] text-cream-200/60">
                      {order.items.length} garment(s) • Total: ${order.totalAmount}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateTab('orders')}
                    className="p-2 text-cream-200/60 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-colors"
                    title="View order"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bespoke Custom Requests */}
        <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-4">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-cream-50">
                Bespoke Commissions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('custom-requests')}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All ({customRequests.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {customRequests.length === 0 ? (
            <p className="text-xs text-cream-200/50 italic py-6 text-center">
              No custom design requests recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-white/5 space-y-3">
              {customRequests.slice(0, 4).map((req) => (
                <div key={req.id} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-semibold text-cream-100">
                        {req.fullName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                        {req.designType}
                      </span>
                    </div>
                    <p className="text-[11px] text-cream-200/70">
                      Fabric: <strong className="text-cream-100">{req.preferredFabric}</strong> • Occasion: {req.occasion}
                    </p>
                    <p className="text-[10px] text-cream-200/50">
                      Target: {req.targetDate || 'Not specified'} • Status: {req.status}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/${req.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${req.fullName}, this is Dee Havilah Design Atelier regarding your bespoke ${req.designType} request.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-lg transition-colors border border-[#25D366]/40"
                    title="Connect on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
