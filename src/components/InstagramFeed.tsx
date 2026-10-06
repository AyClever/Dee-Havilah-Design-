import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Instagram, Sparkles } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../data/fashionData';

export const InstagramFeed: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <Instagram className="w-4 h-4 text-[#B89228]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#B89228] font-bold">
              @DEEHAVILAH
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#062319]">
            FOLLOW THE DEE HAVILAH JOURNEY
          </h2>

          <div className="w-16 h-1 bg-[#D4AF37] mx-auto my-3 rounded-full" />

          <p className="text-[#4A5D53] text-sm font-light">
            Discover new designs, behind-the-scenes moments and the latest collections.
          </p>
        </div>

        {/* 6 Grid of Instagram Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative aspect-square rounded-lg overflow-hidden bg-[#041A13] border border-[#D4AF37]/20 shadow-sm cursor-pointer"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />

              {/* Hover Overlay with Likes & Comments */}
              <div className="absolute inset-0 bg-[#062319]/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                <Instagram className="w-5 h-5 text-[#D4AF37] mb-2" />
                
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-[#F7E7BE]">
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-[#F7E7BE]">
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    {post.comments}
                  </span>
                </div>

                <p className="text-[10px] text-cream-200/80 line-clamp-2 mt-2 font-light">
                  {post.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow CTA Button */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#062319] hover:bg-[#0b3b2c] text-[#D4AF37] border border-[#D4AF37]/50 rounded-full text-xs uppercase tracking-[0.2em] font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Instagram className="w-4 h-4 text-[#D4AF37]" />
            FOLLOW @DEE HAVILAH
          </a>
        </div>

      </div>
    </section>
  );
};
