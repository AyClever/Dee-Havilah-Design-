import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Compass, Feather, Clock, Check } from 'lucide-react';
import {
  DEFAULT_CREATIVE_DIRECTOR_IMAGE_URL,
  getStoredBrandDirectorImageUrl,
  fetchCreativeDirectorImage,
} from '../services/supabase';

interface AboutSectionProps {
  onOpenCustomCommission?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenCustomCommission }) => {
  const [directorImageSrc, setDirectorImageSrc] = useState<string>(() => {
    return DEFAULT_CREATIVE_DIRECTOR_IMAGE_URL;
  });

  useEffect(() => {
    let isMounted = true;
    fetchCreativeDirectorImage().then((url) => {
      if (isMounted && url && url !== directorImageSrc) {
        setDirectorImageSrc(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const pillars = [
    { title: 'Culture', desc: 'Preserving African textile royalty and heritage needlework.' },
    { title: 'Creativity', desc: 'Audacious, contemporary design language that turns heads globally.' },
    { title: 'Modern Fashion', desc: 'Ergonomic cuts, sleek tailoring, and effortless everyday versatility.' },
    { title: 'Craftsmanship', desc: 'Uncompromising hand-finishing, French seams, and enduring longevity.' },
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Faith Tailoring Shop',
      desc: 'Foundation and basic of tailoring.',
    },
    {
      year: '2019 – 2024',
      title: 'Self-Directed & Masterclass Training',
      desc: 'YouTube channel training & basic tailoring skill mastery.',
    },
    {
      year: '2025',
      title: 'Bov Fashion Institute',
      desc: 'Beginners to advanced corsetry bespoke fashion training.',
    },
    {
      year: '2025',
      title: "Children's Wear Training",
      desc: "Children's wear training at Bov Fashion Institute.",
    },
    {
      year: '2026',
      title: 'NABTEB / TVET National Skills Qualification (NSQ)',
      desc: 'National Board for Technical Education and Business (NABTEB) / Technical and Vocational Training (TVET) National Skills Qualification (NSQ) fashion and garment making @ Wessy College of Art and Technology.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B89228]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#B89228] font-bold">
              THE HERITAGE & ATELIER
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#B89228]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#062319]">
            THE STORY BEHIND DEE HAVILAH
          </h2>

          <div className="w-20 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />

          <p className="text-[#4A5D53] text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            At Dee Havilah, our name originates from the ancient biblical land celebrated for its pure, untarnished gold. That spirit of rare, precious perfection permeates every garment we construct.
          </p>
        </div>

        {/* 4 Foundation Pillars: Culture + Creativity + Modern Fashion + Craftsmanship */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {pillars.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-6 rounded-lg border border-[#E8E2D5] hover:border-[#D4AF37] shadow-sm text-center group transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#062319] text-[#D4AF37] mx-auto mb-3 flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#062319] group-hover:text-[#B89228] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#55695F] font-light mt-2 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Editorial Story Layout: Photo + Timeline + Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission & Vision Cards + Timeline */}
          <div className="lg:col-span-6 space-y-8">
            {/* Mission & Vision Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mission Card */}
              <div className="bg-[#062319] text-white p-6 rounded-xl border border-[#D4AF37]/30 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-[#041A13] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-cream-50">Our Mission</h3>
                <div className="w-10 h-[1.5px] bg-[#D4AF37] my-2.5" />
                <p className="text-xs text-cream-200/85 leading-relaxed font-light">
                  "To create exceptional fashion that allows every customer to express confidence, identity and excellence."
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-[#062319] text-white p-6 rounded-xl border border-[#D4AF37]/30 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-[#041A13] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-cream-50">Our Vision</h3>
                <div className="w-10 h-[1.5px] bg-[#D4AF37] my-2.5" />
                <p className="text-xs text-cream-200/85 leading-relaxed font-light">
                  "To become a recognized fashion brand known for timeless design, quality craftsmanship and modern African elegance."
                </p>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D5] shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-[#B89228]" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#062319]">
                  THE JOURNEY TO EXCELLENCE
                </h3>
              </div>

              <div className="space-y-6 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#D4AF37]/40">
                {milestones.map((m, idx) => (
                  <div key={`${m.year}-${idx}`} className="relative pl-8">
                    <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-white ring-2 ring-[#062319]" />
                    <span className="text-xs font-mono font-bold text-[#B89228] tracking-widest">{m.year}</span>
                    <h4 className="font-serif text-sm font-bold text-[#062319] mt-0.5">{m.title}</h4>
                    <p className="text-xs text-[#55695F] font-light mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Portrait & Designer's Pledge */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30 aspect-[2/3] sm:aspect-[3/4] lg:aspect-[2/3] bg-[#041A13]">
                <img
                  src={directorImageSrc}
                  alt="Oluwambe Grace O. - Lead Creative Director"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  onError={() => {
                    if (directorImageSrc !== '/founder.jpg') {
                      setDirectorImageSrc('/founder.jpg');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041A13] via-[#041A13]/20 to-transparent pointer-events-none" />

                {/* Designer Quote Overlay */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-5 sm:p-6 bg-[#041A13]/90 backdrop-blur-md rounded-xl border border-[#D4AF37]/40 shadow-2xl text-cream-50">
                  <Feather className="w-5 h-5 text-[#D4AF37] mb-2" />
                  <p className="font-serif italic text-xs sm:text-sm md:text-base text-cream-100 leading-relaxed">
                    "When an African man or woman walks into a room dressed in Dee Havilah, they shouldn't just look well-dressed; their presence should announce nobility, identity, and triumph."
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-[#D4AF37] text-sm">Lead Creative Director</p>
                      <p className="text-[10px] text-cream-200/80 tracking-widest uppercase font-semibold">OLUWAMBE GRACE O.</p>
                    </div>
                    <span className="font-serif italic text-base sm:text-lg text-cream-200 opacity-90 select-none">
                      Dee Havilah
                    </span>
                  </div>
                </div>
              </div>

              {/* Gold Box Border Effect */}
              <div className="absolute -bottom-5 -left-5 w-40 h-40 border-2 border-[#D4AF37] rounded-xl -z-10 hidden sm:block opacity-60" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
