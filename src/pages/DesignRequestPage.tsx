import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, CheckCircle2, FileText, ArrowRight, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { CustomDesignService } from '../services/customDesignService.ts';
import { IndexedDBImageUtil } from '../utils/storage.ts';
import {
  NotebookSize,
  PageCount,
  RulingType,
  BindingType,
  PaperType,
  CoverFinish,
  CustomDesignRequest,
} from '../types/index.ts';

export const DesignRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, showToast, t, language } = useApp();

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [notebookType, setNotebookType] = useState('Custom Personalized Hardcover Notebook');
  const [size, setSize] = useState<NotebookSize>('A5');
  const [pageCount, setPageCount] = useState<PageCount>(160);
  const [ruling, setRuling] = useState<RulingType>('Single Line');
  const [binding, setBinding] = useState<BindingType>('Hardcover Bound');
  const [paperType, setPaperType] = useState<PaperType>('80 GSM Ivory Book Paper');
  const [coverFinish, setCoverFinish] = useState<CoverFinish>('Velvet Matte Lamination');
  const [estimatedQuantity, setEstimatedQuantity] = useState(1);
  const [designBrief, setDesignBrief] = useState('');

  // Uploaded references
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<CustomDesignRequest | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadLoading(true);

    Array.from(files).forEach((file) => {
      if (file.size > 6 * 1024 * 1024) {
        showToast('Image exceeds 6MB limit', 'error');
        setUploadLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const imgId = `req-img-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
        await IndexedDBImageUtil.saveImage(imgId, dataUrl);
        setUploadedImages((prev) => [...prev, dataUrl]);
        setUploadLoading(false);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !city.trim() || !designBrief.trim()) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const req = CustomDesignService.submitRequest({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      city: city.trim(),
      organizationName: organizationName.trim() || undefined,
      notebookType,
      size,
      pageCount,
      ruling,
      binding,
      paperType,
      coverFinish,
      estimatedQuantity,
      designBrief: designBrief.trim(),
      referenceImages: uploadedImages,
    });

    setSubmittedRequest(req);
    showToast(t('Custom design request submitted!', 'ڈیزائن کی درخواست موصول ہو گئی!'), 'success');
  };

  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Request ID: {submittedRequest.requestId}
          </span>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
            {t('Custom Design Request Received!', 'آپ کی کسٹم ڈیزائن درخواست موصول ہو گئی')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {t(
              'Our printing master and graphic designer will review your artwork brief and generate a formal price quotation and production timeline.',
              'ہماری ٹیم آپ کے ڈیزائن کے نمونے کا جائزہ لے کر جلد کوٹیشن اور فائنل لک تیار کرے گی۔'
            )}
          </p>
        </div>

        {/* Request Summary Box */}
        <div className="bg-white dark:bg-[#18201b] p-6 rounded-xl border border-slate-200 dark:border-neutral-800 text-left text-xs space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Customer:</span>
            <span className="font-semibold">{submittedRequest.customerName} ({submittedRequest.city})</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Contact Phone:</span>
            <span className="font-mono">{submittedRequest.customerPhone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Specifications:</span>
            <span>{submittedRequest.size} · {submittedRequest.pageCount}p · {submittedRequest.binding}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Quantity Requested:</span>
            <span className="font-mono font-bold">{submittedRequest.estimatedQuantity} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="text-amber-600 font-semibold">{submittedRequest.status}</span>
          </div>
        </div>

        {/* WhatsApp Notification CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hello ${settings.shopName}, I submitted a custom design request with ID: ${submittedRequest.requestId}. Please review my artwork brief.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t('Notify Production via WhatsApp', 'واٹس ایپ پر مطلع کریں')}</span>
          </a>

          <Link
            to="/shop"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center"
          >
            {t('Continue Browsing', 'مزید پروڈکٹس دیکھیں')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
          Workflow B: Artisanal Custom Order Request
        </span>
        <h1 className="text-2xl sm:text-4xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Create My Custom Design Request', 'خصوصی کسٹم ڈیزائن کی فرمائش')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t(
            'Upload your logo, hand-drawn sketch, or reference photo. Our designers will prepare a custom mock-up and send you an official quotation.',
            'اپنا لوگو، خاکہ یا حوالہ تصویر بھیجیں۔ ہم نمونہ تیار کر کے مکمل تخمینہ فراہم کریں گے۔'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#18201b] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-neutral-800 space-y-6 shadow-sm">
        {/* Customer Information Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white border-b pb-2">
            1. Your Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Bilal Ahmed"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp / Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0300 1234567"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City in Pakistan *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore, Karachi, Islamabad..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                School, College, or Company Name (Optional)
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Beaconhouse, Punjab College, Tech Corp"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Notebook Specifications */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-neutral-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white border-b pb-2">
            2. Desired Notebook Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Size Format
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
              >
                <option value="A4">A4 (Standard Big Copy / 8.3 x 11.7 in)</option>
                <option value="A5">A5 (Standard Journal / 5.8 x 8.3 in)</option>
                <option value="A6">A6 (Pocket Diary / 4.1 x 5.8 in)</option>
                <option value="B5">B5 (Medium Executive / 6.9 x 9.8 in)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Page Count
              </label>
              <select
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value) as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
              >
                <option value={60}>60 Pages</option>
                <option value={100}>100 Pages</option>
                <option value={160}>160 Pages</option>
                <option value={200}>200 Pages</option>
                <option value={300}>300 Pages (Ledger Size)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Quantity
              </label>
              <input
                type="number"
                min={1}
                required
                value={estimatedQuantity}
                onChange={(e) => setEstimatedQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Inner Ruling
              </label>
              <select
                value={ruling}
                onChange={(e) => setRuling(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
              >
                <option value="Urdu / Right Margin">Urdu / Right Margin</option>
                <option value="Single Line">English Single Line</option>
                <option value="Four Line">Four Line (Handwriting)</option>
                <option value="Grid / Math">Math Square Grid</option>
                <option value="Dotted">Bullet Journal Dotted</option>
                <option value="Accounting / Ledger">Accounting / Ledger Lines</option>
                <option value="Plain / Blank">Plain Blank</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Binding Style
              </label>
              <select
                value={binding}
                onChange={(e) => setBinding(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
              >
                <option value="Hardcover Bound">Hardcover Bound (Rigid Board)</option>
                <option value="Spiral Wire-O">Twin-Loop Spiral Wire-O</option>
                <option value="Stitched & Taped Spine">Heavy Duty Stitched Spine</option>
                <option value="Leatherette Executive">Executive Vegan Leatherette</option>
                <option value="Softcover Saddle-Stitch">Softcover Saddle-Stitch</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cover Finish
              </label>
              <select
                value={coverFinish}
                onChange={(e) => setCoverFinish(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
              >
                <option value="Velvet Matte Lamination">Velvet Matte Lamination</option>
                <option value="High Gloss Lamination">High Gloss Lamination</option>
                <option value="Gold Foil Stamping">Gold Foil Stamping</option>
                <option value="Embossed Leather Texture">Embossed Leather Texture</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Reference Images */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-neutral-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white border-b pb-2">
            3. Upload Reference Artwork or Sketches
          </h2>

          <div className="flex flex-wrap gap-3 items-center">
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg border overflow-hidden">
                <img src={img} alt={`Ref ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}

            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:border-slate-800 text-slate-400">
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Add Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Design Brief / Requirements */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-neutral-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white block">
            4. Explain Your Design Requirements *
          </label>
          <textarea
            required
            rows={4}
            value={designBrief}
            onChange={(e) => setDesignBrief(e.target.value)}
            placeholder="Describe the colors, text, logo placement, quotes, or theme you want on the cover. (e.g. Dark green cover with gold foil Urdu calligraphy of Iqbal's couplet and school logo on bottom-left)..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={uploadLoading}
          className="w-full py-3.5 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>{t('Submit Custom Design Request', 'ڈیزائن کی درخواست جمع کروائیں')}</span>
        </button>
      </form>
    </div>
  );
};
