import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, Eye, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { LookbookItem } from '../types';
import { LOOKBOOK_ITEMS, PRODUCTS } from '../data/fashionData';

interface LookbookProps {
  onShopProduct: (productId: string) => void;
}

export const Lookbook: React.FC<LookbookProps> = ({ onShopProduct }) => {
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'men' | 'women' | 'editorial'>('all');

  const filteredItems = LOOKBOOK_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.gender === filter;
  });

  const handleShopLook = (item: LookbookItem) => {
    setSelectedItem(null);
    if (item.featuredProductId) {
      onShopProduct(item.featuredProductId);
    } else {
      const el = document.querySelector('#collections');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="lookbook" className="py-24 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B89228]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#B89228] font-bold">
              EDITORIAL CURATION
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#B89228]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#062319]">
            THE DEE HAVILAH LOOKBOOK
          </h2>

          <div className="w-20 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />

          <p className="text-[#4A5D53] text-sm sm:text-base font-light max-w-xl mx-auto">
            High-fashion visual chronicles capturing the movement, texture, and nobility of our latest seasonal designs.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(['all', 'women', 'men', 'editorial'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 text-xs uppercase tracking-[0.16em] font-medium rounded-full transition-all duration-300 ${
                filter === tab
                  ? 'bg-[#062319] text-[#D4AF37] shadow-md font-semibold'
                  : 'bg-white text-[#2C3E35] border border-[#E8E2D5] hover:border-[#D4AF37]'
              }`}
            >
              {tab === 'all' ? 'All Looks' : `${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const isTall = idx % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedItem(item)}
                className={`group relative rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-[#041A13] border border-[#D4AF37]/20 hover:border-[#D4AF37] ${
                  isTall ? 'h-[480px]' : 'h-[380px]'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out filter brightness-95 group-hover:brightness-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#041A13] via-[#041A13]/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] bg-[#062319]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/30">
                    {item.category}
                  </span>
                </div>

                {/* Magnify Icon */}
                <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-[#D4AF37]" />
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[10px] font-mono tracking-widest text-[#F7E7BE] uppercase mb-1">
                    {item.collectionSeason}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-cream-50 group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-cream-200/80 font-light mt-1.5 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100">
                    {item.caption}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold tracking-wider uppercase">
                    <span>View Editorial</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            />

            <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative max-w-4xl w-full bg-[#062319] border border-[#D4AF37]/40 rounded-xl overflow-hidden shadow-2xl z-10 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:text-[#D4AF37] border border-white/20 hover:border-[#D4AF37] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left: Big Image */}
                  <div className="md:col-span-7 bg-[#041A13] max-h-[70vh] sm:max-h-[80vh] flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Right: Editorial Narrative */}
                  <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                        <span>{selectedItem.category}</span>
                        <span>•</span>
                        <span>{selectedItem.collectionSeason}</span>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
                        {selectedItem.title}
                      </h3>

                      <div className="w-12 h-1 bg-[#D4AF37] my-4 rounded-full" />

                      <p className="text-sm text-cream-200/85 leading-relaxed font-light">
                        {selectedItem.caption}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {selectedItem.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[10px] text-[#F7E7BE] uppercase tracking-wider"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
                      <button
                        type="button"
                        onClick={() => handleShopLook(selectedItem)}
                        className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-sm shadow-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Shop This Outfit
                      </button>

                      <a
                        href={`https://wa.me/2349069215630?text=Hello%20Dee%20Havilah,%20I%20am%20inquiring%20about%20the%20Lookbook%20style:%20${encodeURIComponent(selectedItem.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 border border-[#25D366]/60 text-cream-100 hover:text-white text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center justify-center gap-2 hover:bg-[#25D366]/10 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        Inquire on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
