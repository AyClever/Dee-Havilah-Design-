import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  currency: CurrencyConfig;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
  currency,
}) => {
  if (!isOpen) return null;

  const formatPrice = (usd: number) => {
    const val = Math.round(usd * currency.rate);
    return `${currency.symbol}${val.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
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
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="font-serif text-xl font-bold text-[#062319]">
                Saved Creations ({items.length})
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <Heart className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#062319]">Your wishlist is empty</h3>
                <p className="text-xs text-[#55695F] max-w-xs mx-auto">
                  Click the heart icon on any garment to preserve your favorite haute couture pieces.
                </p>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D5]"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-md border border-black/10 flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4
                          className="font-serif text-sm font-bold text-[#062319] line-clamp-1 cursor-pointer hover:text-[#B89228]"
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                        >
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-[#8A9B92] hover:text-rose-600 p-1"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#55695F] uppercase tracking-wider mt-0.5">
                        {product.category}
                      </p>
                      <p className="font-serif font-bold text-sm text-[#062319] mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product.id);
                      }}
                      className="mt-2 py-1.5 px-3 bg-[#062319] hover:bg-[#0B3B2C] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Move to Bag
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#E8E2D5] bg-[#FAF8F5]">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 border border-[#062319] text-[#062319] hover:bg-[#062319] hover:text-[#D4AF37] text-xs uppercase tracking-wider font-semibold rounded-md transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
