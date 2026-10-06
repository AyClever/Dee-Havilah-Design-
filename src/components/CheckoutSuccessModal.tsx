import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, MessageCircle, Sparkles, X, PackageCheck, ShieldCheck } from 'lucide-react';

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderInfo?: {
    orderNumber: string;
    customerName: string;
    whatsappNumber?: string;
  } | null;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  isOpen,
  onClose,
  orderInfo,
}) => {
  if (!isOpen) return null;

  const orderNumber = orderInfo?.orderNumber || `DH-${Math.floor(100000 + Math.random() * 900000)}`;
  const clientName = orderInfo?.customerName ? `, ${orderInfo.customerName}` : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#041A13] text-white border border-[#D4AF37]/50 rounded-2xl p-8 sm:p-10 shadow-2xl z-10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] mb-4 mt-2">
              <PackageCheck className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">
              Order Confirmed • Reference: {orderNumber}
            </span>

            <h2 className="font-serif text-3xl font-bold text-cream-50 mt-2">
              Thank You for Patronizing Dee Havilah{clientName}
            </h2>

            <div className="w-16 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />

            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed font-light">
              Your garments have entered our Atelier preparation pipeline. Our private client logistics team will assign an insured courier tracking dispatch to your destination.
            </p>

            <div className="my-6 p-4 bg-[#062319] border border-[#D4AF37]/30 rounded-lg text-left text-xs space-y-1.5 text-cream-200/80">
              {orderInfo?.customerName && (
                <div className="flex justify-between">
                  <span>Client Name:</span>
                  <strong className="text-cream-50">{orderInfo.customerName}</strong>
                </div>
              )}
              {orderInfo?.whatsappNumber && (
                <div className="flex justify-between">
                  <span>WhatsApp Contact:</span>
                  <strong className="text-cream-50 font-mono">{orderInfo.whatsappNumber}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span>Atelier Status:</span>
                <strong className="text-[#D4AF37]">Garment Preparation & Inspection</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Dispatch:</span>
                <strong className="text-cream-50">Within 3-5 Business Days</strong>
              </div>
              <div className="flex justify-between">
                <span>Packaging:</span>
                <strong className="text-cream-50">Velvet-Lined Presentation Box</strong>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/2349069215630?text=${encodeURIComponent(
                  `Hello Dee Havilah, I am ${orderInfo?.customerName || 'a client'} following up on my order reference: ${orderNumber}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-md flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Track with Atelier Concierge on WhatsApp
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs uppercase tracking-wider font-semibold rounded-md transition-colors"
              >
                Return to Showroom
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
