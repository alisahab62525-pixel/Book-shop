import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Layers, Printer, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ProductService } from '../services/productService.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { heroBannerImg, craftPressImg, sampleReviews } from '../data/initialData.ts';

export const HomePage: React.FC = () => {
  const { settings, language, t } = useApp();
  const featuredProducts = ProductService.getFeaturedProducts().slice(0, 4);
  const bestsellers = ProductService.getBestsellers().slice(0, 4);
  const categories = ProductService.getCategories().slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION - High-finish Editorial Split */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & High-intent CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1b3022] dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-[#1b3022] dark:bg-amber-400"></span>
              <span>{t('Artisanal Notebook Printing in Pakistan', 'پاکستان میں معیاری کسٹم نوٹ بک پرنٹنگ')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold text-slate-900 dark:text-[#f4edd9] leading-[1.15] text-balance">
              {t(
                'Every Thought Deserves a Notebook as Unique as You.',
                'ہر سوچ اور لفظ کے شایانِ شان، آپ کی ذاتی اور منفرد نوٹ بک۔'
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {t(
                'Custom print your name, Urdu calligraphy, company logo, or photo on premium hardcover journals, wire-bound spiral registers, and school copies. Handcrafted with bleed-proof ivory paper and shipped nationwide.',
                'اپنے نام، تصویر، یا ادارے کے لوگو کے ساتھ کسٹم ڈائریاں اور اسکول کاپیاں بنوائیں۔ دیرپا جلد، واٹر پروف کوور اور اعلیٰ درجے کے کاغذ کے ساتھ پاکستان بھر میں تیز ترسیل۔'
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/customize"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1b3022] hover:bg-[#25422f] dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300 dark:text-slate-950" />
                <span>{t('Customize Your Notebook', 'اپنی نوٹ بک کسٹمائز کریں')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-300 dark:border-neutral-700 hover:border-slate-800 dark:hover:border-amber-400 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-lg transition-colors"
              >
                {t('Explore Our Designs', 'ریڈی میڈ کلیکشن دیکھیں')}
              </Link>
            </div>

            {/* Quiet Trust Markers */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-neutral-800 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">
                  {t('No Minimum MOQ', 'ایک عدد بھی ممکن')}
                </span>
                <span>{t('Single custom copies welcome', 'سنگل پیس بھی آرڈر کریں')}</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">
                  {t('Cash on Delivery', 'کیش آن ڈلیوری')}
                </span>
                <span>{t('All Pakistan cities & towns', 'تمام اضلاع اور شہروں میں')}</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">
                  {t('Bleed-Proof Paper', 'اعلیٰ کوالٹی پیپر')}
                </span>
                <span>{t('Fountain pen friendly', 'سیاہی نہیں پھیلتی')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/40 dark:border-neutral-700 aspect-[4/3] lg:aspect-[3/4]">
              <img
                src={heroBannerImg}
                alt="Artisanal Pakistani Custom Notebooks"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                    {t('Signature Edition', 'خاص دستکاری ایڈیشن')}
                  </p>
                  <p className="text-lg font-editorial font-bold">
                    {t('Custom Foil-Stamped Urdu & English Journals', 'خالص خطاطی و نام کے ساتھ گولڈ فوائل نوٹ بکس')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW CUSTOMIZATION WORKS (3 Editorial Steps) */}
      <section className="bg-[#f2eee7] dark:bg-[#151c18] py-14 border-y border-[#e2dcd2] dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
              {t('How Custom Printing Works', 'کسٹم نوٹ بک بنانے کا آسان طریقہ')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              {t(
                'Create a bespoke personalized notebook in three simple steps — ready in 2–3 business days.',
                'صرف تین آسان مراحل میں اپنی پسندیدہ ڈائری یا کاپی تیار کروائیں۔'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#1a231e] p-6 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1b3022] text-amber-300 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('Select Format & Paper', 'سائز، صفحات اور پیپر منتخب کریں')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  'Choose A4, A5, or pocket size, page count (60–300 pages), binding (Hardcover, Spiral Wire-O, or Stitched), and ruling (Single line, Four line, or Grid).',
                  'اے فور یا اے فائیو سائز، صفحات کی تعداد، اسکول لائنز یا گرڈ، اور اسپائرل یا ہارڈ کور کا انتخاب کریں۔'
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a231e] p-6 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1b3022] text-amber-300 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('Upload Artwork or Enter Name', 'نام، تصویر یا لوگو لگائیں')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  'Upload your photo, family portrait, school crest, or business logo. Enter your name or Urdu calligraphy quote with optional gold foil stamping.',
                  'اپنی تصویر، ادارہ جاتی مونوگرام، یا نام درج کریں اور ہماری لائیو سٹوڈیو پریویو میں فوری لک دیکھیں۔'
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a231e] p-6 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1b3022] text-amber-300 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('We Print & Deliver Nationwide', 'پرنٹنگ اور پاکستان بھر میں ترسیل')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  'We precision-print, laminate, and hand-bind your notebook. Shipped with Cash on Delivery or Advance Payment via TCS / Trax across Pakistan.',
                  'ہماری ورکشاپ میں باریک بینی سے پرنٹنگ اور بائنڈنگ کے بعد محفوظ پیکنگ میں آپ کے گھر تک ڈلیوری۔'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('Handcrafted & Ready to Personalize', 'اعلیٰ اور مقبول ترین کلیکشن')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white mt-1">
              {t('Featured Notebooks', 'نمایاں نوٹ بکس و ڈائریاں')}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-[#1b3022] dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>{t('View All (PKR)', 'سب دیکھیں')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
            {t('Explore by Category', 'شعبہ جات و کیٹیگریز')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('From student exercise copies to executive board registers', 'سکول کی کاپیوں سے لے کر دفتری رجسٹرز تک')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group p-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 text-center hover:border-[#1b3022] dark:hover:border-amber-400 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#f4f0e8] dark:bg-neutral-800 text-[#1b3022] dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#1b3022] dark:group-hover:text-amber-300">
                {language === 'ur' ? cat.nameUrdu : cat.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {cat.itemCount || 6} {t('items', 'آئٹمز')}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. BULK ORDERS FOR SCHOOLS & CORPORATE (Special Focus Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1b3022] text-[#f7f5f0] rounded-2xl overflow-hidden shadow-xl border border-[#2d4d38]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="p-8 sm:p-12 lg:col-span-7 space-y-5">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                {t('Schools · Colleges · Corporate Offices', 'اسکولز · کالجز · کارپوریٹ دفاتر')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-editorial font-bold leading-tight">
                {t(
                  'Bulk Customized Notebooks & Registers for Your Institution',
                  'آپ کے تعلیمی ادارے یا کاروبار کے لیے خصوصی برانڈڈ کاپیاں اور رجسٹرز'
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[#dcd6ca] leading-relaxed">
                {t(
                  'Get your school syllabus, crest, admission rules, and inner watermarks professionally printed. We offer tiered wholesale pricing starting from 50 notebooks up to 50,000 units with fast delivery across Punjab, Sindh, KPK, and Balochistan.',
                  'اسکول مونوگرام، امتحانی ضوابط، اور مخصوص صفحات کے ساتھ کم سے کم قیمتوں پر بلک پرنٹنگ۔ نمونہ کاپی بذریعہ کورئیر حاصل کریں۔'
                )}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/bulk-orders"
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs sm:text-sm rounded-lg shadow transition-colors"
                >
                  {t('Request Bulk Quotation', 'بلک کوٹیشن حاصل کریں')}
                </Link>
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    'Hello, I am interested in bulk school/corporate notebook printing.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t('Chat with Production Manager', 'پروڈکشن مینیجر سے رابطہ')}</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 relative hidden lg:block">
              <img
                src={craftPressImg}
                alt="Stationery Print Workshop"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLING REGISTERS & PLANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('Customer Favorites', 'کسٹمرز کی پہلی پسند')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white mt-1">
              {t('Bestselling Designs & Registers', 'سب سے زیادہ پسندیدہ ڈیزائنز')}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-[#1b3022] dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>{t('View Catalog', 'کیٹلاگ دیکھیں')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS (Adjacency & Attributable Proof) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
            {t('What Pakistani Creators & Schools Say', 'ہمارے صارفین اور اسکولز کے تاثرات')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('Genuine reviews from verified stationery lovers across Pakistan', 'اسلام آباد، لاہور، اور کراچی سے تصدیق شدہ جائزے')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{rev.comment}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{rev.customerName}</span>
                  <span className="text-slate-400 block text-[11px]">{rev.city}, Pakistan</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ PREVIEW SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Frequently Asked Questions', 'اکثر پوچھے گئے سوالات')}
        </h2>
        <div className="text-left space-y-4">
          <div className="p-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
              {t('Can I print just 1 custom notebook with my own photo?', 'کیا میں صرف ایک نوٹ بک پر اپنی تصویر پرنٹ کروا سکتا ہوں؟')}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {t(
                'Yes, absolutely! We have no minimum order limit for personalized notebooks. You can order a single custom journal for yourself or as a gift.',
                'جی بالکل! ذاتی نوٹ بکس کے لیے کوئی کم از کم حد نہیں ہے۔ آپ صرف ایک عدد بھی اپنے نام اور تصویر کے ساتھ آرڈر کر سکتے ہیں۔'
              )}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
              {t('How long does custom printing and delivery take in Pakistan?', 'پرنٹنگ اور پاکستان بھر میں ڈلیوری میں کتنا وقت لگتا ہے؟')}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {t(
                'Custom printing usually takes 1 to 2 business days. Delivery via TCS, Trax, or Leopard Couriers takes 2 to 4 days depending on your city.',
                'پرنٹنگ عام طور پر 1 سے 2 دن میں مکمل ہو جاتی ہے۔ جبکہ کورئیر ڈلیوری میں 2 سے 4 دن لگتے ہیں۔'
              )}
            </p>
          </div>
        </div>
        <div>
          <Link
            to="/faq"
            className="text-xs font-semibold text-[#1b3022] dark:text-amber-400 hover:underline"
          >
            {t('View all frequently asked questions →', 'تمام سوالات و جوابات دیکھیں ←')}
          </Link>
        </div>
      </section>
    </div>
  );
};
