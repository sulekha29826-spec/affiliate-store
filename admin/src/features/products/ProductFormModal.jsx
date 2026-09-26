import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { slugify } from '../../utils/slugify';

const STANDARD_PLATFORMS = ['amazon', 'flipkart', 'myntra', 'meesho', 'ajio', 'boat'];

export default function ProductFormModal({ product, categories = [], onSave, onClose }) {
  const isEditing = Boolean(product && product.id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [platformOption, setPlatformOption] = useState('amazon');
  const [customPlatform, setCustomPlatform] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [images, setImages] = useState(['']);
  const [status, setStatus] = useState('active');
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setSlug(product.slug || '');
      setDescription(product.description || '');
      setCategoryId(product.categoryId || (categories[0]?.id || ''));
      setSubCategory(product.subCategory || '');
      
      const p = (product.platform || 'amazon').toLowerCase();
      if (STANDARD_PLATFORMS.includes(p)) {
        setPlatformOption(p);
        setCustomPlatform('');
      } else {
        setPlatformOption('other');
        setCustomPlatform(p);
      }

      setAffiliateLink(product.affiliateLink || '');
      setPrice(product.price || '');
      setOriginalPrice(product.originalPrice || '');
      setImages(product.images && product.images.length > 0 ? product.images : ['']);
      setStatus(product.status || 'active');
      setTags(product.tags || []);
    } else {
      setCategoryId(categories[0]?.id || 'electronics');
    }
  }, [product, categories]);

  // Auto-generate slug when title changes if adding new
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  // Auto-calculated discount percent
  const discountPercent =
    price && originalPrice && Number(originalPrice) > Number(price)
      ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
      : 0;

  // Handle image URLs
  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index) => {
    if (images.length === 1) {
      setImages(['']);
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  // Toggle tags
  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const finalPlatform = platformOption === 'other' ? customPlatform.trim().toLowerCase() : platformOption;

    const payload = {
      ...(product || {}),
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      description: description.trim(),
      categoryId,
      subCategory: subCategory.trim(),
      platform: finalPlatform || 'other',
      affiliateLink: affiliateLink.trim(),
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || 0,
      discountPercent,
      images: images.filter((img) => img.trim().length > 0),
      status,
      tags,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">
            {isEditing ? 'Edit Affiliate Product' : 'Add New Affiliate Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Sony WH-1000XM5 Wireless Headphones"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              SEO URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="sony-wh-1000xm5"
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
          </div>

          {/* Grid: Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Sub-Category
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Headphones, Laptops, etc."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Platform Selector & Custom Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Merchant / Affiliate Platform *
              </label>
              <select
                value={platformOption}
                onChange={(e) => setPlatformOption(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
              >
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
                <option value="myntra">Myntra</option>
                <option value="meesho">Meesho</option>
                <option value="ajio">Ajio</option>
                <option value="boat">boAt</option>
                <option value="other">Other (Custom Merchant)</option>
              </select>
            </div>

            {platformOption === 'other' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Custom Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  placeholder="e.g. TataCliq, Croma, Nykaa"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Affiliate Link */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Affiliate Redirect Link (with tracking tag) *
            </label>
            <input
              type="url"
              required
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              placeholder="https://amzn.to/xxx or https://flipkart.com/...?affid=xxx"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price, MRP, Auto Discount */}
          <div className="grid grid-cols-3 gap-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Sale Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="24999"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                MRP / Original (₹)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="34999"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Calculated Off
              </label>
              <div className="bg-slate-800 border border-slate-700 text-emerald-400 font-bold rounded-lg p-2.5 text-center">
                {discountPercent}%
              </div>
            </div>
          </div>

          {/* Images list with preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium">
                Product Image URLs
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Image URL</span>
              </button>
            </div>

            <div className="space-y-2">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {img ? (
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/... or ImgBB / Cloudinary URL"
                    className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="text-slate-400 hover:text-rose-400 p-1.5 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Overview & Features
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key specifications, highlights, deal perks..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Promotion Badges / Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['trending', 'bestseller', 'deal_of_the_day'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      tags.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
              >
                <option value="active">Active (Visible on Storefront)</option>
                <option value="inactive">Inactive (Hidden)</option>
                <option value="expired">Expired Deal</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
