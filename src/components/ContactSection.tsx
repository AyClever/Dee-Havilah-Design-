import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Instagram, Facebook, Clock } from 'lucide-react';
import { ContactMessage } from '../types';
import { createContactMessage } from '../services/supabase';

interface ContactSectionProps {
  onSuccessToast: (msg: string) => void;
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

export const ContactSection: React.FC<ContactSectionProps> = ({ onSuccessToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please complete the required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newMsg: ContactMessage = {
        id: `MSG-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        isRead: false,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      await createContactMessage(newMsg);
    } catch (e) {
      console.warn('Could not record contact message to Supabase:', e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSuccessToast('Your message has reached our private client concierge!');
    }, 800);
  };

  const whatsappDirectUrl = 'https://wa.me/2349069215630';

  return (
    <section id="contact" className="py-24 bg-[#041A13] text-white relative border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.28em] text-[#D4AF37] font-semibold">
            ATELIER & PRIVATE SALON
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cream-50 mt-2">
            LET'S CREATE SOMETHING BEAUTIFUL
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto my-4 rounded-full" />
          <p className="text-cream-200/80 text-sm font-light">
            Whether inquiring about our ready-to-wear collections, private measurement appointments, or bespoke red carpet designs, our concierge is at your service.
          </p>
        </div>

        {/* Contact Grid: Info / WhatsApp + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & WhatsApp Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Prominent WhatsApp Card */}
            <div className="bg-gradient-to-br from-[#062319] to-[#0A3D2D] border border-[#D4AF37]/40 p-6 sm:p-8 rounded-xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-cream-50 uppercase tracking-wide">
                    INSTANT VIP WHATSAPP
                  </h3>
                  <p className="text-xs text-[#25D366] font-medium tracking-wide">
                    Typical response: Under 15 minutes
                  </p>
                </div>
              </div>

              <p className="text-xs text-cream-200/80 leading-relaxed font-light">
                Connect directly with our head stylist or client manager to discuss fabric swatches, sizing advice, and expedited bridal/ceremonial orders.
              </p>

              <a
                id="prominent-whatsapp-btn"
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-md shadow-lg flex items-center justify-center gap-2 transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                CHAT ON WHATSAPP
              </a>
            </div>

            {/* Direct Contact Details Box */}
            <div className="bg-[#062319] border border-[#D4AF37]/25 p-6 sm:p-8 rounded-xl space-y-5 text-xs text-cream-200/90">
              <div className="flex items-start gap-3.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cream-50 block uppercase tracking-wider text-[11px] font-bold">
                    PHONE INQUIRIES
                  </strong>
                  <div className="mt-1 space-y-0.5">
                    <a
                      id="contact-phone-1"
                      href="tel:+234906215630"
                      className="block text-cream-200/90 hover:text-[#D4AF37] transition-colors"
                    >
                      +234 906215630
                    </a>
                    <a
                      id="contact-phone-2"
                      href="tel:+2349020118350"
                      className="block text-cream-200/90 hover:text-[#D4AF37] transition-colors"
                    >
                      +234 9020118350
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cream-50 block uppercase tracking-wider text-[11px] font-bold">
                    PRIVATE BRAND EMAIL
                  </strong>
                  <a
                    id="contact-email-link"
                    href="mailto:deehavilahdesign@gmail.com"
                    className="block text-cream-200/90 hover:text-[#D4AF37] transition-colors mt-1"
                  >
                    deehavilahdesign@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cream-50 block uppercase tracking-wider text-[11px] font-bold">
                    SHOWROOM ADDRESS
                  </strong>
                  <p className="text-cream-200/90 mt-1 leading-relaxed">
                    B6/43, Federal Housing Estate Elega, Abeokuta, Ogun State Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cream-50 block uppercase tracking-wider text-[11px] font-bold">
                    SHOWROOM HOURS
                  </strong>
                  <p className="text-cream-200/90 mt-1">Monday – Saturday: 9:00 AM – 5:00 PM</p>
                  <p className="text-cream-200/70 mt-0.5">Sunday: Closed</p>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-bold">
                  SOCIAL:
                </span>
                
                {/* Instagram */}
                <a
                  id="contact-social-instagram"
                  href="https://www.instagram.com/deehavilah_designs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] text-cream-200 transition-colors"
                  aria-label="Instagram"
                  title="Instagram: @deehavilah_designs"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  id="contact-social-facebook"
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] text-cream-200 transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* TikTok */}
                <a
                  id="contact-social-tiktok"
                  href="https://www.tiktok.com/@deehavilah_design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#041A13] text-cream-200 transition-colors"
                  aria-label="TikTok"
                  title="TikTok: @deehavilah_design"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>

                {/* WhatsApp */}
                <a
                  id="contact-social-whatsapp"
                  href="https://wa.me/2349069215630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-[#25D366] hover:text-white text-cream-200 transition-colors"
                  aria-label="WhatsApp"
                  title="WhatsApp Concierge"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#062319] border border-[#D4AF37]/35 p-6 sm:p-10 rounded-xl shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-cream-50">
                  Message Sent to Concierge
                </h3>
                <p className="text-cream-200/80 text-sm max-w-sm mx-auto font-light">
                  Thank you, <span className="text-[#D4AF37] font-semibold">{formData.name}</span>. A representative from Dee Havilah will reply to your inquiry promptly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-[#D4AF37]/10 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.24em] font-bold text-[#D4AF37] mb-1">
                    SEND AN INQUIRY
                  </h3>
                  <p className="text-xs text-cream-200/70 font-light">
                    Our concierge assists with collections, bridal registries, and international sizing.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Princess Folasade"
                    className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="folasade@example.com"
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the occasion, desired outfit, or fitting dates..."
                    className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B89228] text-[#041A13] font-sans text-xs uppercase tracking-[0.24em] font-bold rounded-md shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SEND MESSAGE
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
