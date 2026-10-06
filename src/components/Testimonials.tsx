import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/fashionData';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const nextTestimonial = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-24 bg-[#062319] text-white relative overflow-hidden border-t border-[#D4AF37]/20">
      {/* Decorative Gold Rings */}
      <div className="absolute -top-32 right-10 w-80 h-80 rounded-full border border-[#D4AF37]/10 pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-80 h-80 rounded-full border border-[#D4AF37]/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#D4AF37] font-semibold">
              PATRON EXPERIENCES
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cream-50">
            WHAT OUR CLIENTS SAY
          </h2>

          <div className="w-16 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />

          <p className="text-cream-200/80 text-sm font-light">
            Read reflections from dignitaries, brides, CEOs, and creatives who entrust their most memorable occasions to Dee Havilah.
          </p>
        </div>

        {/* Testimonial Showcase Carousel */}
        <div className="relative bg-[#041A13] border border-[#D4AF37]/35 rounded-2xl p-8 sm:p-12 shadow-2xl">
          <Quote className="absolute top-6 left-6 sm:top-10 sm:left-10 w-12 h-12 text-[#D4AF37]/20 pointer-events-none" />

          <div className="min-h-[260px] sm:min-h-[220px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                  <span className="text-xs text-[#D4AF37] ml-2 font-mono font-bold">5.0 / 5.0</span>
                </div>

                {/* Quote Text */}
                <p className="font-serif text-lg sm:text-2xl text-cream-100 font-light italic leading-relaxed">
                  "{current.quote}"
                </p>

                {/* Client Profile Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif text-base font-bold text-cream-50">{current.name}</h3>
                        {current.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" title="Verified Client" />
                        )}
                      </div>
                      <p className="text-xs text-[#D4AF37] font-medium">{current.role}</p>
                      <p className="text-[11px] text-cream-200/60">{current.location}</p>
                    </div>
                  </div>

                  {/* Outfits purchased tag */}
                  <div className="bg-[#062319] border border-[#D4AF37]/30 px-3.5 py-2 rounded-md sm:text-right">
                    <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                      Commissioned Piece
                    </p>
                    <p className="text-xs text-cream-100 font-serif">{current.outfitPurchased}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows & Dot Indicators */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevTestimonial}
                className="p-2.5 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] border border-[#D4AF37]/40 text-[#D4AF37] transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextTestimonial}
                className="p-2.5 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] border border-[#D4AF37]/40 text-[#D4AF37] transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
