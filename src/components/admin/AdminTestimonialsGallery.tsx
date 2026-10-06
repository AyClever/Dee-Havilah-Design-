import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  X,
  Sparkles,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { Testimonial } from '../../types';
import { uploadProductImage } from '../../services/supabase';

interface AdminTestimonialsGalleryProps {
  testimonials: Testimonial[];
  galleryItems: any[];
  onSaveTestimonial: (t: Testimonial) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
  onSaveGalleryItem: (item: any) => Promise<void>;
  onDeleteGalleryItem: (id: string) => Promise<void>;
}

export const AdminTestimonialsGallery: React.FC<AdminTestimonialsGalleryProps> = ({
  testimonials,
  galleryItems,
  onSaveTestimonial,
  onDeleteTestimonial,
  onSaveGalleryItem,
  onDeleteGalleryItem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'testimonials' | 'gallery'>('testimonials');

  // Testimonials State
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [tFormData, setTFormData] = useState<Partial<Testimonial>>({});

  // Gallery State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [gFormData, setGFormData] = useState<any>({
    id: '',
    image: '',
    caption: '',
    likes: '1.5k',
    comments: '42',
  });
  const [isUploading, setIsUploading] = useState(false);

  // Testimonial Handlers
  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTFormData({
      id: `t-${Date.now()}`,
      name: '',
      role: 'Private Client',
      location: 'Lagos, Nigeria',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      quote: '',
      rating: 5,
      outfitPurchased: 'Sovereign Bespoke Commission',
      verified: true,
    });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTFormData({ ...t });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tFormData.name || !tFormData.quote) return;

    const testimonial: Testimonial = {
      id: tFormData.id || `t-${Date.now()}`,
      name: tFormData.name,
      role: tFormData.role || 'Client',
      location: tFormData.location || '',
      avatar: tFormData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      quote: tFormData.quote,
      rating: Number(tFormData.rating || 5),
      outfitPurchased: tFormData.outfitPurchased || 'Bespoke Atelier Commission',
      verified: Boolean(tFormData.verified),
    };

    await onSaveTestimonial(testimonial);
    setIsTestimonialModalOpen(false);
  };

  // Gallery Handlers
  const handleUploadGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadProductImage(file);
      if (res.url) {
        setGFormData((prev: any) => ({ ...prev, image: res.url }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gFormData.image) return;

    const item = {
      id: gFormData.id || `ig-${Date.now()}`,
      image: gFormData.image,
      caption: gFormData.caption || 'Dee Havilah Haute Couture',
      likes: gFormData.likes || '1.8k',
      comments: gFormData.comments || '56',
    };

    await onSaveGalleryItem(item);
    setIsGalleryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-cream-50">
            Social Proof & Atelier Lookbook
          </h2>
          <p className="text-xs text-cream-200/70 mt-1">
            Manage high-profile client endorsements, verified testimonials, and lookbook imagery.
          </p>
        </div>

        <div className="flex bg-[#041A13] p-1 rounded-xl border border-[#D4AF37]/30">
          <button
            type="button"
            onClick={() => setActiveSubTab('testimonials')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeSubTab === 'testimonials'
                ? 'bg-[#D4AF37] text-[#041A13] shadow'
                : 'text-cream-200 hover:text-white'
            }`}
          >
            VIP Testimonials ({testimonials.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('gallery')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeSubTab === 'gallery'
                ? 'bg-[#D4AF37] text-[#041A13] shadow'
                : 'text-cream-200 hover:text-white'
            }`}
          >
            Lookbook Gallery ({galleryItems.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TESTIMONIALS */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openAddTestimonial}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add VIP Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif font-bold text-cream-100 text-sm">{t.name}</h4>
                          {t.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" title="Verified Client" />
                          )}
                        </div>
                        <p className="text-[11px] text-cream-200/60 font-light">
                          {t.role} • {t.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < t.rating ? 'fill-[#D4AF37]' : 'text-cream-200/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-cream-200/90 italic font-serif leading-relaxed">
                    "{t.quote}"
                  </p>

                  <div className="text-[10px] text-[#D4AF37] font-mono">
                    Outfit: <strong>{t.outfitPurchased}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditTestimonial(t)}
                    className="p-1.5 text-cream-200/60 hover:text-[#D4AF37]"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTestimonial(t.id)}
                    className="p-1.5 text-cream-200/60 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GALLERY */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setGFormData({
                  id: `ig-${Date.now()}`,
                  image: '',
                  caption: 'Gold needlework precision. Every stitch tells an ancestral story. #DeeHavilahLuxury',
                  likes: '2.5k',
                  comments: '110',
                });
                setIsGalleryModalOpen(true);
              }}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lookbook Image</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-xl overflow-hidden shadow-lg group relative flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-[#041A13]">
                  <img
                    src={item.image}
                    alt="Gallery item"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white text-xs">
                    <p className="line-clamp-3 font-light text-[11px]">{item.caption}</p>
                    <div className="flex justify-between items-center text-[10px] text-[#D4AF37]">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current" /> {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {item.comments}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-[#041A13] flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-[#D4AF37]">{item.id}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteGalleryItem(item.id)}
                    className="p-1 text-cream-200/50 hover:text-red-400"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#062319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl p-6 text-cream-50"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-cream-100">
                {editingTestimonial ? 'Edit Testimonial' : 'Add VIP Testimonial'}
              </h3>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="text-cream-200/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={tFormData.name || ''}
                    onChange={(e) => setTFormData({ ...tFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    value={tFormData.role || ''}
                    onChange={(e) => setTFormData({ ...tFormData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={tFormData.location || ''}
                    onChange={(e) => setTFormData({ ...tFormData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                    Rating (1 to 5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={tFormData.rating || 5}
                    onChange={(e) => setTFormData({ ...tFormData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                  Outfit Commissioned
                </label>
                <input
                  type="text"
                  value={tFormData.outfitPurchased || ''}
                  onChange={(e) => setTFormData({ ...tFormData, outfitPurchased: e.target.value })}
                  placeholder="e.g. Imperial Senator Bespoke Tunic"
                  className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                  Testimonial Quote
                </label>
                <textarea
                  rows={3}
                  required
                  value={tFormData.quote || ''}
                  onChange={(e) => setTFormData({ ...tFormData, quote: e.target.value })}
                  className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={tFormData.avatar || ''}
                  onChange={(e) => setTFormData({ ...tFormData, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#062319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl p-6 text-cream-50"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-cream-100">
                Add Lookbook Image
              </h3>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-cream-200/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                  Image (Upload / URL)
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    required
                    value={gFormData.image}
                    onChange={(e) => setGFormData({ ...gFormData, image: e.target.value })}
                    placeholder="https://... image link"
                    className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[#D4AF37]/40 rounded-lg text-xs text-[#D4AF37] cursor-pointer hover:bg-white/5">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadGalleryImage}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#D4AF37] font-semibold mb-1">
                  Caption
                </label>
                <textarea
                  rows={3}
                  value={gFormData.caption}
                  onChange={(e) => setGFormData({ ...gFormData, caption: e.target.value })}
                  placeholder="Editorial caption & hashtags..."
                  className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg"
                >
                  Save to Lookbook
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
