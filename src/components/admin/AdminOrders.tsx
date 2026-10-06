import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MessageCircle,
  Mail,
  Trash2,
  X,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onRefreshOrders?: () => Promise<void>;
  isRefreshing?: boolean;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'In Tailoring',
  'Quality Check',
  'Dispatched',
  'Delivered',
  'Cancelled',
];

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onRefreshOrders,
  isRefreshing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(orderId, status);
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder({ ...activeOrder, status });
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
      case 'Dispatched':
        return 'bg-blue-950/80 text-blue-400 border-blue-500/40';
      case 'In Tailoring':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
      case 'Quality Check':
        return 'bg-purple-950/80 text-purple-400 border-purple-500/40';
      case 'Cancelled':
        return 'bg-red-950/80 text-red-400 border-red-500/40';
      default:
        return 'bg-stone-900 text-cream-200 border-white/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-cream-50">
          Client Orders & Tailoring Pipeline
        </h2>
        <p className="text-xs text-cream-200/70 mt-1">
          Monitor incoming online store orders, update atelier tailoring status, and dispatch tracking details.
        </p>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-[#062319]/80 border border-[#D4AF37]/30 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cream-200/50 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Client Name, Email, or WhatsApp..."
            className="w-full pl-10 pr-4 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Statuses ({orders.length})</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {onRefreshOrders && (
            <button
              type="button"
              onClick={onRefreshOrders}
              disabled={isRefreshing}
              className="px-3 py-2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh client orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-cream-200/90">
            <thead className="bg-[#041A13] border-b border-[#D4AF37]/30 text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Garments</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cream-200/50 italic">
                    No client orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37]">
                      {order.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-serif font-bold text-cream-100">{order.customerName}</p>
                        <p className="text-[11px] text-cream-200/60 font-mono">{order.customerEmail}</p>
                        {order.customerPhone && (
                          <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                            <MessageCircle className="w-3 h-3" />
                            {order.customerPhone}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-cream-50">
                          {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                        </span>
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-[#062319] object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-cream-50">
                      ${order.totalAmount}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-cream-200/60">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          order.status
                        )} bg-[#041A13] focus:outline-none cursor-pointer`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st} className="bg-[#041A13] text-cream-100">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveOrder(order)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-[#D4AF37] hover:text-[#041A13] text-[#D4AF37] border border-[#D4AF37]/30 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderToDelete(order)}
                          className="p-1 text-cream-200/50 hover:text-red-400 rounded"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Dossier Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#062319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden text-cream-50"
          >
            {/* Header */}
            <div className="p-6 bg-[#041A13] border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">
                    {activeOrder.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                      activeOrder.status
                    )}`}
                  >
                    {activeOrder.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-cream-50 mt-1">
                  Private Client Order Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="text-cream-200/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Client Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#041A13] border border-[#D4AF37]/20">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold">
                    Client Details
                  </span>
                  <p className="font-serif font-bold text-cream-100 text-sm mt-1">
                    {activeOrder.customerName}
                  </p>
                  <p className="text-xs text-cream-200/70 font-mono">{activeOrder.customerEmail}</p>
                  {activeOrder.customerPhone && (
                    <p className="text-xs text-cream-200/70 font-mono mt-0.5">
                      {activeOrder.customerPhone}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold">
                    Delivery Address
                  </span>
                  <p className="text-xs text-cream-200/80 mt-1">
                    {activeOrder.shippingAddress?.street || 'Standard Courier Address'}
                  </p>
                  <p className="text-xs text-cream-200/80">
                    {[
                      activeOrder.shippingAddress?.city,
                      activeOrder.shippingAddress?.state,
                      activeOrder.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] block font-semibold">
                  Garments in Commission ({activeOrder.items.length})
                </span>

                <div className="divide-y divide-white/10 rounded-xl bg-[#041A13] border border-white/10 overflow-hidden">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 object-cover rounded-md border border-[#D4AF37]/30"
                        />
                        <div>
                          <p className="font-serif font-semibold text-cream-100 text-xs">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-cream-200/70 mt-1">
                            <span>Size: <strong>{item.size}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              Color:
                              <span
                                className="w-2 h-2 rounded-full inline-block border border-white/30"
                                style={{ backgroundColor: item.colorHex }}
                              />
                              {item.colorName}
                            </span>
                            <span>•</span>
                            <span>Qty: <strong>{item.quantity}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs font-bold text-[#D4AF37]">
                        ${item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {activeOrder.notes && (
                <div className="p-3.5 rounded-lg bg-[#041A13] border border-[#D4AF37]/20 text-xs text-cream-200/80">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold mb-1">
                    Special Tailoring / Delivery Instructions:
                  </span>
                  {activeOrder.notes}
                </div>
              )}

              {/* Quick Communication Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                {activeOrder.customerPhone && (
                  <a
                    href={`https://wa.me/${activeOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${activeOrder.customerName}, this is Dee Havilah Design Atelier regarding your order ${activeOrder.id}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Concierge</span>
                  </a>
                )}

                <a
                  href={`mailto:${activeOrder.customerEmail}?subject=${encodeURIComponent(
                    `Dee Havilah Design Atelier - Order ${activeOrder.id} Update`
                  )}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-cream-100 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span>Email Client</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Order Confirmation */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#062319] border border-red-500/50 rounded-2xl p-6 shadow-2xl text-cream-50">
            <h3 className="font-serif text-lg font-bold text-center text-cream-100">
              Confirm Order Deletion
            </h3>
            <p className="text-xs text-cream-200/80 text-center mt-2 font-light">
              Are you sure you want to remove order <strong className="text-white">{orderToDelete.id}</strong> for{' '}
              {orderToDelete.customerName}?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDeleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
