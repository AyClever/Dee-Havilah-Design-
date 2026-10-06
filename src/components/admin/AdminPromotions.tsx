import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tag, Sparkles, Star, Check, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { Promotion, Product } from '../../types';

interface AdminPromotionsProps {
  promotions: Promotion[];
  products: Product[];
  onSavePromotion: (promo: Promotion) => Promise<void>;
  onToggleProductFeatured: (productId: string, featured: boolean) => Promise<void>;
}

export const AdminPromotions: React.FC<AdminPromotionsProps> = ({
  promotions,
  products,
  onSavePromotion,
  onToggleProductFeatured,
}) => {
  const activePromo = promotions[0] || {
    id: 'promo-1',
    title: 'Autumn Atelier Privilege',
    subtitle: 'Complimentary white-glove worldwide shipping on bespoke orders',
    bannerText: 'THE PRIVATE CONNOISSEURS CIRCLE: USE CODE HAVILAH10 FOR 10% ATELIER PRIVILEGE',
    promoCode: 'HAVILAH10',
    discountPercentage: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState<Promotion>(activePromo);
  const [isSaving, setIsSaving] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSavePromotion(formData);
      setSuccessSaved(true);
      setTimeout(() => setSuccessSaved(false), 2000);
    } catch (err) {
      console.error('Error saving promotion:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-cream-50">
          Promotional Banners & Homepage Featured Garments
        </h2>
        <p className="text-xs text-cream-200/70 mt-1">
          Control the announcement ticker, active VIP promo discount codes, and curate which garments appear on the homepage.
        </p>
      </div>

      {/* Part 1: Top Announcement Bar & VIP Promo Code */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#D4AF37]/20 mb-6">
          <Tag className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif text-lg font-bold text-cream-50">
            Top Banner & Discount Privileges
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center justify-between p-3.5 bg-[#041A13] rounded-xl border border-[#D4AF37]/20">
            <div>
              <span className="font-serif font-bold text-sm text-cream-100 block">
                Announcement Banner Status
              </span>
              <span className="text-[11px] text-cream-200/60 font-light">
                {formData.isActive ? 'Banner visible to visitors' : 'Banner hidden from storefront'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className="text-[#D4AF37] focus:outline-none"
            >
              {formData.isActive ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-cream-200/40" />
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
              Storefront Top Announcement Ticker Text
            </label>
            <input
              type="text"
              required
              value={formData.bannerText}
              onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                VIP Privilege Promo Code
              </label>
              <input
                type="text"
                value={formData.promoCode || ''}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                placeholder="e.g. HAVILAH10"
                className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono font-bold text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage || 10}
                onChange={(e) =>
                  setFormData({ ...formData, discountPercentage: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end items-center gap-3">
            {successSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> Promotional settings saved!
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Update Banner & Privilege'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Part 2: Homepage Curated Featured Products */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-6">
          <div className="flex items-center gap-2.5">
            <Star className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif text-lg font-bold text-cream-50">
              Curate Homepage Featured Garments ({featuredProducts.length} Active)
            </h3>
          </div>
        </div>

        <p className="text-xs text-cream-200/70 mb-4 font-light">
          Click the star on any garment to immediately feature or unfeature it from the high-fashion customer landing grid.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                product.featured
                  ? 'bg-[#0B3B2C]/70 border-[#D4AF37]'
                  : 'bg-[#041A13] border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0] || '/collections/african-wear.jpg'}
                  alt={product.name}
                  className="w-10 h-12 object-cover rounded-md border border-[#D4AF37]/30"
                />
                <div>
                  <h4 className="font-serif font-semibold text-cream-100 text-xs line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-[#D4AF37] font-mono">${product.price}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleProductFeatured(product.id, !product.featured)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  product.featured
                    ? 'bg-[#D4AF37] text-[#041A13]'
                    : 'bg-white/5 text-cream-200/40 hover:text-white'
                }`}
                title={product.featured ? 'Unfeature' : 'Feature on homepage'}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
