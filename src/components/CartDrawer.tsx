import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, User, Mail, Phone, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { CartItem, CurrencyConfig, Order } from '../types';
import { createOrder } from '../services/supabase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currency: CurrencyConfig;
  onCheckoutComplete: (orderInfo: {
    orderNumber: string;
    customerName: string;
    whatsappNumber: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
  onCheckoutComplete,
}) => {
  // Step state: 'bag' | 'customer_details'
  const [checkoutStep, setCheckoutStep] = useState<'bag' | 'customer_details'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [formError, setFormError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotalUsd = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatPrice = (usd: number) => {
    const val = Math.round(usd * currency.rate);
    return `${currency.symbol}${val.toLocaleString()}`;
  };

  const handleStartDetails = () => {
    if (items.length === 0) return;
    setFormError('');
    setCheckoutStep('customer_details');
  };

  const handleBackToBag = () => {
    setFormError('');
    setCheckoutStep('bag');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!whatsappNumber.trim()) {
      setFormError('Please enter your WhatsApp phone number.');
      return;
    }

    setIsCheckingOut(true);

    const orderNumber = `DH-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const newOrder: Order = {
        id: orderNumber,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: whatsappNumber.trim(),
        items: items.map((i) => ({
          id: i.id,
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          size: i.selectedSize,
          colorName: i.selectedColor.name,
          colorHex: i.selectedColor.hex,
          image: i.product.images[0] || '/collections/african-wear.jpg',
        })),
        totalAmount: subtotalUsd,
        currency: currency.code,
        status: 'Pending',
        shippingAddress: {
          street: 'Express Courier Dispatch',
          city: 'Lagos',
          country: 'Nigeria',
        },
        createdAt: new Date().toISOString(),
      };

      await createOrder(newOrder);
    } catch (e) {
      console.warn('Could not record order to Supabase:', e);
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      onCheckoutComplete({
        orderNumber,
        customerName: customerName.trim(),
        whatsappNumber: whatsappNumber.trim(),
      });
      setCheckoutStep('bag');
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E8E2D5] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {checkoutStep === 'customer_details' ? (
                <button
                  type="button"
                  onClick={handleBackToBag}
                  className="mr-1 p-1 text-[#062319]/70 hover:text-[#062319] rounded-full hover:bg-black/5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <ShoppingBag className="w-5 h-5 text-[#062319]" />
              )}
              <h2 className="font-serif text-xl font-bold text-[#062319]">
                {checkoutStep === 'customer_details'
                  ? 'Client Details'
                  : `Your Shopping Bag (${items.reduce((acc, i) => acc + i.quantity, 0)})`}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#062319]/70 hover:text-[#062319] rounded-full hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          {checkoutStep === 'customer_details' ? (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              <form id="checkout-details-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
                <div className="bg-[#FAF8F5] border border-[#E8E2D5] p-4 rounded-lg">
                  <p className="text-xs text-[#062319] font-medium leading-relaxed">
                    Please provide your contact information so our atelier concierge can confirm sizing and coordinate insured delivery dispatch.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                    {formError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#062319] mb-1.5">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8A9B92] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Lady Folashade Adeleke"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4AF37]/50 rounded-md text-sm text-[#062319] focus:outline-none focus:border-[#062319] focus:ring-1 focus:ring-[#062319]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#062319] mb-1.5">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A9B92] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4AF37]/50 rounded-md text-sm text-[#062319] focus:outline-none focus:border-[#062319] focus:ring-1 focus:ring-[#062319]"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#062319] mb-1.5">
                    WhatsApp Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8A9B92] absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. +234 801 234 5678"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4AF37]/50 rounded-md text-sm text-[#062319] focus:outline-none focus:border-[#062319] focus:ring-1 focus:ring-[#062319]"
                    />
                  </div>
                  <span className="text-[11px] text-[#55695F] mt-1 block">
                    Used to send WhatsApp updates and order dispatch tracking.
                  </span>
                </div>

                {/* Order mini-summary */}
                <div className="pt-3 border-t border-[#E8E2D5] space-y-1.5 text-xs text-[#55695F]">
                  <div className="flex justify-between">
                    <span>Selected Garments ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                    <span className="font-mono text-[#062319] font-semibold">{formatPrice(subtotalUsd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured White Glove Courier</span>
                    <span className="text-emerald-700 font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#062319] pt-2 border-t border-black/10">
                    <span>Total Amount</span>
                    <span className="font-serif text-lg text-[#062319]">{formatPrice(subtotalUsd)}</span>
                  </div>
                </div>
              </form>

              <div className="pt-6 space-y-3">
                <button
                  type="submit"
                  form="checkout-details-form"
                  disabled={isCheckingOut}
                  className="w-full py-3.5 bg-[#062319] hover:bg-[#0B3B2C] text-[#D4AF37] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-md shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <span>Confirming Order with Atelier...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#6A7E74] text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89228]" />
                  <span>Personal Data Protected • Encrypted Atelier Records</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-[#062319]">Your bag is currently empty</h3>
                    <p className="text-xs text-[#55695F] max-w-xs mx-auto">
                      Explore our curated collections of African wear, ready-to-wear, and corporate bespoke.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 bg-[#062319] text-[#D4AF37] text-xs uppercase tracking-wider font-semibold rounded-sm cursor-pointer"
                    >
                      Explore Collections
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D5] relative group"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded-md border border-black/10 flex-shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-bold text-[#062319] line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#8A9B92] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[#55695F] mt-1">
                            <span>Size: <strong className="text-[#062319]">{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              Color:
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <strong className="text-[#062319]">{item.selectedColor.name}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-[#D4AF37]/40 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-[#062319] hover:bg-black/5 cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-[#062319]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-[#062319] hover:bg-black/5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-serif font-bold text-sm text-[#062319]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer & Checkout Breakdown */}
              {items.length > 0 && (
                <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E2D5] space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-1.5 text-xs text-[#55695F]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-[#062319] font-medium">{formatPrice(subtotalUsd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Courier Shipping</span>
                      <span className="font-mono text-[#062319]">
                        <strong className="text-emerald-700">Complimentary</strong>
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#062319] pt-2 border-t border-black/10">
                      <span>Total Due</span>
                      <span className="font-serif text-lg text-[#062319]">
                        {formatPrice(subtotalUsd)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed Button */}
                  <button
                    type="button"
                    onClick={handleStartDetails}
                    className="w-full py-3.5 bg-[#062319] hover:bg-[#0B3B2C] text-[#D4AF37] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-md shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#6A7E74] text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B89228]" />
                    <span>SSL Encrypted Checkout • White Glove Courier Delivery</span>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
