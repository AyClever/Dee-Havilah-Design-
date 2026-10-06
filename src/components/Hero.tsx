import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Sparkles, Scissors, MessageCircle } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onCustomDesignClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onCustomDesignClick,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#041A13]"
    >
      {/* Background Editorial Fashion Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/collections/custom-designs.jpg"
          alt="DEE HAVILAH Haute Couture Editorial"
          className="w-full h-full object-cover object-center scale-100 filter brightness-[0.78] contrast-[1.05]"
        />

        {/* Sophisticated Emerald-to-Onyx Vignette for pristine text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041A13] via-[#041A13]/60 to-[#041A13]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041A13]/85 via-[#041A13]/40 to-[#041A13]/85" />
      </div>

      {/* Subtle Architectural Gold Corner Accents */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
        <div className="absolute top-28 left-8 sm:left-12 w-20 h-20 border-l border-t border-[#D4AF37]/60" />
        <div className="absolute bottom-24 right-8 sm:right-12 w-20 h-20 border-r border-b border-[#D4AF37]/60" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 sm:pt-32 pb-20 flex flex-col items-center">
        {/* Brand Monogram Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/60 bg-[#062319]/90 backdrop-blur-md mb-6 shadow-2xl"
        >
          <img
            src="/logo-dark.jpg"
            alt="DEE HAVILAH Official Emblem"
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-[#D4AF37]"
          />
          <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.28em] uppercase font-bold text-[#F7E7BE]">
            DEE HAVILAH DESIGN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span className="text-[10px] sm:text-[11px] text-[#D4AF37] font-medium tracking-widest uppercase">
            LAGOS • LONDON
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-cream-50 leading-[1.1] max-w-4xl"
        >
          WHERE CULTURE MEETS{' '}
          <span className="text-[#D4AF37] italic font-normal block sm:inline">
            MODERN FASHION
          </span>
        </motion.h1>

        {/* Supporting Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-cream-100/90 font-light max-w-2xl leading-relaxed tracking-wide"
        >
          Haute couture and bespoke African tailoring sculpted to make you look confident, classy, and unforgettable.
        </motion.p>

        {/* Gold Accent Rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-20 h-[1.5px] bg-[#D4AF37] my-8"
        />

        {/* Clear Primary & Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            id="hero-explore-collection-btn"
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-sans text-xs uppercase tracking-[0.24em] font-bold rounded-sm shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300"
          >
            EXPLORE COLLECTION
          </button>

          <button
            id="hero-custom-design-btn"
            type="button"
            onClick={onCustomDesignClick}
            className="w-full sm:w-auto px-8 py-4 border border-[#D4AF37] hover:bg-[#D4AF37]/15 text-[#F7E7BE] font-sans text-xs uppercase tracking-[0.24em] font-semibold rounded-sm backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Scissors className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-45 transition-transform duration-300" />
            CUSTOM DESIGN
          </button>
        </motion.div>

        {/* Direct WhatsApp Concierge Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-6"
        >
          <a
            href="https://wa.me/2349069215630?text=Hello%20Dee%20Havilah%20Design%20Atelier,%20I%20would%20like%20to%20speak%20with%20a%20private%20stylist."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-cream-200/80 hover:text-[#D4AF37] transition-colors py-1"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="underline underline-offset-4 decoration-[#D4AF37]/40">Need styling advice? Chat on WhatsApp</span>
          </a>
        </motion.div>

        {/* Atelier Quality Accreditations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-center w-full max-w-3xl"
        >
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#F7E7BE]">Authentic</p>
            <p className="text-[11px] text-cream-200/70 tracking-wider uppercase mt-0.5">Heritage Textiles</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#F7E7BE]">Bespoke</p>
            <p className="text-[11px] text-cream-200/70 tracking-wider uppercase mt-0.5">Millimeter Precision</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#F7E7BE]">Worldwide</p>
            <p className="text-[11px] text-cream-200/70 tracking-wider uppercase mt-0.5">Express Shipping</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#F7E7BE]">5.0 ★</p>
            <p className="text-[11px] text-cream-200/70 tracking-wider uppercase mt-0.5">Private Client Rating</p>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        type="button"
        onClick={onExploreClick}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-cream-200/60 hover:text-[#D4AF37] transition-colors cursor-pointer"
        aria-label="Scroll down to collections"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] font-sans">Discover</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#D4AF37]" />
      </button>
    </section>
  );
};
