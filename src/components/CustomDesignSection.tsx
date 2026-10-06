import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Upload, CheckCircle2, Sparkles, MessageCircle, Calendar, Send, Image as ImageIcon } from 'lucide-react';
import { CustomDesignFormState, CustomDesignRequest } from '../types';
import { createCustomRequest } from '../services/supabase';

interface CustomDesignSectionProps {
  onSuccessToast: (msg: string) => void;
}

export const CustomDesignSection: React.FC<CustomDesignSectionProps> = ({
  onSuccessToast,
}) => {
  const [formData, setFormData] = useState<CustomDesignFormState>({
    fullName: '',
    phoneNumber: '',
    email: '',
    gender: 'Women',
    designType: 'African Wear',
    preferredFabric: 'Aso-Oke & Silk Organza',
    occasion: 'Wedding Celebration',
    measurementsNotes: '',
    inspirationImageUrl: '',
    targetDate: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const designTypes = [
    'African Wear',
    'Native Attire / Senator',
    'Ready-to-Wear Bespoke',
    'Corporate Bespoke Suit',
    'Haute Couture Gown',
    'Bridal / Groom Ensemble',
    'Red Carpet Gala',
    'Other Bespoke Style',
  ];

  const fabrics = [
    'Aso-Oke & Silk Organza',
    'Hand-Dyed Indigo Adire',
    'Super 150s Italian Merino Wool',
    'Pure Mulberry Silk Charmeuse',
    'Swiss Cotton Damask / Brocade',
    'Royal Velvet & Gold Filigree',
    'European Flax Linen',
    'Client Provided Fabric',
  ];

  const occasions = [
    'Wedding / Traditional Rites',
    'Gala / Red Carpet Event',
    'Corporate Summit / State Banquet',
    'Milestone Birthday / Anniversary',
    'Diplomatic / Executive Function',
    'Personal Wardrobe Bespoke',
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, inspirationImageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.email) {
      alert('Please fill in your name, phone number, and email.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newRequest: CustomDesignRequest = {
        ...formData,
        id: `CR-${Date.now()}`,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      await createCustomRequest(newRequest);
    } catch (err) {
      console.warn('Could not record custom request to Supabase:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      onSuccessToast('Your Custom Design Request has been received by our Head Atelier!');
    }, 800);
  };

  const buildWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello Dee Havilah Design Atelier,\n\nI just submitted a Custom Bespoke Request for *${formData.designType}*.\nName: ${formData.fullName}\nPhone: ${formData.phoneNumber}\nFabric: ${formData.preferredFabric}\nOccasion: ${formData.occasion}\n\nI would love to connect with the lead designer.`
    );
    return `https://wa.me/2349069215630?text=${text}`;
  };

  return (
    <section id="custom-design" className="py-24 bg-[#041A13] text-cream-50 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#0E4937]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Scissors className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#D4AF37] font-semibold">
              HAUTE COUTURE COMMISSION
            </span>
            <Scissors className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-cream-50">
            YOUR VISION. OUR CRAFT.
          </h2>

          <div className="w-24 h-1 bg-[#D4AF37] mx-auto my-5 rounded-full" />

          <p className="text-cream-200/80 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            "Have something unique in mind? Let Dee Havilah bring your vision to life with a custom-made design created specifically for you."
          </p>
        </div>

        {/* Form + Atelier Imagery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Atelier Visual & Process Steps */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl aspect-[4/5] group">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop"
                alt="Master Tailor at Dee Havilah Atelier measuring fabric"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041A13] via-[#041A13]/40 to-transparent" />

              {/* Floating Atelier Quote */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#062319]/90 backdrop-blur-md rounded-lg border border-[#D4AF37]/40 shadow-xl">
                <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bespoke Consultation
                </div>
                <p className="font-serif italic text-cream-100 text-sm">
                  "Every pattern is drafted from scratch, cut by hand, and fitted with millimetric precision."
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#F7E7BE]/80 pt-2 border-t border-white/10">
                  <span>Lead Couturier Consultation</span>
                  <span className="text-[#D4AF37] font-semibold">Lagos & Virtual</span>
                </div>
              </div>
            </div>

            {/* 3 Step Process Card */}
            <div className="bg-[#062319] border border-[#D4AF37]/25 rounded-xl p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                HOW BESPOKE COMMISSIONS WORK
              </h3>

              <div className="space-y-3 text-xs text-cream-200/85">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#041A13] font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    1
                  </span>
                  <div>
                    <strong className="text-cream-50 block">Design Consultation & Sketching</strong>
                    We review your reference photos, silhouette preferences, and occasion requirements.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#041A13] font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    2
                  </span>
                  <div>
                    <strong className="text-cream-50 block">Fabric Selection & Precision Measurement</strong>
                    Select from royal Aso-Oke, Swiss brocade, or Italian wool, tailored to your exact measurements.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#041A13] font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    3
                  </span>
                  <div>
                    <strong className="text-cream-50 block">Fittings & Global White-Glove Delivery</strong>
                    In-person or virtual fittings ensure a majestic fit before shipping in luxury presentation boxes.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: The Custom-Design Form */}
          <div className="lg:col-span-7 bg-[#062319] border border-[#D4AF37]/35 rounded-xl p-6 sm:p-10 shadow-2xl relative">
            
            {submittedSuccess ? (
              <div className="text-center py-12 space-y-6 animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="font-serif text-3xl font-bold text-cream-50">
                  Request Received in the Atelier
                </h3>

                <p className="text-cream-200/80 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-[#D4AF37] font-semibold">{formData.fullName}</span>. Our lead bespoke designer will review your specifications for the <strong>{formData.designType}</strong> and reach out to you within 24 hours.
                </p>

                <div className="p-4 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg max-w-md mx-auto text-left text-xs space-y-1 text-cream-200/70">
                  <p><strong className="text-cream-100">Preferred Fabric:</strong> {formData.preferredFabric}</p>
                  <p><strong className="text-cream-100">Occasion:</strong> {formData.occasion}</p>
                  <p><strong className="text-cream-100">Phone:</strong> {formData.phoneNumber}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-wider font-bold rounded-md flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Connect Directly on WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setImagePreview(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs uppercase tracking-wider font-semibold rounded-md transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.24em] font-bold text-[#D4AF37] mb-1">
                    REQUEST A CUSTOM DESIGN
                  </h3>
                  <p className="text-xs text-cream-200/70 font-light">
                    Provide your details below to schedule your bespoke design consultation.
                  </p>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Adebayo Adeleke"
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+234 812 345 6789"
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Email & Gender */}
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
                      placeholder="adebayo@example.com"
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Women">Women's Haute Couture</option>
                      <option value="Men">Men's Bespoke Tailoring</option>
                      <option value="Unisex">Unisex / Couple's Suite</option>
                    </select>
                  </div>
                </div>

                {/* Design Type & Preferred Fabric */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Design Type
                    </label>
                    <select
                      value={formData.designType}
                      onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    >
                      {designTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Preferred Fabric
                    </label>
                    <select
                      value={formData.preferredFabric}
                      onChange={(e) => setFormData({ ...formData, preferredFabric: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    >
                      {fabrics.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Occasion & Target Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Occasion
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    >
                      {occasions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                      Target Completion Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Measurements / Notes */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                    Measurements / Design Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.measurementsNotes}
                    onChange={(e) => setFormData({ ...formData, measurementsNotes: e.target.value })}
                    placeholder="Enter key measurements (Chest/Bust, Waist, Hips, Height, Sleeve length) or describe your vision..."
                    className="w-full px-4 py-2.5 bg-[#041A13] border border-[#D4AF37]/30 rounded-md text-sm text-cream-100 focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                {/* Upload Inspiration Image */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-cream-200 mb-1.5">
                    Upload Inspiration Image (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#D4AF37]/30 border-dashed rounded-lg hover:border-[#D4AF37] transition-colors bg-[#041A13]/50 relative">
                    <div className="space-y-2 text-center">
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={imagePreview}
                            alt="Inspiration Preview"
                            className="w-24 h-24 object-cover rounded-md border border-[#D4AF37] mb-2"
                          />
                          <p className="text-xs text-[#D4AF37] font-semibold">Image selected</p>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, inspirationImageUrl: '' });
                            }}
                            className="text-[10px] text-rose-400 underline mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-8 w-8 text-[#D4AF37]" />
                          <div className="flex text-xs text-cream-200">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-semibold text-[#D4AF37] hover:text-[#E5C378] focus-within:outline-none"
                            >
                              <span>Upload a sketch or photo</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1 text-cream-300">or drag and drop</p>
                          </div>
                          <p className="text-[10px] text-cream-300/60">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B89228] text-[#041A13] font-sans text-xs uppercase tracking-[0.24em] font-bold rounded-md shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Request to Atelier...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SUBMIT BESPOKE REQUEST
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
