import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

export const BrandIntro: React.FC = () => {
  const specialties = [
    'African Wear',
    'Ready-to-Wear',
    'International Wear',
    'Corporate Outfits',
    'Casual Fashion',
    'Native Attire',
    'Custom-Made Designs',
  ];

  return (
    <section id="brand-intro" className="py-24 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background Subtle Watermark */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[#062319]/[0.03] font-serif text-[180px] font-bold select-none pointer-events-none">
        HAVILAH
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage with Gold Trim */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Editorial Image */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-[#D4AF37]/25 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
                  alt="Dee Havilah Haute Couture Model"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041A13]/60 via-transparent to-transparent" />
                
                {/* Embedded Quote Ribbon */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#062319]/85 backdrop-blur-md border border-[#D4AF37]/40 rounded-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">The Havilah Standard</p>
                  <p className="font-serif italic text-cream-50 text-sm mt-1">
                    "Culture, creativity, craftsmanship, and modern fashion trends in seamless harmony."
                  </p>
                </div>
              </div>

              {/* Offset Accent Box Behind */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-[#D4AF37] rounded-lg -z-10 hidden sm:block opacity-70" />
              
              {/* Secondary Floating Thumbnail */}
              <div className="absolute -top-6 -left-6 w-36 h-44 rounded-md overflow-hidden shadow-xl border-2 border-[#D4AF37]/60 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=600&auto=format&fit=crop"
                  alt="Detailed Embroidery"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Specialties */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Monogram Badge */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1.5px] bg-[#D4AF37]" />
              <span className="text-xs font-sans uppercase tracking-[0.28em] text-[#B89228] font-bold">
                BRAND PHILOSOPHY
              </span>
            </div>

            {/* Section Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#062319] tracking-tight leading-[1.15]">
              CRAFTED FOR YOUR <br />
              <span className="text-[#0B3B2C] italic">IDENTITY</span>
            </h2>

            {/* Small Gold Accent Line */}
            <div className="w-16 h-1 bg-[#D4AF37] my-6 rounded-full" />

            {/* Core Brand Narrative */}
            <p className="text-base sm:text-lg text-[#2C3E35] font-light leading-relaxed mb-4">
              "At Dee Havilah Design, fashion goes beyond clothing. Every piece is thoughtfully created to express confidence, individuality, culture, and timeless elegance."
            </p>

            <p className="text-sm sm:text-base text-[#4A5D53] leading-relaxed mb-8">
              Our designs blend culture, creativity, craftsmanship, and modern fashion trends. We believe fashion is an unapologetic statement of identity, confidence, and excellence, and we are committed to helping every customer look their absolute best for every occasion.
            </p>

            {/* Specialties Chips Grid */}
            <div className="bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg p-6 bg-gradient-to-br from-white to-[#F3EFE6] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#062319]">
                  OUR BESPOKE SPECIALIZATIONS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {specialties.map((specialty) => (
                  <div
                    key={specialty}
                    className="flex items-center gap-2.5 text-xs font-medium text-[#0B3B2C] hover:text-[#D4AF37] transition-colors py-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <span>{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Atelier Seal with Official Brand Emblem */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#062319]/10">
              <Logo variant="dark" showTagline={false} />
              <div className="font-serif italic text-xs sm:text-sm text-[#D4AF37] font-semibold">
                "Elegance Woven Into Every Style"
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
