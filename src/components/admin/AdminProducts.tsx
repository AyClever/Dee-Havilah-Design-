import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Star,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Product, ProductCategory, ColorOption } from '../../types';
import { uploadProductImage } from '../../services/supabase';

interface AdminProductsProps {
  products: Product[];
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

const CATEGORIES: ProductCategory[] = [
  'African Wear',
  'Ready-to-Wear',
  'Corporate Wear',
  'Casual Fashion',
  'Native Attire',
  'Custom Designs',
];

const PRESET_COLORS: ColorOption[] = [
  { name: 'Deep Emerald & Gold', hex: '#062319' },
  { name: 'Emerald Jewel', hex: '#0B3B2C' },
  { name: 'Liquid Champagne Gold', hex: '#D4AF37' },
  { name: 'Midnight Onyx', hex: '#111827' },
  { name: 'Imperial Ivory', hex: '#FAF8F5' },
  { name: 'Royal Crimson', hex: '#5C1D24' },
  { name: 'Navy Sapphire', hex: '#0F1E36' },
  { name: 'Burnt Ochre', hex: '#9A3412' },
];

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Bespoke Fit'];

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    category: 'African Wear',
    gender: 'men',
    price: 450,
    originalPrice: undefined,
    stock: 10,
    images: [],
    sizes: ['M', 'L', 'XL', 'Bespoke Fit'],
    colors: [PRESET_COLORS[0]],
    featured: false,
    newArrival: true,
    bestseller: false,
    description: '',
    fabric: '',
    craftsmanship: ['Hand-finished in our Lagos Atelier'],
    careInstructions: 'Specialist dry clean only.',
    tags: ['Luxury', 'Bespoke'],
  });

  const [customCraftsmanshipInput, setCustomCraftsmanshipInput] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  const [manualImageUrl, setManualImageUrl] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `dh-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      tagline: '',
      category: 'African Wear',
      gender: 'men',
      price: 450,
      originalPrice: undefined,
      stock: 10,
      images: ['/collections/african-wear.jpg'],
      sizes: ['M', 'L', 'XL', 'Bespoke Fit'],
      colors: [PRESET_COLORS[0]],
      featured: true,
      newArrival: true,
      bestseller: false,
      description: 'Hand-tailored luxury garment crafted with African heritage embroidery.',
      fabric: '100% Premium Cotton Damask',
      craftsmanship: ['Hand-embroidered placket', 'Concealed French seams'],
      careInstructions: 'Specialist dry clean only.',
      tags: ['Luxury', 'Heritage'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const result = await uploadProductImage(file);
      if (result.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), result.url],
        }));
      }
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddManualImage = () => {
    if (manualImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), manualImageUrl.trim()],
      }));
      setManualImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const toggleSize = (size: string) => {
    const current = formData.sizes || [];
    if (current.includes(size)) {
      setFormData({ ...formData, sizes: current.filter((s) => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...current, size] });
    }
  };

  const toggleColor = (color: ColorOption) => {
    const current = formData.colors || [];
    const exists = current.some((c) => c.name === color.name || c.hex === color.hex);
    if (exists) {
      setFormData({ ...formData, colors: current.filter((c) => c.name !== color.name) });
    } else {
      setFormData({ ...formData, colors: [...current, color] });
    }
  };

  const handleAddCraftsmanship = () => {
    if (customCraftsmanshipInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        craftsmanship: [...(prev.craftsmanship || []), customCraftsmanshipInput.trim()],
      }));
      setCustomCraftsmanshipInput('');
    }
  };

  const handleRemoveCraftsmanship = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      craftsmanship: (prev.craftsmanship || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (customTagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), customTagInput.trim()],
      }));
      setCustomTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert('Please fill in garment name, category, and price.');
      return;
    }

    setIsSaving(true);
    try {
      const fullProduct: Product = {
        id: formData.id || `dh-${Date.now()}`,
        name: formData.name,
        tagline: formData.tagline || '',
        category: (formData.category as ProductCategory) || 'African Wear',
        gender: (formData.gender as 'men' | 'women' | 'unisex') || 'unisex',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        rating: formData.rating || 5.0,
        reviewCount: formData.reviewCount || 1,
        images: formData.images && formData.images.length > 0 ? formData.images : ['/collections/african-wear.jpg'],
        sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['M', 'L', 'Bespoke Fit'],
        colors: formData.colors && formData.colors.length > 0 ? formData.colors : [PRESET_COLORS[0]],
        stock: Number(formData.stock || 0),
        featured: Boolean(formData.featured),
        newArrival: Boolean(formData.newArrival),
        bestseller: Boolean(formData.bestseller),
        description: formData.description || '',
        fabric: formData.fabric || 'Luxury Textile Blend',
        craftsmanship: formData.craftsmanship || [],
        careInstructions: formData.careInstructions || 'Specialist dry clean only.',
        tags: formData.tags || [],
      };

      await onSaveProduct(fullProduct);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;

    return matchesSearch && matchesCategory && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-cream-50">
            Garment Catalog Management
          </h2>
          <p className="text-xs text-cream-200/70 mt-1">
            Create, calibrate pricing, manage atelier inventory, and feature items on the boutique.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 bg-[#062319]/80 border border-[#D4AF37]/30 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cream-200/50 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by garment title, ID, or description..."
            className="w-full pl-10 pr-4 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Collections</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-cream-200/90">
            <thead className="bg-[#041A13] border-b border-[#D4AF37]/30 text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Garment</th>
                <th className="py-3.5 px-4">Collection</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4">Price (USD)</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cream-200/50 italic">
                    No garments match your active filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg bg-[#041A13] overflow-hidden border border-[#D4AF37]/30 shrink-0">
                          <img
                            src={product.images[0] || '/collections/african-wear.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/collections/african-wear.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-cream-100 text-sm">{product.name}</p>
                          <span className="font-mono text-[10px] text-[#D4AF37]">{product.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                        {product.category}
                      </span>
                    </td>

                    {/* Gender */}
                    <td className="py-3.5 px-4 uppercase text-[10px] tracking-wider text-cream-200/80 font-mono">
                      {product.gender}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-cream-50">
                      ${product.price}
                      {product.originalPrice && (
                        <span className="text-cream-200/40 line-through ml-1.5 text-[11px]">
                          ${product.originalPrice}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                          product.stock > 5
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                            : product.stock > 0
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                            : 'bg-red-950/80 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    {/* Featured / Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {product.featured && (
                          <span className="p-1 rounded bg-[#D4AF37]/20 text-[#D4AF37]" title="Featured">
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </span>
                        )}
                        {product.newArrival && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-blue-900/60 text-blue-200 border border-blue-500/30">
                            New
                          </span>
                        )}
                        {product.bestseller && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-purple-900/60 text-purple-200 border border-purple-500/30">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-cream-200/70 hover:text-[#D4AF37] hover:bg-white/5 rounded transition-colors"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 text-cream-200/70 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-[#062319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-8"
          >
            {/* Modal Header */}
            <div className="p-6 bg-[#041A13] border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-cream-50">
                  {editingProduct ? 'Edit Garment Details' : 'Commission New Garment'}
                </h3>
                <p className="text-xs text-cream-200/60 font-light">
                  {editingProduct ? `Ref ID: ${editingProduct.id}` : 'Create a new design in the atelier database.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-cream-200/60 hover:text-white rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Name, Tagline, Category, Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Sovereign Emerald Agbada Set"
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
                    placeholder="e.g. Royal 3-piece native attire with bullion gold needlework"
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Collection Category *
                  </label>
                  <select
                    value={formData.category || 'African Wear'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Gender Department
                  </label>
                  <select
                    value={formData.gender || 'men'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'men' | 'women' | 'unisex' })}
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex / All</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Original Price, Stock, Availability Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Base Price (USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="For strike-through sale"
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Stock Inventory Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock ?? 5}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Showcase Toggles */}
              <div className="flex flex-wrap gap-6 p-3.5 bg-[#041A13] rounded-lg border border-[#D4AF37]/20">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-cream-100">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.featured)}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-[#D4AF37] text-[#062319] focus:ring-[#D4AF37]"
                  />
                  <span>Featured on Home Showcase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-cream-100">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.newArrival)}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="w-4 h-4 rounded border-[#D4AF37] text-[#062319] focus:ring-[#D4AF37]"
                  />
                  <span>New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-cream-100">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.bestseller)}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="w-4 h-4 rounded border-[#D4AF37] text-[#062319] focus:ring-[#D4AF37]"
                  />
                  <span>Bestseller Badge</span>
                </label>
              </div>

              {/* Garment Images */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                    Garment Photography
                  </label>
                </div>

                {/* Upload or Manual URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#041A13]/50">
                    <Upload className="w-5 h-5 text-[#D4AF37] mb-1" />
                    <span className="text-xs font-semibold text-cream-100">
                      {isUploadingImage ? 'Uploading Image...' : 'Upload Image File'}
                    </span>
                    <span className="text-[10px] text-cream-200/50">JPG, PNG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      placeholder="Paste Image URL..."
                      className="flex-1 px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualImage}
                      className="px-3.5 bg-[#D4AF37] text-[#041A13] font-bold text-xs rounded-lg hover:bg-[#E5C378]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Thumbnails preview */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {(formData.images || []).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#D4AF37]/40 bg-[#041A13] group"
                    >
                      <img src={imgUrl} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/10">
                {/* Sizes */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-2">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SIZES.map((size) => {
                      const isSelected = (formData.sizes || []).includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                            isSelected
                              ? 'bg-[#D4AF37] text-[#041A13] shadow-md'
                              : 'bg-[#041A13] border border-white/20 text-cream-200 hover:border-[#D4AF37]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-2">
                    Color Palettes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((col) => {
                      const isSelected = (formData.colors || []).some((c) => c.name === col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => toggleColor(col)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                            isSelected
                              ? 'bg-[#0B3B2C] border-2 border-[#D4AF37] text-cream-100'
                              : 'bg-[#041A13] border border-white/20 text-cream-200/80 hover:border-white/40'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-white/30"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Description & Fabric */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                    Garment Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the silhouette, inspiration, cut, and occasion..."
                    className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                      Fabric & Textile
                    </label>
                    <input
                      type="text"
                      value={formData.fabric || ''}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="e.g. 100% Swiss Cotton Damask with Gold Thread"
                      className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                      Care Instructions
                    </label>
                    <input
                      type="text"
                      value={formData.careInstructions || ''}
                      onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                      placeholder="e.g. Specialist dry clean only. Steam gently."
                      className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Craftsmanship Bullets */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                  Artisanal Craftsmanship Highlights
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={customCraftsmanshipInput}
                    onChange={(e) => setCustomCraftsmanshipInput(e.target.value)}
                    placeholder="e.g. Hand-embroidered placket heraldry"
                    className="flex-1 px-3.5 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCraftsmanship}
                    className="px-3.5 bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold rounded-lg hover:bg-white/20"
                  >
                    Add Point
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(formData.craftsmanship || []).map((point, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-1.5 bg-[#041A13] rounded border border-white/5 text-xs text-cream-200"
                    >
                      <span>• {point}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCraftsmanship(i)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-[#D4AF37]/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving Garment...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProduct ? 'Update Garment' : 'Publish Garment'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#062319] border border-red-500/50 rounded-2xl p-6 shadow-2xl text-cream-50"
          >
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-lg font-bold text-center text-cream-100">
              Confirm Garment Removal
            </h3>

            <p className="text-xs text-cream-200/80 text-center mt-2 leading-relaxed font-light">
              Are you sure you want to delete{' '}
              <strong className="text-white">{productToDelete.name}</strong> ({productToDelete.id})
              from the atelier catalog?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Garment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
