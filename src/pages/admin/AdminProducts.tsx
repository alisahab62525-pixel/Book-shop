import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Sparkles, Image, BookOpen } from 'lucide-react';
import { ProductService } from '../../services/productService.ts';
import { Product, ProductCategory, NotebookSize, PageCount, RulingType, BindingType, PaperType, CoverFinish } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminProducts: React.FC = () => {
  const { showToast } = useApp();
  const [products, setProducts] = useState<Product[]>(() => ProductService.getProducts());
  const [categories, setCategories] = useState<ProductCategory[]>(() => ProductService.getCategories());

  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatUrdu, setNewCatUrdu] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Form state for creating / editing product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    nameUrdu: '',
    sku: '',
    slug: '',
    description: '',
    categoryId: categories[0]?.id || 'cat-personalized',
    categoryName: categories[0]?.name || 'Personalized Notebooks',
    coverImage: '',
    basePrice: 650,
    discountedPrice: undefined,
    stockQuantity: 50,
    lowStockThreshold: 10,
    availableSizes: ['A5', 'A4'],
    availablePageCounts: [100, 160],
    availableRulings: ['Single Line', 'Grid / Math', 'Urdu / Right Margin'],
    availableBindings: ['Hardcover Bound', 'Spiral Wire-O'],
    availablePaper: ['80 GSM Ivory Book Paper'],
    availableFinishes: ['Velvet Matte Lamination', 'Gold Foil Stamping'],
    isCustomizable: true,
    minOrderQuantity: 1,
    estimatedProductionDays: 2,
    isFeatured: true,
    isBestseller: false,
    isActive: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      nameUrdu: '',
      sku: `BN-NEW-${Math.floor(100 + Math.random() * 900)}`,
      slug: `custom-notebook-${Date.now()}`,
      description: '',
      categoryId: categories[0]?.id || 'cat-personalized',
      categoryName: categories[0]?.name || 'Personalized Notebooks',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      basePrice: 750,
      stockQuantity: 40,
      lowStockThreshold: 8,
      availableSizes: ['A5', 'A4'],
      availablePageCounts: [100, 160, 200],
      availableRulings: ['Single Line', 'Urdu / Right Margin'],
      availableBindings: ['Hardcover Bound', 'Spiral Wire-O'],
      availablePaper: ['80 GSM Ivory Book Paper'],
      availableFinishes: ['Velvet Matte Lamination'],
      isCustomizable: true,
      minOrderQuantity: 1,
      estimatedProductionDays: 2,
      isFeatured: false,
      isBestseller: false,
      isActive: true,
    });
    setEditingProduct(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (p: Product) => {
    setFormData({ ...p });
    setEditingProduct(p);
    setIsCreating(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.basePrice) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }

    const cat = categories.find((c) => c.id === formData.categoryId);
    const categoryName = cat ? cat.name : 'Stationery';

    if (editingProduct) {
      const updated = ProductService.updateProduct(editingProduct.id, {
        ...formData,
        categoryName,
      });
      if (updated) {
        setProducts(ProductService.getProducts());
        showToast('Product updated successfully', 'success');
      }
    } else {
      ProductService.addProduct({
        ...(formData as any),
        categoryName,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      });
      setProducts(ProductService.getProducts());
      showToast('New product added to catalog', 'success');
    }

    setIsCreating(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    const success = ProductService.deleteProduct(id);
    if (success) {
      setProducts(ProductService.getProducts());
      showToast('Product deleted from catalog', 'info');
    }
    setDeleteConfirmId(null);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: ProductCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      nameUrdu: newCatUrdu.trim() || newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: 'Custom category',
      order: categories.length + 1,
      itemCount: 0,
    };

    const updated = [...categories, newCat];
    ProductService.saveCategories(updated);
    setCategories(updated);
    setNewCatName('');
    setNewCatUrdu('');
    setNewCatSlug('');
    showToast('Category created', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'products'
                ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'categories'
                ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Notebook / Product</span>
          </button>
        )}
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 border-b font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Product Name & SKU</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Base Price (PKR)</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Customizable</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        SKU: {p.sku} {p.isFeatured ? '· Featured' : ''}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.categoryName}</td>
                    <td className="py-3 px-3 font-mono font-semibold">
                      Rs. {p.basePrice}
                      {p.discountedPrice && (
                        <span className="text-[10px] text-emerald-600 block">
                          Sale: Rs. {p.discountedPrice}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={`font-semibold ${p.stockQuantity <= p.lowStockThreshold ? 'text-rose-600 font-bold' : ''}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {p.isCustomizable ? (
                        <span className="text-emerald-700 font-medium">Yes</span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 p-1 rounded border border-rose-200">
                            <span className="text-[10px] text-rose-700">Delete?</span>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[10px] text-slate-600 px-1"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCategory} className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Create New Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Category Name (English)</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Spiral Diaries"
                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category Name (Urdu)</label>
                <input
                  type="text"
                  value={newCatUrdu}
                  onChange={(e) => setNewCatUrdu(e.target.value)}
                  placeholder="e.g. اسپائرل ڈائریاں"
                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-urdu"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. spiral-diaries"
                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1b3022] text-white rounded font-semibold"
            >
              Add Category
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {categories.map((c) => (
              <div key={c.id} className="p-3 bg-white dark:bg-neutral-800 rounded-lg border flex justify-between items-center">
                <div>
                  <span className="font-bold block text-slate-900 dark:text-white">{c.name}</span>
                  <span className="text-slate-400 font-urdu">{c.nameUrdu}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{c.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#18201b] rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Notebook / Stationery Product'}
              </h2>
              <button onClick={() => setIsCreating(false)} className="p-1">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Product Title (Urdu)</label>
                  <input
                    type="text"
                    value={formData.nameUrdu || ''}
                    onChange={(e) => setFormData({ ...formData, nameUrdu: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded font-urdu"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Base Price (PKR) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.basePrice || 0}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Discounted / Sale Price (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.discountedPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountedPrice: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.stockQuantity || 0}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="/src/assets/... or image URL"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCustomizable}
                    onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                  />
                  <span>Customizable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active in Store</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b3022] text-white rounded font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
