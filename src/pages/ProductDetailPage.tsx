import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Check,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ProductService } from '../services/productService.ts';
import { PricingService } from '../services/pricingService.ts';
import { sampleReviews } from '../data/initialData.ts';
import {
  NotebookSize,
  PageCount,
  RulingType,
  BindingType,
  PaperType,
  CoverFinish,
  CartItem,
  NotebookCustomizationSelection,
} from '../types/index.ts';
import { NotebookCoverPreview } from '../components/notebook/NotebookCoverPreview.tsx';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings, addToCart, isInWishlist, toggleWishlist, addRecentlyViewed, t, language } = useApp();

  const product = useMemo(() => {
    if (!slug) return undefined;
    return ProductService.getProductBySlug(slug) || ProductService.getProductById(slug);
  }, [slug]);

  const productId = product?.id;
  useEffect(() => {
    if (productId) {
      addRecentlyViewed(productId);
    }
  }, [productId, addRecentlyViewed]);

  // Options state
  const [selectedSize, setSelectedSize] = useState<NotebookSize>(product?.availableSizes[0] || 'A5');
  const [selectedPages, setSelectedPages] = useState<PageCount>(product?.availablePageCounts[0] || 160);
  const [selectedRuling, setSelectedRuling] = useState<RulingType>(product?.availableRulings[0] || 'Single Line');
  const [selectedBinding, setSelectedBinding] = useState<BindingType>(product?.availableBindings[0] || 'Hardcover Bound');
  const [selectedPaper, setSelectedPaper] = useState<PaperType>(product?.availablePaper[0] || '80 GSM Ivory Book Paper');
  const [selectedFinish, setSelectedFinish] = useState<CoverFinish>(product?.availableFinishes[0] || 'Velvet Matte Lamination');
  const [quantity, setQuantity] = useState(1);

  // Quick personalization inline state
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [foilStamp, setFoilStamp] = useState(false);
  const [coverColor, setCoverColor] = useState('#1b3022');
  const [previewTab, setPreviewTab] = useState<'photo' | 'mockup' | 'ruling'>('photo');

  // Customer reviews state
  const [reviews, setReviews] = useState(sampleReviews);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Product Not Found</h1>
        <p className="text-slate-500 text-sm">The notebook or register you requested does not exist or was moved.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-[#1b3022] text-white rounded-lg text-xs font-semibold">
          Browse Catalog
        </Link>
      </div>
    );
  }

  // Calculate pricing breakdown
  const customSelection: Partial<NotebookCustomizationSelection> = {
    size: selectedSize,
    pageCount: selectedPages,
    ruling: selectedRuling,
    binding: selectedBinding,
    paperType: selectedPaper,
    coverFinish: selectedFinish,
    customTitle,
    customSubtitle,
    foilStampText: foilStamp,
    coverColor,
  };

  const priceCalc = PricingService.calculateCustomNotebookPrice(
    product.discountedPrice || product.basePrice,
    customSelection,
    quantity,
    settings
  );

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    const isCustomized = !!(customTitle.trim() || foilStamp);
    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      unitPrice: priceCalc.unitPrice,
      quantity,
      coverImageThumbnail: product.coverImage,
      isCustomized,
      customization: isCustomized
        ? {
            size: selectedSize,
            pageCount: selectedPages,
            ruling: selectedRuling,
            binding: selectedBinding,
            paperType: selectedPaper,
            coverFinish: selectedFinish,
            customTitle: customTitle.trim() || 'Custom Print',
            customSubtitle,
            coverColor,
            accentColor: foilStamp ? '#d4af37' : '#ffffff',
            fontStyle: 'classic',
            alignment: 'center',
            foilStampText: foilStamp,
          }
        : undefined,
      snapshotPriceBreakdown: {
        basePrice: priceCalc.basePrice,
        optionsSurcharge: priceCalc.optionsSurcharge,
        customPrintingFee: priceCalc.customPrintingFee,
        unitTotal: priceCalc.unitPrice,
      },
    };

    addToCart(cartItem);
  };

  const handleWhatsAppOrder = () => {
    const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const lines = [
      `*New Notebook Inquiry / Order Request*`,
      `*Product:* ${product.name}`,
      `*SKU:* ${product.sku}`,
      `*Size:* ${selectedSize}`,
      `*Pages:* ${selectedPages}`,
      `*Ruling:* ${selectedRuling}`,
      `*Binding:* ${selectedBinding}`,
      `*Paper:* ${selectedPaper}`,
      `*Finish:* ${selectedFinish}`,
      `*Quantity:* ${quantity}`,
      customTitle ? `*Custom Title:* ${customTitle}` : null,
      customSubtitle ? `*Subtitle:* ${customSubtitle}` : null,
      foilStamp ? `*Gold Foil:* Yes` : null,
      `*Estimated Price:* Rs. ${priceCalc.finalProductTotal}`,
      `*Delivery City:* Pakistan`,
      `Please confirm stock and dispatch schedule!`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: newReviewAuthor.trim(),
      city: newReviewCity.trim() || 'Pakistan',
      rating: newReviewRating,
      date: new Date().toISOString().slice(0, 10),
      comment: newReviewText.trim(),
      isVerifiedBuyer: true,
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:underline">Catalog</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.categoryId}`} className="hover:underline">{product.categoryName}</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Module Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Gallery & Mockup Tabs */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setPreviewTab('photo')}
              className={`flex-1 py-1.5 rounded-md transition-colors ${
                previewTab === 'photo'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('Product Studio Shot', 'اصلی پروڈکٹ تصویر')}
            </button>
            <button
              onClick={() => setPreviewTab('mockup')}
              className={`flex-1 py-1.5 rounded-md transition-colors ${
                previewTab === 'mockup'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('Live 3D Cover Mockup', 'لائیو کور پریویو')}
            </button>
            <button
              onClick={() => setPreviewTab('ruling')}
              className={`flex-1 py-1.5 rounded-md transition-colors ${
                previewTab === 'ruling'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('Inner Ruling Page', 'اندرونی صفحات کا نمونہ')}
            </button>
          </div>

          {/* Visual Display */}
          <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-[#f4f0e8] dark:bg-neutral-900 overflow-hidden min-h-[420px] flex items-center justify-center p-4">
            {previewTab === 'photo' && (
              <img
                src={product.coverImage}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            )}

            {previewTab === 'mockup' && (
              <NotebookCoverPreview
                customization={{
                  size: selectedSize,
                  pageCount: selectedPages,
                  ruling: selectedRuling,
                  binding: selectedBinding,
                  paperType: selectedPaper,
                  coverFinish: selectedFinish,
                  customTitle: customTitle || product.name,
                  customSubtitle: customSubtitle,
                  coverColor,
                  accentColor: foilStamp ? '#d4af37' : '#ffffff',
                  fontStyle: 'classic',
                  alignment: 'center',
                  foilStampText: foilStamp,
                }}
                activeView="front"
              />
            )}

            {previewTab === 'ruling' && (
              <NotebookCoverPreview
                customization={{
                  size: selectedSize,
                  pageCount: selectedPages,
                  ruling: selectedRuling,
                  binding: selectedBinding,
                  paperType: selectedPaper,
                  coverFinish: selectedFinish,
                  customTitle: '',
                  coverColor: '#ffffff',
                  accentColor: '#000000',
                  fontStyle: 'classic',
                  alignment: 'center',
                  foilStampText: false,
                }}
                activeView="inside"
              />
            )}
          </div>

          {/* Link to Full Studio Customizer */}
          {product.isCustomizable && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  {t('Want to upload your own artwork or logo?', 'کیا آپ اپنی تصویر یا لوگو لگانا چاہتے ہیں؟')}
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  {t('Open our interactive browser customization studio with canvas controls.', 'ہماری فل اسٹوڈیو ورکشاپ کھولیں۔')}
                </p>
              </div>
              <Link
                to={`/customize?product=${product.id}`}
                className="px-3 py-1.5 bg-[#1b3022] text-white rounded text-xs font-semibold whitespace-nowrap"
              >
                {t('Open Studio', 'اسٹوڈیو کھولیں')}
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {product.categoryName} · SKU: {product.sku}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border transition-colors ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:text-rose-600'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white mt-1">
              {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
            </h1>

            {/* Price display with breakdown */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                Rs. {priceCalc.finalProductTotal}
              </span>
              {quantity > 1 && (
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  (Rs. {priceCalc.unitPrice} each × {quantity})
                </span>
              )}
              {priceCalc.bulkDiscountAmount > 0 && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  {priceCalc.bulkDiscountPercent}% bulk discount applied!
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-neutral-800 pt-4">
            {product.description}
          </p>

          {/* Option Selector 1: Notebook Size */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{t('Size Format', 'سائز فارمیٹ')}</span>
              <span className="text-[11px] font-normal text-slate-500">Selected: {selectedSize}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {product.availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    selectedSize === sz
                      ? 'border-[#1b3022] bg-[#1b3022] text-white dark:border-amber-400 dark:bg-amber-400 dark:text-black shadow-xs'
                      : 'border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Option Selector 2: Page Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{t('Page Count', 'صفحات کی تعداد')}</span>
              <span className="text-[11px] font-normal text-slate-500">{selectedPages} Pages</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {product.availablePageCounts.map((pc) => (
                <button
                  key={pc}
                  onClick={() => setSelectedPages(pc)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    selectedPages === pc
                      ? 'border-[#1b3022] bg-[#1b3022] text-white dark:border-amber-400 dark:bg-amber-400 dark:text-black shadow-xs'
                      : 'border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {pc} Pages
                </button>
              ))}
            </div>
          </div>

          {/* Option Selector 3: Ruling Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('Inner Page Ruling', 'اندرونی صفحات کا ڈیزائن')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {product.availableRulings.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRuling(r);
                    if (previewTab === 'ruling') setPreviewTab('ruling');
                  }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-all ${
                    selectedRuling === r
                      ? 'border-[#1b3022] bg-slate-100 dark:bg-neutral-800 font-bold text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Option Selector 4: Binding Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('Binding Style', 'جلد بندی')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {product.availableBindings.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBinding(b)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-all ${
                    selectedBinding === b
                      ? 'border-[#1b3022] bg-slate-100 dark:bg-neutral-800 font-bold text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Inline Personalization Section */}
          {product.isCustomizable && (
            <div className="p-4 bg-slate-50 dark:bg-[#18201b] border border-slate-200 dark:border-neutral-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('Personalize Cover Text', 'کور پر نام یا خطاطی درج کریں')}</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  +{settings.pricingRules.customPrintBaseSurcharge} PKR
                </span>
              </div>

              <input
                type="text"
                value={customTitle}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                  if (previewTab === 'photo') setPreviewTab('mockup');
                }}
                placeholder={t('Enter Name, Urdu Calligraphy, or Title', 'اپنا نام یا عنوان درج کریں')}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white"
              />

              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder={t('Optional Subtitle, Year (e.g. 2026), or Monogram', 'سب ٹائٹل یا سال (اختیاری)')}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={foilStamp}
                    onChange={(e) => setFoilStamp(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    {t('Hot Gold Foil Stamping effect', 'گولڈ فوائل شائننگ خطاطی')} (+{settings.pricingRules.foilStampSurcharge} PKR)
                  </span>
                </label>

                {/* Cover color picker for mockup */}
                <div className="flex items-center gap-1">
                  {['#1b3022', '#0f172a', '#4a0404', '#faf8f5', '#1e293b'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCoverColor(c)}
                      className={`w-5 h-5 rounded-full border ${
                        coverColor === c ? 'ring-2 ring-amber-500 ring-offset-1' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('Quantity', 'تعداد')}
            </span>
            <div className="flex items-center border border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-mono tabular-nums font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-slate-500">
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : 'Custom print made-to-order'}
            </span>
          </div>

          {/* Action Buttons: Add to Cart + WhatsApp Order */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#1b3022] hover:bg-[#264430] text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('Add to Cart', 'ٹوکری میں شامل کریں')}</span>
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('Order via WhatsApp', 'واٹس ایپ پر آرڈر کریں')}</span>
            </button>
          </div>

          {/* Delivery & Production Trust Badges */}
          <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {t(
                  `Production: ${product.estimatedProductionDays} business days`,
                  `تیاری: ${product.estimatedProductionDays} کاروباری دن`
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('Nationwide Delivery via TCS / Trax', 'ٹی سی ایس و ٹریکس کے ذریعے ترسیل')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-12 border-t border-slate-200 dark:border-neutral-800 space-y-6">
        <h2 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Customer Reviews & Ratings', 'صارفین کی آراء و ریٹنگز')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Review List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{rev.customerName} ({rev.city})</span>
                  <span className="text-slate-400 font-mono">{rev.date}</span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Write a Review Form */}
          <div className="lg:col-span-5 bg-white dark:bg-[#18201b] p-6 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('Leave a Review', 'اپنی رائے دیں')}
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Asad Ali"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  City (in Pakistan)
                </label>
                <input
                  type="text"
                  required
                  value={newReviewCity}
                  onChange={(e) => setNewReviewCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setNewReviewRating(num)}
                      className={`px-2.5 py-1 text-xs rounded border ${
                        newReviewRating === num
                          ? 'bg-amber-400 text-black font-bold'
                          : 'border-slate-300 dark:border-neutral-700 text-slate-600'
                      }`}
                    >
                      {num} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Your Experience & Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Paper quality, binding durability, printing clarity..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#1b3022] text-white font-semibold text-xs rounded hover:bg-[#25422f] transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
