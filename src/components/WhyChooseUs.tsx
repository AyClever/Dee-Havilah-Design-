import React from 'react';
import { motion } from 'motion/react';
import { Award, Compass, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Award,
      title: 'Premium Quality',
      subtitle: 'Flawless Craftsmanship',
      description:
        'Hand-selected Swiss damasks, pure Mulberry silks, and Super 150s wools, constructed with French seams and master finishing.',
    },
    {
      icon: Compass,
      title: 'Unique Designs',
      subtitle: 'Stand Apart with Distinction',
      description:
        'Original silhouettes designed in-house to ensure you never walk into an event wearing an outfit someone else is wearing.',
    },
    {
      icon: Sparkles,
      title: 'Cultural Excellence',
      subtitle: 'Heritage Reimagined',
      description:
        'Ancestral African embroidery, royal motifs, and rich indigenous textiles elevated to the pinnacle of modern international haute couture.',
    },
    {
      icon: UserCheck,
      title: 'Made For You',
      subtitle: 'Millimetric Personal Fit',
      description:
        'Every line, taper, and lapel is sculpted to flatter your unique posture, physique, and personality for effortless confidence.',
    },
  ];

  return (
    <section className="py-24 bg-[#062319] text-white relative border-y border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.28em] text-[#D4AF37] font-semibold">
            THE HAVILAH DISTINCTION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cream-50 mt-2">
            WHY DEE HAVILAH?
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />
          <p className="text-cream-200/75 text-sm font-light">
            We don't merely manufacture apparel; we weave legacy, majesty, and personal sovereignty into every stitch.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-xl bg-[#041A13]/90 border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-300 group hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Minimal Gold Icon */}
                  <div className="w-12 h-12 rounded-lg bg-[#062319] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37] group-hover:text-[#041A13] transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-cream-50 group-hover:text-[#D4AF37] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-[11px] uppercase tracking-wider text-[#D4AF37]/80 font-medium mt-1 mb-3">
                    {pillar.subtitle}
                  </p>

                  <p className="text-xs text-cream-200/80 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#D4AF37]/80">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                  <span>Guaranteed Excellence</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
