import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Edit2, Check, X, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import { CategoryCard, ProductCategory } from '../../types';
import { uploadProductImage } from '../../services/supabase';

interface AdminCollectionsProps {
  categories: CategoryCard[];
  onUpdateCategory: (category: CategoryCard) => Promise<void>;
}

export const AdminCollections: React.FC<AdminCollectionsProps> = ({
  categories,
  onUpdateCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<CategoryCard | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<CategoryCard>>({});

  const openEdit = (cat: CategoryCard) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadProductImage(file);
      if (res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      console.error('Error uploading collection cover:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formData.title) return;

    setIsSaving(true);
    try {
      const updated: CategoryCard = {
        id: editingCategory.id,
        title: formData.title || editingCategory.title,
        tagline: formData.tagline || editingCategory.tagline,
        description: formData.description || editingCategory.description,
        image: formData.image || editingCategory.image,
        itemCount: Number(formData.itemCount ?? editingCategory.itemCount),
        accent: formData.accent || editingCategory.accent,
      };

      await onUpdateCategory(updated);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving collection:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-cream-50">
          Signature Collections & Lines
        </h2>
        <p className="text-xs text-cream-200/70 mt-1">
          Curate the 6 foundational pillars of Dee Havilah Design. Customize editorial banners, descriptions, and accents.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#062319]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between group"
          >
            {/* Cover image banner */}
            <div className="relative h-56 bg-[#041A13] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/collections/african-wear.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062319] via-[#062319]/40 to-transparent" />

              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#041A13]/90 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-sm">
                  {cat.itemCount} Garments
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37] block">
                  {cat.accent}
                </span>
                <h3 className="font-serif text-xl font-bold text-cream-50 drop-shadow">
                  {cat.title}
                </h3>
              </div>
            </div>

            {/* Description & Action */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <p className="text-xs italic text-[#D4AF37] font-serif">"{cat.tagline}"</p>
                <p className="text-xs text-cream-200/80 leading-relaxed font-light line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-cream-200/50 font-mono">
                  Collection ID: {cat.id}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-[#D4AF37] hover:text-[#041A13] text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Collection</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Collection Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#062319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 bg-[#041A13] border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  Edit Collection: {editingCategory.title}
                </h3>
                <p className="text-xs text-cream-200/60 font-light">
                  Changes will update the homepage categories showcase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-cream-200/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                  Collection Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                  Editorial Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Accent Feature Tag
                  </label>
                  <input
                    type="text"
                    value={formData.accent || ''}
                    onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                    placeholder="e.g. Gold & Emerald Embroidery"
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Item Count Display
                  </label>
                  <input
                    type="number"
                    value={formData.itemCount ?? 25}
                    onChange={(e) => setFormData({ ...formData, itemCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                  Cover Editorial Photo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL or media storage path"
                    className="flex-1 px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 rounded-lg text-xs text-[#D4AF37] flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Update Collection'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
