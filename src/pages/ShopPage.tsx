import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ProductService } from '../services/productService.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { NotebookSize, BindingType } from '../types/index.ts';

export const ShopPage: React.FC = () => {
  const { t, addSearchTerm } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const allProducts = useMemo(() => ProductService.getProducts(), []);
  const categories = useMemo(() => ProductService.getCategories(), []);

  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSize, setSelectedSize] = useState<NotebookSize | 'all'>('all');
  const [selectedBinding, setSelectedBinding] = useState<BindingType | 'all'>('all');
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync with searchParams
  const urlCategory = searchParams.get('category');
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchTerm(searchQuery.trim());
    }
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (!product.isActive) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q) || (product.nameUrdu && product.nameUrdu.includes(q));
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchDesc) return false;
      }

      // Category match
      if (selectedCategory !== 'all') {
        const catObj = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
        if (catObj && product.categoryId !== catObj.id) {
          return false;
        }
      }

      // Size match
      if (selectedSize !== 'all') {
        if (!product.availableSizes.includes(selectedSize)) return false;
      }

      // Binding match
      if (selectedBinding !== 'all') {
        if (!product.availableBindings.includes(selectedBinding)) return false;
      }

      // Customizable only
      if (customizableOnly && !product.isCustomizable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountedPrice || a.basePrice;
      const priceB = b.discountedPrice || b.basePrice;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [allProducts, categories, searchQuery, selectedCategory, selectedSize, selectedBinding, customizableOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedBinding('all');
    setCustomizableOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
            {t('Notebook & Stationery Catalog', 'نوٹ بکس اور اسٹیشنری کیٹلاگ')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t(
              `Showing ${filteredProducts.length} stationery items with Pakistan delivery`,
              `پاکستان بھر میں دستیاب ${filteredProducts.length} پروڈکٹس`
            )}
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search by name, SKU, registers, diaries...', 'نام، ایس کے یو، یا کیٹیگری تلاش کریں...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#18201b] border border-slate-300 dark:border-neutral-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3022] dark:focus:ring-amber-400 transition-all"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('Filter & Sort Options', 'فلٹر اور ترتیب کے اختیارات')}</span>
          </button>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {filteredProducts.length} {t('results', 'نتائج')}
          </span>
        </div>

        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`space-y-6 lg:block ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 bg-white dark:bg-[#151c18] p-6 overflow-y-auto' : 'hidden'
          }`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800 lg:hidden">
              <h2 className="font-bold text-slate-900 dark:text-white">{t('Filter Catalog', 'فلٹرز')}</h2>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
          )}

          {/* Sort By Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t('Sort By', 'ترتیب دیں')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-[#18201b] border border-slate-300 dark:border-neutral-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1b3022]"
            >
              <option value="featured">{t('Featured / Recommended', 'نمایاں اور تجویز کردہ')}</option>
              <option value="price-asc">{t('Price: Low to High (PKR)', 'قیمت: کم سے زیادہ')}</option>
              <option value="price-desc">{t('Price: High to Low (PKR)', 'قیمت: زیادہ سے کم')}</option>
              <option value="name">{t('Product Title (A-Z)', 'نام کے لحاظ سے')}</option>
            </select>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t('Categories', 'شعبہ جات')}
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                }`}
              >
                {t('All Notebooks & Registers', 'تمام اشیاء')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t('Notebook Size', 'سائز')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'A4', 'A5', 'A6', 'B5'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    selectedSize === sz
                      ? 'bg-[#1b3022] text-white border-[#1b3022] dark:bg-amber-400 dark:text-black'
                      : 'border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sz === 'all' ? t('Any', 'تمام') : sz}
                </button>
              ))}
            </div>
          </div>

          {/* Binding Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t('Binding Style', 'جلد بندی / بائنڈنگ')}
            </label>
            <div className="space-y-1">
              {[
                'all',
                'Hardcover Bound',
                'Spiral Wire-O',
                'Stitched & Taped Spine',
                'Leatherette Executive',
              ].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBinding(b as any)}
                  className={`w-full text-left px-2.5 py-1 text-xs rounded transition-colors ${
                    selectedBinding === b
                      ? 'bg-slate-200 dark:bg-neutral-700 font-semibold text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {b === 'all' ? t('All Bindings', 'تمام بائنڈنگز') : b}
                </button>
              ))}
            </div>
          </div>

          {/* Customizable Only Checkbox */}
          <div className="pt-2 border-t border-slate-200 dark:border-neutral-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
                className="rounded text-[#1b3022] focus:ring-[#1b3022]"
              />
              <span>{t('Customizable with your name/photo only', 'صرف کسٹمائزیشن والی نوٹ بکس')}</span>
            </label>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-neutral-800 rounded-lg hover:border-rose-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('Reset All Filters', 'تمام فلٹرز ری سیٹ کریں')}</span>
          </button>
        </aside>

        {/* Products Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4">
              <Filter className="w-10 h-10 mx-auto text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {t('No notebooks match your criteria', 'کوئی پروڈکٹ نہیں مل سکی')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t(
                  'Try searching for different keywords like "register", "spiral", "school copy", or reset active filters.',
                  'براہ کرم دوسرے الفاظ آزمائیں یا تمام فلٹرز ری سیٹ کریں۔'
                )}
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#1b3022] text-white text-xs font-semibold rounded-lg hover:bg-[#284934]"
              >
                {t('Reset Search & Filters', 'فلٹرز ری سیٹ کریں')}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="pt-8 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-2.5 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold hover:border-slate-800 dark:hover:border-amber-400 transition-colors shadow-xs"
                  >
                    {t(
                      `Load More Notebooks (${filteredProducts.length - visibleCount} remaining)`,
                      `مزید پروڈکٹس دیکھیں (${filteredProducts.length - visibleCount} باقی)`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
