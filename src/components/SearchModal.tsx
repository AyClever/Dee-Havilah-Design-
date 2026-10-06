import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { PRODUCTS } from '../data/fashionData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  currency: CurrencyConfig;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  currency,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const popularSearches = ['Agbada', 'Silk Gown', 'Senator', 'Corporate Suit', 'Bespoke', 'Adire'];

  const formatPrice = (usd: number) => {
    const val = Math.round(usd * currency.rate);
    return `${currency.symbol}${val.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        <div className="flex min-h-screen items-start justify-center p-4 sm:p-6 pt-20 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D4AF37]/40 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-6 border-b border-[#E8E2D5] bg-[#FAF8F5] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#B89228]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search African wear, gowns, suits, fabrics..."
                className="w-full bg-transparent border-none text-base sm:text-lg text-[#062319] placeholder-[#8A9B92] focus:outline-none font-serif"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-[#8A9B92] hover:text-[#062319]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#062319] hover:bg-black/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popular search tags when query is empty */}
            {!query.trim() ? (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6A7E74]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B89228]" />
                  <span>Popular Inquiries</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/30 text-xs font-medium text-[#062319] hover:bg-[#062319] hover:text-[#D4AF37] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#E8E2D5] text-xs text-[#8A9B92] font-serif italic text-center">
                  "Elegance Woven Into Every Style" — Search our complete atelier catalog
                </div>
              </div>
            ) : (
              /* Search Results List */
              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#6A7E74] mb-2">
                  Found {searchResults.length} {searchResults.length === 1 ? 'Design' : 'Designs'}
                </p>

                {searchResults.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <p className="font-serif text-lg text-[#062319]">No exact matches found</p>
                    <p className="text-xs text-[#55695F]">
                      Try searching for broader terms like "silk", "suit", "agbada", or "gown".
                    </p>
                  </div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#FAF8F5] border border-transparent hover:border-[#D4AF37]/30 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-md border border-black/10"
                        />
                        <div>
                          <h4 className="font-serif text-sm font-bold text-[#062319] group-hover:text-[#B89228] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-[#55695F]">{product.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-sm text-[#062319]">
                          {formatPrice(product.price)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#B89228] transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
