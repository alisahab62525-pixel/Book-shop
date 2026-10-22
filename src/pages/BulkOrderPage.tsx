import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, ShieldCheck, Award, Building, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { CustomDesignService } from '../services/customDesignService.ts';
import { craftPressImg } from '../data/initialData.ts';

export const BulkOrderPage: React.FC = () => {
  const { settings, showToast, t } = useApp();

  const [institutionName, setInstitutionName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [categoryType, setCategoryType] = useState('School Student Exercise Copies');
  const [estimatedQuantity, setEstimatedQuantity] = useState(250);
  const [requestSampleKit, setRequestSampleKit] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim() || !contactName.trim() || !phone.trim() || !city.trim()) {
      showToast('Please fill all required institution details', 'error');
      return;
    }

    CustomDesignService.submitRequest({
      customerName: contactName.trim(),
      customerPhone: phone.trim(),
      city: city.trim(),
      organizationName: institutionName.trim(),
      notebookType: `[BULK ORDER] ${categoryType}`,
      size: 'A5',
      pageCount: 100,
      ruling: 'Single Line',
      binding: 'Softcover Saddle-Stitch',
      paperType: '70 GSM Premium Offset',
      coverFinish: 'Velvet Matte Lamination',
      estimatedQuantity,
      designBrief: `BULK ORDER INQUIRY: ${notes}. Sample kit requested: ${requestSampleKit ? 'YES' : 'NO'}`,
      referenceImages: [],
    });

    setIsSubmitted(true);
    showToast(t('Bulk order inquiry submitted successfully!', 'بلک آرڈر کی درخواست موصول ہو گئی!'), 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="bg-[#1b3022] text-[#f4edd9] rounded-2xl p-8 sm:p-12 border border-[#2d4d38] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
            <Building className="w-4 h-4" />
            <span>Wholesale & Institutional Printing Division</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-editorial font-bold leading-tight">
            {t(
              'Custom Branded Notebooks & Copies for Schools & Offices',
              'اسکولز، کالجز اور اداروں کے لیے مخصوص برانڈڈ کاپیاں اور ڈائریاں'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#d4cdbf] leading-relaxed max-w-xl">
            {t(
              'Equip your students and employees with premium stationery featuring your official school crest, vision statement, academic calendar, and custom watermark rulings. Direct factory pricing throughout Pakistan.',
              'اپنے ادارے کے مونوگرام، ضوابط، اور مخصوص رنگوں کے ساتھ فیکٹری ریٹ پر کاپیاں اور رجسٹرز تیار کروائیں۔ پنجاب، سندھ، خیبرپختونخوا، اور بلوچستان بھر میں ترسیل۔'
            )}
          </p>
        </div>
        <div className="lg:col-span-5 rounded-xl overflow-hidden shadow-lg border border-white/20 aspect-video lg:aspect-[4/3]">
          <img
            src={craftPressImg}
            alt="Print workshop"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Tiered Bulk Pricing Table */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
            {t('Tiered Volume Pricing Structure', 'بلک آرڈرز پر خصوصی رعایت')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('Substantial volume discounts automatically applied for educational institutions and corporations', 'زیادہ تعداد پر کم ترین فی کاپی قیمت')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {settings.pricingRules.bulkDiscounts.map((tier) => (
            <div
              key={tier.minQty}
              className="p-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 text-center space-y-2 shadow-xs"
            >
              <span className="text-xs font-semibold text-slate-500 uppercase block">
                Order Quantity
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white block">
                {tier.minQty}+ Units
              </span>
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                Save {tier.discountPercent}% Off
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#18201b] p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-neutral-800 space-y-6 shadow-sm">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
              Institutional Inquiry Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Our institutional sales representative will contact you within 24 hours with a comprehensive quotation and sample paper kit options.
            </p>
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello, I submitted an institutional bulk order inquiry for ${institutionName} (${estimatedQuantity} units).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-xs font-semibold rounded-lg"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b pb-2">
              Request School or Corporate Quotation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">School / Company Name *</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Lahore Grammar School"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Principal / Procurement Head"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Official Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">City / Campus Location *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Islamabad, Multan..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Product Category</label>
                <select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg"
                >
                  <option>School Student Exercise Copies</option>
                  <option>University Spiral Notebooks</option>
                  <option>Office Hardbound Registers</option>
                  <option>Executive Annual Leather Planners</option>
                  <option>Exam Answer Sheets & Practice Pads</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Estimated Quantity (Units) *</label>
                <input
                  type="number"
                  min={25}
                  required
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(parseInt(e.target.value) || 25)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-xs">
                Additional Specifications & Ruling Requirements
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any custom inner page watermarks, syllabus print, or campus branches..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={requestSampleKit}
                  onChange={(e) => setRequestSampleKit(e.target.checked)}
                  className="rounded text-[#1b3022]"
                />
                <span className="font-medium">
                  {t('Send physical sample copy kit to our campus address', 'ہمارے اسکول ایڈریس پر نمونہ کاپی بھیجی جائے')}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
            >
              {t('Submit Bulk Quotation Request', 'بلک کوٹیشن کی درخواست جمع کروائیں')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
