import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, Check, Sparkles, ShieldCheck, Ruler, MessageCircle, Truck } from 'lucide-react';
import { Product, ColorOption, CurrencyConfig } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  currency: CurrencyConfig;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currency,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Standard', hex: '#062319' });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Dee Havilah Design Atelier,\n\nI am interested in acquiring *${product.name}* (${selectedColor.name}, Size: ${selectedSize}) for ${formatPrice(product.price)}.\n\nCould you kindly assist me with fitting and availability?`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D4AF37]/30 z-10 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-[#062319]/70 hover:text-[#062319] bg-white/80 backdrop-blur-md rounded-full border border-black/10 hover:border-[#D4AF37] transition-all"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Left Column: Image Gallery */}
              <div className="md:col-span-6 bg-[#F3EFE6] p-6 flex flex-col justify-between">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-md">
                  <img
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                  {product.bestseller && (
                    <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#041A13] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-sm shadow">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Thumbnails if multiple */}
                {product.images.length > 1 && (
                  <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Guarantee snippet */}
                <div className="mt-4 pt-4 border-t border-[#062319]/10 flex items-center justify-between text-[11px] text-[#55695F]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#B89228]" />
                    100% Authentic Haute Couture
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#B89228]" />
                    Insured Worldwide Shipping
                  </span>
                </div>
              </div>

              {/* Right Column: Garment Specs & Ordering */}
              <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.24em] font-semibold text-[#B89228]">
                      {product.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product)}
                      className="text-xs flex items-center gap-1 text-[#062319] hover:text-rose-600 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#062319] mt-2">
                    {product.name}
                  </h2>

                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="font-serif text-2xl font-bold text-[#062319]">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#8A9B92] line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#4A5D53] font-light mt-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Color Selector */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#062319] mb-2">
                      <span>COLOR: <span className="font-normal text-[#55695F]">{selectedColor.name}</span></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((color, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                            selectedColor.name === color.name
                              ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          title={color.name}
                        >
                          <span
                            className="w-full h-full rounded-full block border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector & Guide */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#062319] mb-2">
                      <span>SIZE</span>
                      <button
                        type="button"
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="text-[11px] text-[#B89228] underline hover:text-[#062319] flex items-center gap-1 font-medium"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        {showSizeGuide ? 'Hide Size Guide' : 'Size Guide'}
                      </button>
                    </div>

                    {showSizeGuide && (
                      <div className="mb-3 p-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-md text-[11px] text-[#2C3E35]">
                        <p className="font-bold mb-1">Standard Atelier Measurements:</p>
                        <div className="grid grid-cols-4 gap-1 text-center border-t border-black/10 pt-1 font-mono text-[10px]">
                          <span>Size</span><span>Chest/Bust</span><span>Waist</span><span>Hips</span>
                          <span className="font-bold">S</span><span>36-38"</span><span>30-32"</span><span>38-40"</span>
                          <span className="font-bold">M</span><span>39-41"</span><span>33-35"</span><span>41-43"</span>
                          <span className="font-bold">L</span><span>42-44"</span><span>36-38"</span><span>44-46"</span>
                          <span className="font-bold">XL</span><span>45-47"</span><span>39-41"</span><span>47-49"</span>
                        </div>
                        <p className="mt-2 text-[10px] italic text-[#6A7E74]">
                          *Need custom tailored fit? Select "Bespoke Fit" or book via Custom Design.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-all ${
                            selectedSize === sz
                              ? 'bg-[#062319] text-[#D4AF37] border-[#062319] shadow-sm font-semibold'
                              : 'bg-white text-[#2C3E35] border-[#E8E2D5] hover:border-[#D4AF37]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fabric & Craftsmanship Accordion */}
                  <div className="mt-6 pt-4 border-t border-[#E8E2D5] space-y-2">
                    <div className="text-xs">
                      <span className="font-bold text-[#062319]">Fabric: </span>
                      <span className="text-[#55695F]">{product.fabric}</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-[#062319]">Care: </span>
                      <span className="text-[#55695F]">{product.careInstructions}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Add to Bag & Concierge WhatsApp */}
                <div className="mt-8 pt-4 border-t border-[#E8E2D5] space-y-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={isAdded}
                      className={`flex-1 py-3.5 px-6 rounded-md font-sans text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                        isAdded
                          ? 'bg-emerald-800 text-white'
                          : 'bg-[#062319] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#041A13]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          Added To Bag
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          Add To Shopping Bag
                        </>
                      )}
                    </button>
                  </div>

                  {/* Order / Inquire via WhatsApp */}
                  <a
                    href={`https://wa.me/2349069215630?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-md border border-[#25D366]/60 text-[#062319] hover:bg-[#25D366]/10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    Order via WhatsApp Concierge
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
