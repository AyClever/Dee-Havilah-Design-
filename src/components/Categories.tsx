import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Scissors, ShoppingBag } from 'lucide-react';
import { ProductCategory, CategoryCard } from '../types';
import { CATEGORIES } from '../data/fashionData';

interface CategoriesProps {
  categories?: CategoryCard[];
  onSelectCategory: (category: ProductCategory) => void;
  onOpenCustomDesign: () => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories = CATEGORIES,
  onSelectCategory,
  onOpenCustomDesign,
}) => {
  const handleCardClick = (category: ProductCategory) => {
    if (category === 'Custom Designs') {
      onOpenCustomDesign();
      return;
    }
    onSelectCategory(category);
    const element = document.querySelector('#collections');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-24 sm:py-32 bg-[#062319] text-white relative overflow-hidden">
      {/* Subtle Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0E4937]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#D4AF37] font-bold">
              THE COLLECTIONS
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cream-50">
            CURATED LUXURY BY CATEGORY
          </h2>

          <div className="w-20 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />

          <p className="text-cream-200/80 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            From regal hand-embroidered African attire to bespoke corporate tailoring, explore distinctive silhouettes crafted for global prestige.
          </p>
        </div>

        {/* 6 Category Editorial Cards Grid - Uniform 3:4 aspect ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {categories.map((cat, idx) => {
            const isCustom = cat.id === 'Custom Designs';
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => handleCardClick(cat.id)}
                className="group cursor-pointer relative rounded-lg overflow-hidden bg-[#041A13] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-500 shadow-2xl flex flex-col"
              >
                {/* Image Container with Consistent 3:4 Aspect Ratio */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#041A13]">
                  <img
                    src={cat.image}
                    alt={`${cat.title} - DEE HAVILAH DESIGN`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Editorial Vignette & Gradient for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041A13] via-[#041A13]/40 to-transparent opacity-95 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

                  {/* Top Badge: Item count or Bespoke */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#F7E7BE] bg-[#041A13]/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-md">
                      {isCustom ? 'Bespoke Atelier' : `${cat.itemCount} Garments`}
                    </span>

                    <div className="w-9 h-9 rounded-full bg-[#041A13]/80 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#041A13] transition-all duration-300 shadow-md">
                      {isCustom ? (
                        <Scissors className="w-4 h-4 transform group-hover:rotate-45 transition-transform" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 z-10 flex flex-col justify-end">
                    <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.22em] text-[#D4AF37] uppercase font-semibold mb-1.5">
                      {cat.accent}
                    </p>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {cat.title}
                    </h3>

                    <p className="text-xs text-cream-200/85 font-light mt-2 line-clamp-2 leading-relaxed">
                      {cat.tagline}
                    </p>

                    {/* Action Callout */}
                    <div className="mt-4 pt-3 border-t border-[#D4AF37]/25 flex items-center justify-between text-xs tracking-widest uppercase font-bold text-[#F7E7BE] group-hover:text-[#D4AF37] transition-colors">
                      <span className="flex items-center gap-1.5">
                        {isCustom ? (
                          <>
                            <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                            Request Bespoke
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                            View Collection
                          </>
                        )}
                      </span>
                      <span className="w-6 h-[1.5px] bg-[#D4AF37] group-hover:w-10 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Collection Footer Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-xl bg-gradient-to-r from-[#041A13] via-[#0B3B2C] to-[#041A13] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#F7E7BE]">
              Looking for a Unique Silhouette?
            </h4>
            <p className="text-xs sm:text-sm text-cream-200/80 font-light mt-1 max-w-xl">
              Our master artisans in Lagos craft one-of-a-kind royal wedding attire, ceremonial robes, and red-carpet garments tailored specifically to your dimensions.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCustomDesign}
            className="shrink-0 px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] text-xs uppercase tracking-[0.22em] font-bold rounded-sm shadow-xl transition-all"
          >
            START BESPOKE ORDER
          </button>
        </div>
      </div>
    </section>
  );
};
