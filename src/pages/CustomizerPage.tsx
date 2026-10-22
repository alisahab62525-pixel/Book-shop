import React, { useState, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  RefreshCw,
  Eye,
  Trash2,
  ZoomIn,
  Move,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ProductService } from '../services/productService.ts';
import { PricingService } from '../services/pricingService.ts';
import { IndexedDBImageUtil } from '../utils/storage.ts';
import {
  NotebookSize,
  PageCount,
  RulingType,
  BindingType,
  PaperType,
  CoverFinish,
  NotebookCustomizationSelection,
  CartItem,
} from '../types/index.ts';
import { NotebookCoverPreview } from '../components/notebook/NotebookCoverPreview.tsx';
import {
  sidhu295Img,
  sidhuLastRideImg,
  cheemaYNotebookImg,
  cheemaYRegisterImg,
} from '../data/initialData.ts';

export const CustomizerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings, addToCart, showToast, t, language } = useApp();

  const initialProductId = searchParams.get('product');
  const initialProduct = initialProductId ? ProductService.getProductById(initialProductId) : undefined;

  // Customization studio state
  const [size, setSize] = useState<NotebookSize>(initialProduct?.availableSizes[0] || 'A5');
  const [pageCount, setPageCount] = useState<PageCount>(initialProduct?.availablePageCounts[0] || 160);
  const [ruling, setRuling] = useState<RulingType>(initialProduct?.availableRulings[0] || 'Urdu / Right Margin');
  const [binding, setBinding] = useState<BindingType>(initialProduct?.availableBindings[0] || 'Hardcover Bound');
  const [paperType, setPaperType] = useState<PaperType>(initialProduct?.availablePaper[0] || '80 GSM Ivory Book Paper');
  const [coverFinish, setCoverFinish] = useState<CoverFinish>(initialProduct?.availableFinishes[0] || 'Velvet Matte Lamination');
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [coverColor, setCoverColor] = useState('#1b3022'); // Deep forest green default
  const [accentColor, setAccentColor] = useState('#d4af37'); // Gold accent
  const [fontStyle, setFontStyle] = useState<'classic' | 'modern' | 'urdu' | 'script'>('urdu');
  const [foilStampText, setFoilStampText] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeView, setActiveView] = useState<'front' | 'back' | 'inside'>('front');

  // Image Upload state
  const [uploadedImageId, setUploadedImageId] = useState<string | undefined>(undefined);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(undefined);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosX, setImagePosX] = useState(0);
  const [imagePosY, setImagePosY] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const basePrice = initialProduct ? initialProduct.basePrice : 650;

  const currentSelection: NotebookCustomizationSelection = useMemo(
    () => ({
      size,
      pageCount,
      ruling,
      binding,
      paperType,
      coverFinish,
      customTitle,
      customSubtitle,
      coverColor,
      accentColor,
      fontStyle,
      alignment: 'center',
      uploadedImageId,
      uploadedImageUrl,
      imageScale,
      imagePositionX: imagePosX,
      imagePositionY: imagePosY,
      foilStampText,
    }),
    [
      size,
      pageCount,
      ruling,
      binding,
      paperType,
      coverFinish,
      customTitle,
      customSubtitle,
      coverColor,
      accentColor,
      fontStyle,
      uploadedImageId,
      uploadedImageUrl,
      imageScale,
      imagePosX,
      imagePosY,
      foilStampText,
    ]
  );

  const priceCalc = PricingService.calculateCustomNotebookPrice(
    basePrice,
    currentSelection,
    quantity,
    settings
  );

  // Handle Image Upload with type and size validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please upload JPG, PNG, or WebP.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setUploadLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const imageId = `art-${Date.now()}`;
      await IndexedDBImageUtil.saveImage(imageId, dataUrl);
      setUploadedImageId(imageId);
      setUploadedImageUrl(dataUrl);
      setUploadLoading(false);
      showToast(t('Artwork uploaded successfully', 'تصویر کامیابی سے اپ لوڈ ہو گئی'), 'success');
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (uploadedImageId) {
      IndexedDBImageUtil.deleteImage(uploadedImageId);
    }
    setUploadedImageId(undefined);
    setUploadedImageUrl(undefined);
    setImageScale(1);
    setImagePosX(0);
    setImagePosY(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast(t('Custom artwork removed', 'تصویر ہٹا دی گئی'), 'info');
  };

  const handleReset = () => {
    setCustomTitle('');
    setCustomSubtitle('');
    setCoverColor('#1b3022');
    setFoilStampText(true);
    handleRemoveImage();
    setSize('A5');
    setPageCount(160);
    setRuling('Urdu / Right Margin');
    setBinding('Hardcover Bound');
    setPaperType('80 GSM Ivory Book Paper');
    setCoverFinish('Velvet Matte Lamination');
    setQuantity(1);
    showToast(t('Customizer reset to defaults', 'کسٹمائزر ری سیٹ ہو گیا'), 'info');
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `custom-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: initialProduct ? initialProduct.id : 'custom-bespoke-notebook',
      productName: initialProduct
        ? `Custom ${initialProduct.name}`
        : `Custom ${size} ${binding} Notebook (${customTitle || 'Personalized'})`,
      productSku: initialProduct ? initialProduct.sku : `CUS-${size}-${Date.now().toString().slice(-4)}`,
      unitPrice: priceCalc.unitPrice,
      quantity,
      coverImageThumbnail: uploadedImageUrl || initialProduct?.coverImage || '',
      isCustomized: true,
      customization: currentSelection,
      snapshotPriceBreakdown: {
        basePrice: priceCalc.basePrice,
        optionsSurcharge: priceCalc.optionsSurcharge,
        customPrintingFee: priceCalc.customPrintingFee,
        unitTotal: priceCalc.unitPrice,
      },
    };

    addToCart(cartItem);
    navigate('/cart');
  };

  const handleWhatsAppInquiry = () => {
    const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const lines = [
      `*Custom Notebook Order / Design Review*`,
      `*Size:* ${size}`,
      `*Page Count:* ${pageCount}`,
      `*Ruling:* ${ruling}`,
      `*Binding:* ${binding}`,
      `*Paper Type:* ${paperType}`,
      `*Cover Finish:* ${coverFinish}`,
      `*Title on Cover:* ${customTitle || 'None specified'}`,
      `*Subtitle:* ${customSubtitle || 'None'}`,
      `*Cover Color:* ${coverColor}`,
      `*Foil Stamping:* ${foilStampText ? 'Yes (Gold Foil)' : 'Standard Print'}`,
      uploadedImageUrl ? `*Custom Artwork Attached:* Customer uploaded artwork mockup in studio` : '*Artwork:* Text only',
      `*Quantity:* ${quantity} notebooks`,
      `*Calculated Estimated Total:* Rs. ${priceCalc.finalProductTotal}`,
      `Hello ${settings.shopName}, I configured this notebook in your online studio. Please verify print feasibility and delivery time!`,
    ];

    const message = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Workflow A: Instant Browser Customization</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-editorial font-bold text-slate-900 dark:text-white">
            {t('Notebook Customization Studio', 'آن لائن نوٹ بک ڈیزائن اسٹوڈیو')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t(
              'Personalize your notebook cover, choose binding, paper, and ruling, and preview live.',
              'اپنی پسند کا کور، نام، اور صفحات منتخب کریں اور لائیو 3D پریویو دیکھیں۔'
            )}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('Reset Customizer', 'ری سیٹ کریں')}</span>
        </button>
      </div>

      {/* Main Studio Split: Left Sticky Preview + Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Live Visualizer */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          {/* View switcher buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveView('front')}
              className={`flex-1 py-1.5 rounded transition-all ${
                activeView === 'front'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('Front Cover', 'سامنے کا کور')}
            </button>
            <button
              onClick={() => setActiveView('inside')}
              className={`flex-1 py-1.5 rounded transition-all ${
                activeView === 'inside'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('Inside Ruling Page', 'اندرونی صفحات')}
            </button>
            <button
              onClick={() => setActiveView('back')}
              className={`flex-1 py-1.5 rounded transition-all ${
                activeView === 'back'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('Back Cover', 'پچھلا کور')}
            </button>
          </div>

          {/* Interactive Preview Canvas Box */}
          <div className="bg-[#f0ece3] dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-2xl min-h-[460px] flex items-center justify-center p-4 relative overflow-hidden">
            <NotebookCoverPreview customization={currentSelection} activeView={activeView} />
          </div>

          {/* Live Price Calculation Summary Box */}
          <div className="p-4 bg-white dark:bg-[#18201b] border border-slate-200 dark:border-neutral-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
              <span>{t('Estimated Total', 'کل متوقع رقم')}</span>
              <span className="font-mono tabular-nums text-lg text-[#1b3022] dark:text-amber-400">
                Rs. {priceCalc.finalProductTotal}
              </span>
            </div>
            <div className="text-slate-500 space-y-1 text-[11px] pt-1 border-t border-slate-100 dark:border-neutral-800">
              <div className="flex justify-between">
                <span>Base Notebook ({size}, {pageCount}p):</span>
                <span className="font-mono">Rs. {priceCalc.basePrice + priceCalc.optionsSurcharge}</span>
              </div>
              {priceCalc.customPrintingFee > 0 && (
                <div className="flex justify-between text-amber-700 dark:text-amber-400 font-medium">
                  <span>Custom Design & Printing Setup:</span>
                  <span className="font-mono">+Rs. {priceCalc.customPrintingFee}</span>
                </div>
              )}
              {priceCalc.bulkDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Bulk Discount ({priceCalc.bulkDiscountPercent}%):</span>
                  <span className="font-mono">-Rs. {priceCalc.bulkDiscountAmount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quick Artist & Gataa Presets */}
          <div className="p-5 bg-gradient-to-br from-amber-500/10 via-slate-50 to-emerald-500/10 dark:from-amber-950/20 dark:via-neutral-900 dark:to-emerald-950/20 rounded-xl border border-amber-300 dark:border-amber-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Sidhu Moose Wala & Cheema Y Cover Gataa Themes</span>
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded font-semibold">
                Trending
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {t(
                'Select a pre-designed front & back cover gataa theme with song titles, tracklists and thumbnails, or customize your own:',
                'سدھو موسے والا یا چیمہ وائی کے گانوں کے ٹائٹل اور بیک ٹریک لسٹ والا تھیم چنیں یا ذاتی ڈیزائن بنائیں:'
              )}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCustomTitle('295 - SIDHU MOOSE WALA');
                  setCustomSubtitle('Official Signature Gataa Edition');
                  setCoverColor('#121212');
                  setAccentColor('#e5c05d');
                  setUploadedImageUrl(sidhu295Img);
                  setUploadedImageId('preset-sidhu-295');
                  setFoilStampText(true);
                  setFontStyle('modern');
                  showToast('Loaded Sidhu Moose Wala 295 Edition Theme!', 'success');
                }}
                className="p-2.5 bg-white dark:bg-neutral-800 border hover:border-amber-500 rounded-lg text-left transition-all shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <img src={sidhu295Img} alt="295" className="w-8 h-10 object-cover rounded shadow-xs" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                      Sidhu 295
                    </div>
                    <div className="text-[10px] text-slate-500">Tracklist on Back Gataa</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomTitle('THE LAST RIDE - SIDHU');
                  setCustomSubtitle('Moosetape Hardbound Register');
                  setCoverColor('#0d1117');
                  setAccentColor('#d4af37');
                  setUploadedImageUrl(sidhuLastRideImg);
                  setUploadedImageId('preset-sidhu-last-ride');
                  setFoilStampText(true);
                  setFontStyle('classic');
                  showToast('Loaded The Last Ride Edition Theme!', 'success');
                }}
                className="p-2.5 bg-white dark:bg-neutral-800 border hover:border-amber-500 rounded-lg text-left transition-all shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <img src={sidhuLastRideImg} alt="Last Ride" className="w-8 h-10 object-cover rounded shadow-xs" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                      The Last Ride
                    </div>
                    <div className="text-[10px] text-slate-500">Hardbound Gold Foil</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomTitle('CALIFORNIA LOVE - CHEEMA Y');
                  setCustomSubtitle('Urban Rap Spiral Register');
                  setCoverColor('#1a1512');
                  setAccentColor('#e0a96d');
                  setUploadedImageUrl(cheemaYNotebookImg);
                  setUploadedImageId('preset-cheema-california');
                  setFoilStampText(false);
                  setFontStyle('modern');
                  showToast('Loaded Cheema Y California Love Theme!', 'success');
                }}
                className="p-2.5 bg-white dark:bg-neutral-800 border hover:border-amber-500 rounded-lg text-left transition-all shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <img src={cheemaYNotebookImg} alt="Cheema Y" className="w-8 h-10 object-cover rounded shadow-xs" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                      Cheema Y California
                    </div>
                    <div className="text-[10px] text-slate-500">Street Style Spiral</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomTitle('DAKU - CHEEMA Y');
                  setCustomSubtitle('Executive Hardcover Register');
                  setCoverColor('#14181f');
                  setAccentColor('#f3c68f');
                  setUploadedImageUrl(cheemaYRegisterImg);
                  setUploadedImageId('preset-cheema-register');
                  setFoilStampText(true);
                  setFontStyle('modern');
                  showToast('Loaded Cheema Y Daku Theme!', 'success');
                }}
                className="p-2.5 bg-white dark:bg-neutral-800 border hover:border-amber-500 rounded-lg text-left transition-all shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <img src={cheemaYRegisterImg} alt="Cheema Y Register" className="w-8 h-10 object-cover rounded shadow-xs" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                      Cheema Y Daku
                    </div>
                    <div className="text-[10px] text-slate-500">Back Tracklist Gataa</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 1: Typography & Text Content */}
          <div className="p-5 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. Cover Title, Urdu Calligraphy & Subtitle</span>
            </h2>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Custom Name, Urdu Calligraphy or Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. داستانِ حیات or Muhammad Ali or Executive Notes"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Optional Subtitle, Quote, or Year (2026)
              </label>
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder="e.g. Est. 2026 · Daily Reflections"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Font Style Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Typography Font Family
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'urdu', label: 'اردو خطاطی', preview: 'urdu' },
                  { id: 'classic', label: 'Luxury Serif', preview: 'serif' },
                  { id: 'modern', label: 'Clean Modern', preview: 'sans' },
                  { id: 'script', label: 'Artisan Script', preview: 'script' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontStyle(f.id as any)}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-colors ${
                      fontStyle === f.id
                        ? 'border-[#1b3022] bg-[#1b3022] text-white dark:border-amber-400 dark:bg-amber-400 dark:text-black font-semibold'
                        : 'border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gold Foil Effect Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={foilStampText}
                  onChange={(e) => setFoilStampText(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {t('Hot Gold Foil Stamping on Cover Title', 'گولڈ فوائل شائننگ خطاطی ایفیکٹ')}
                </span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                +{settings.pricingRules.foilStampSurcharge} PKR
              </span>
            </div>
          </div>

          {/* Section 2: Upload Artwork / Logo */}
          <div className="p-5 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>2. Upload Cover Image, Crest or Logo</span>
              </h2>
              {uploadedImageUrl && (
                <button
                  onClick={handleRemoveImage}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Upload your photo, family portrait, school monogram, or business logo (JPG, PNG, WebP · Max 5MB).
            </p>

            {uploadError && (
              <p className="text-xs text-rose-600 font-medium">{uploadError}</p>
            )}

            {!uploadedImageUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-neutral-700 rounded-xl p-6 text-center cursor-pointer hover:border-[#1b3022] dark:hover:border-amber-400 transition-colors bg-slate-50/50 dark:bg-neutral-900/50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  {uploadLoading ? 'Processing Image...' : 'Click to Browse & Upload Artwork'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Saved securely on your device via IndexedDB
                </span>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-4">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded Artwork"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-300 dark:border-neutral-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Artwork Loaded on Mockup
                    </span>
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> High resolution verified
                    </span>
                  </div>
                </div>

                {/* Scaling & Positioning Sliders */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" /> Scale Size ({Math.round(imageScale * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.4"
                      max="1.6"
                      step="0.05"
                      value={imageScale}
                      onChange={(e) => setImageScale(parseFloat(e.target.value))}
                      className="w-full accent-[#1b3022] dark:accent-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 flex items-center gap-1">
                      <Move className="w-3 h-3" /> Vertical Position
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="5"
                      value={imagePosY}
                      onChange={(e) => setImagePosY(parseInt(e.target.value))}
                      className="w-full accent-[#1b3022] dark:accent-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Color Theme */}
          <div className="p-5 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              3. Cover Color Tone
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {[
                { name: 'Forest Green', code: '#1b3022' },
                { name: 'Navy Blue', code: '#0f172a' },
                { name: 'Vintage Maroon', code: '#4a0404' },
                { name: 'Ivory Cream', code: '#faf7f0' },
                { name: 'Charcoal Black', code: '#18181b' },
                { name: 'Terracotta Rust', code: '#883b23' },
                { name: 'Royal Plum', code: '#2e1065' },
              ].map((clr) => (
                <button
                  key={clr.code}
                  onClick={() => setCoverColor(clr.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    coverColor === clr.code
                      ? 'ring-2 ring-amber-500 ring-offset-2 border-transparent font-bold'
                      : 'border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: clr.code }}
                  />
                  <span>{clr.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Specifications (Size, Pages, Ruling, Binding, Finish) */}
          <div className="p-5 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              4. Physical Specifications
            </h2>

            {/* Size */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Notebook Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['A4', 'A5', 'A6', 'B5'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-1.5 text-xs rounded border font-semibold ${
                      size === s
                        ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black border-transparent'
                        : 'border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Count */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Page Count
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([60, 100, 160, 200] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPageCount(p)}
                    className={`py-1.5 text-xs rounded border font-semibold ${
                      pageCount === p
                        ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black border-transparent'
                        : 'border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p} Pages
                  </button>
                ))}
              </div>
            </div>

            {/* Inner Ruling */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Inner Page Ruling Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Urdu / Right Margin',
                  'Single Line',
                  'Four Line',
                  'Grid / Math',
                  'Dotted',
                  'Plain / Blank',
                  'Accounting / Ledger',
                ].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRuling(r as any);
                      setActiveView('inside');
                    }}
                    className={`py-1.5 px-2 text-xs rounded border text-left ${
                      ruling === r
                        ? 'border-[#1b3022] bg-slate-100 dark:bg-neutral-800 font-bold text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Binding Type */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Binding Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Hardcover Bound',
                  'Spiral Wire-O',
                  'Stitched & Taped Spine',
                  'Leatherette Executive',
                ].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBinding(b as any)}
                    className={`py-1.5 px-2 text-xs rounded border text-left ${
                      binding === b
                        ? 'border-[#1b3022] bg-slate-100 dark:bg-neutral-800 font-bold text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Finish */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Cover Lamination & Finish
              </label>
              <select
                value={coverFinish}
                onChange={(e) => setCoverFinish(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Velvet Matte Lamination">Velvet Matte Lamination (Soft touch)</option>
                <option value="High Gloss Lamination">High Gloss Lamination (Vibrant sheen)</option>
                <option value="Gold Foil Stamping">Gold Foil Stamping (Hot metallic sheen)</option>
                <option value="Embossed Leather Texture">Embossed Leather Texture</option>
                <option value="Natural Kraft Card">Natural Kraft Card</option>
              </select>
            </div>
          </div>

          {/* Section 5: Quantity & Final Actions */}
          <div className="p-5 bg-[#faf8f5] dark:bg-[#141b17] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white block">
                  Order Quantity
                </label>
                <span className="text-[11px] text-slate-500">
                  Bulk discounts available for 10+ notebooks
                </span>
              </div>
              <div className="flex items-center border border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-mono font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('Add Custom Design to Cart', 'کارٹ میں شامل کریں')}</span>
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="flex-1 py-3 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('Send to WhatsApp', 'واٹس ایپ پر بھیجیں')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
