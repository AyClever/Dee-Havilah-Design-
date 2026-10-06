import React, { useState } from 'react';
import { Logo } from './Logo';
import { Instagram, Facebook, MessageCircle, ArrowRight, Check, Heart } from 'lucide-react';

interface FooterProps {
  onNavClick: (href: string) => void;
  onSuccessToast: (msg: string) => void;
  onOpenAdmin?: () => void;
}

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.69 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.33-6.31V9.22a8.16 8.16 0 0 0 4.67 1.47V7.24a4.85 4.85 0 0 1-.75-.55Z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onNavClick, onSuccessToast, onOpenAdmin }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    onSuccessToast('Welcome to the Connoisseurs Circle! Check your inbox for your 10% code.');
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Collections', href: '#categories' },
    { label: 'Shop Garments', href: '#collections' },
    { label: 'Custom Design', href: '#custom-design' },
    { label: 'About The Atelier', href: '#about' },
    { label: 'Contact & Concierge', href: '#contact' },
  ];

  const categories = [
    'African Wear',
    'Ready-to-Wear',
    'Corporate Wear',
    'Casual Fashion',
    'Native Attire',
    'Custom Designs',
  ];

  return (
    <footer className="bg-[#02150F] text-cream-100 border-t border-[#D4AF37]/30 relative overflow-hidden">
      {/* Subtle gold line at top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="footer" showTagline={true} />
            <p className="text-xs text-cream-200/75 leading-relaxed font-light pt-2 max-w-sm">
              DEE Havilah Design is a premium fashion house dedicated to creating stylish, elegant, and high-quality outfits for both men and women. Blending African culture, creativity, craftsmanship, and modern fashion trends.
            </p>

            <div className="pt-2 flex items-center gap-3 text-cream-200">
              <a
                id="footer-social-instagram"
                href="https://www.instagram.com/deehavilah_designs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] border border-[#D4AF37]/30 flex items-center justify-center transition-colors"
                aria-label="Instagram"
                title="Instagram: @deehavilah_designs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                id="footer-social-facebook"
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] border border-[#D4AF37]/30 flex items-center justify-center transition-colors"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                id="footer-social-tiktok"
                href="https://www.tiktok.com/@deehavilah_design"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] border border-[#D4AF37]/30 flex items-center justify-center transition-colors"
                aria-label="TikTok"
                title="TikTok: @deehavilah_design"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                id="footer-social-whatsapp"
                href="https://wa.me/2349069215630"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#25D366] hover:text-white border border-[#D4AF37]/30 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
                title="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.24em] font-bold text-[#D4AF37]">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavClick(item.href);
                    }}
                    className="text-cream-200/80 hover:text-[#D4AF37] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.24em] font-bold text-[#D4AF37]">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs text-cream-200/80">
              {categories.map((cat) => (
                <li key={cat}>
                  <a
                    href="#collections"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavClick('#collections');
                    }}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter Signup */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.24em] font-bold text-[#D4AF37]">
              THE CONNOISSEURS CIRCLE
            </h4>
            <p className="text-xs text-cream-200/75 leading-relaxed font-light">
              Subscribe to receive private runway lookbooks, seasonal preview invites, and 10% privilege on your first bespoke order.
            </p>

            {subscribed ? (
              <div className="p-3.5 bg-[#062319] border border-[#D4AF37]/50 rounded-md text-xs text-[#D4AF37] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>You are on the private client roster. Welcome!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your VIP email"
                    className="flex-1 px-3.5 py-2.5 bg-[#062319] border border-[#D4AF37]/40 rounded-l-md text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-r-md transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-cream-200/50 italic">
                  We respect your discretion. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-200/60 gap-4">
          <p className="font-serif">
            &copy; 2026 Dee Havilah Design. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] uppercase tracking-wider">
            <a href="#home" className="hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#home" className="hover:text-[#D4AF37] transition-colors">
              Terms & Conditions
            </a>
            <span>•</span>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">
              Client Care
            </a>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-cream-200/50 hover:text-[#D4AF37] transition-colors tracking-widest text-[10px] font-mono cursor-pointer"
                  title="Dee Havilah Atelier Staff Portal"
                >
                  Staff Access
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
