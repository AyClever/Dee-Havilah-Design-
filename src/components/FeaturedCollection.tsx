import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ShoppingBag, Heart, Check, Sparkles, Filter } from 'lucide-react';
import { Product, ProductCategory, CurrencyConfig } from '../types';
import { PRODUCTS } from '../data/fashionData';

interface FeaturedCollectionProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, colorHex?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  selectedCategory: ProductCategory | 'All';
  onCategoryChange: (category: ProductCategory | 'All') => void;
  currency: CurrencyConfig;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  products = PRODUCTS,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  selectedCategory,
  onCategoryChange,
  currency,
}) => {
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'African Wear',
    'Ready-to-Wear',
    'Corporate Wear',
    'Casual Fashion',
    'Native Attire',
    'Custom Designs',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchGender =
        selectedGender === 'all' ||
        product.gender === selectedGender ||
        product.gender === 'unisex';
      return matchCategory && matchGender;
    });
  }, [products, selectedCategory, selectedGender]);

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1800);
  };

  return (
    <section id="collections" className="py-24 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B89228]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#B89228] font-bold">
              AUTUMN / HARMATTAN 2026
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#B89228]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#062319]">
            THE DEE HAVILAH COLLECTION
          </h2>

          <div className="w-20 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />

          <p className="text-[#4A5D53] text-sm sm:text-base font-light max-w-xl mx-auto">
            Meticulously sculpted garments balancing heritage silhouettes, Italian silks, and hand-embroidered metallic accents.
          </p>
        </div>

        {/* Filter Bar: Gender Tabs & Categories */}
        <div className="flex flex-col items-center gap-6 mb-12">
          {/* Gender Filter Segment */}
          <div className="inline-flex p-1 bg-white border border-[#D4AF37]/30 rounded-full shadow-sm">
            {(['all', 'women', 'men'] as const).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => setSelectedGender(gender)}
                className={`px-6 py-1.5 rounded-full text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 ${
                  selectedGender === gender
                    ? 'bg-[#062319] text-[#D4AF37] shadow-md'
                    : 'text-[#062319]/70 hover:text-[#062319]'
                }`}
              >
                {gender === 'all' ? 'All Genders' : `${gender}'s Collection`}
              </button>
            ))}
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto pb-2 gap-2 scrollbar-none px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-medium transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-[#062319] text-[#F7E7BE] border-[#062319] shadow-sm'
                    : 'bg-white text-[#2C3E35] border-[#E8E2D5] hover:border-[#D4AF37] hover:text-[#062319]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);
              const isAdded = addedAnimationId === product.id;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-lg overflow-hidden border border-[#E8E2D5] hover:border-[#D4AF37]/60 hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                >
                  {/* Product Card Image Container */}
                  <div
                    className="relative aspect-[3/4] overflow-hidden bg-[#F3EFE6] cursor-pointer"
                    onClick={() => onSelectProduct(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Subtle Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges: Top Left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.newArrival && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-[#062319] text-[#D4AF37] px-2.5 py-1 rounded-sm shadow-md">
                          New Arrival
                        </span>
                      )}
                      {product.bestseller && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-[#D4AF37] text-[#041A13] px-2.5 py-1 rounded-sm shadow-md">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button: Top Right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
                        wishlisted
                          ? 'bg-[#062319] text-rose-500 shadow-md scale-110'
                          : 'bg-white/80 text-[#062319] hover:bg-white hover:text-rose-600'
                      }`}
                      aria-label="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`}
                      />
                    </button>

                    {/* Quick View Button Hover Slide-Up */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="flex-1 py-2.5 bg-white/95 hover:bg-white text-[#062319] text-xs uppercase tracking-wider font-semibold rounded-sm shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Product Details Info */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#6A7E74] uppercase tracking-wider mb-1">
                        <span>{product.category}</span>
                        <span className="capitalize">{product.gender}</span>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-serif text-lg font-bold text-[#062319] hover:text-[#B89228] cursor-pointer transition-colors line-clamp-1"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#55695F] font-light mt-1 line-clamp-2 leading-relaxed">
                        {product.tagline}
                      </p>

                      {/* Color Swatch Indicators */}
                      <div className="flex items-center gap-1.5 mt-3">
                        {product.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                        <span className="text-[10px] text-[#6A7E74] ml-1">
                          {product.sizes.length} sizes
                        </span>
                      </div>
                    </div>

                    {/* Price & Add to Cart Button */}
                    <div className="mt-5 pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-lg font-bold text-[#062319]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-[#8A9B92] line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={isAdded}
                        className={`px-3.5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                          isAdded
                            ? 'bg-emerald-800 text-white'
                            : 'bg-[#062319] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#041A13]'
                        }`}
                        title="Add to Cart"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State if filter yields zero */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-[#E8E2D5] max-w-md mx-auto">
            <Filter className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#062319]">No Garments in this Category</h3>
            <p className="text-xs text-[#55695F] mt-1 mb-4">
              Explore our full collection or request a bespoke commission.
            </p>
            <button
              type="button"
              onClick={() => {
                onCategoryChange('All');
                setSelectedGender('all');
              }}
              className="px-5 py-2 bg-[#062319] text-[#D4AF37] text-xs uppercase tracking-wider font-semibold rounded-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bespoke Tailoring Callout below products */}
        <div className="mt-16 text-center border-t border-[#E8E2D5] pt-12 max-w-2xl mx-auto">
          <p className="font-serif text-lg font-bold text-[#062319]">
            Require Made-to-Measure Tailoring or Special Fabric Sourcing?
          </p>
          <p className="text-xs text-[#55695F] mt-1.5 mb-5 font-light">
            Every Dee Havilah design can be individually proportioned to your silhouette, or created from scratch for weddings, galas, and diplomatic state events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#custom-design"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#062319] hover:bg-[#D4AF37] hover:text-[#041A13] text-[#D4AF37] text-xs uppercase tracking-widest font-bold rounded-sm shadow transition-all duration-300"
            >
              Start Custom Design
            </a>
            <a
              href="https://wa.me/2349069215630?text=Hello%20Dee%20Havilah%20Design,%20I%20would%20like%20to%20consult%20with%20a%20master%20tailor."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 border border-[#062319] hover:bg-[#062319] hover:text-white text-[#062319] text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
