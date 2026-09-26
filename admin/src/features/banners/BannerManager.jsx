import React, { useState, useEffect } from 'react';
import {
  getAdminBanners,
  saveBanner,
  deleteBanner,
} from '../../services/adminService';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(1);
  const [active, setActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminBanners();
      setBanners(data);
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setImage('');
    setLink('/category/electronics');
    setOrder(banners.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingId(b.id);
    setTitle(b.title || '');
    setImage(b.image || '');
    setLink(b.link || '');
    setOrder(b.order || 1);
    setActive(b.active !== undefined ? b.active : true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || `banner_${Date.now()}`,
      title: title.trim(),
      image: image.trim(),
      link: link.trim(),
      order: Number(order) || 1,
      active,
    };

    await saveBanner(payload);
    setIsModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id, bTitle) => {
    if (window.confirm(`Delete banner "${bTitle || 'this banner'}"?`)) {
      await deleteBanner(id);
      await loadData();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Homepage Banners</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Control promotional slides, hero campaigns, and seasonal sales.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-10 text-slate-500">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500">
            No banners created.
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 bg-slate-800">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                        b.active
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {b.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5 text-xs">
                  <h3 className="font-semibold text-white truncate">
                    {b.title || 'Untitled Banner'}
                  </h3>
                  <p className="text-slate-400 font-mono text-[11px] truncate">
                    Target: {b.link}
                  </p>
                  <p className="text-indigo-400 font-medium">Order: #{b.order}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Slide #{b.order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1.5 text-slate-400 hover:text-white rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingId ? 'Edit Banner' : 'Create Banner'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Festive Electronic Carnival"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Image URL (1600x600 recommended) *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Destination Link
                </label>
                <input
                  type="text"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/category/electronics or full external URL"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Status
                  </label>
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded accent-indigo-600 w-4 h-4"
                    />
                    <span className="text-slate-300">Active on site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
