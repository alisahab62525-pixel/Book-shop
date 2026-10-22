import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { craftPressImg } from '../data/initialData.ts';
import { ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, t } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
          Our Heritage & Craftsmanship
        </span>
        <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-slate-900 dark:text-white">
          {settings.shopName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t(
            'Founded with a passion for preserving the tactile beauty of writing in Pakistan. We blend modern precision printing with time-honored bookbinding techniques.',
            'پاکستان میں لکھنے کے روایتی شوق اور جدید پرنٹنگ کا خوبصورت امتزاج۔ ہم معیاری کاغذ اور پائیدار جلد بندی کے ساتھ آپ کے خیالات کو محفوظ کرتے ہیں۔'
          )}
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[16/9] max-h-[420px]">
        <img
          src={craftPressImg}
          alt="Artisan bindery press"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-600 dark:text-slate-300">
        <div className="space-y-2 p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800">
          <Award className="w-6 h-6 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fountain Pen Grade Paper</h3>
          <p>
            We strictly source 80 GSM to 100 GSM acid-free ivory and offset book paper that resists feathering, ghosting, and ink bleed-through.
          </p>
        </div>

        <div className="space-y-2 p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800">
          <Sparkles className="w-6 h-6 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hot Gold Foil Stamping</h3>
          <p>
            Our workshop is equipped with dedicated foil stamping dies, rendering sharp metallic Urdu calligraphy and English monograms on book spines and covers.
          </p>
        </div>

        <div className="space-y-2 p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800">
          <ShieldCheck className="w-6 h-6 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Reliability</h3>
          <p>
            Trusted by schools, academies, colleges, and corporations across Lahore, Karachi, Islamabad, Peshawar, and Quetta.
          </p>
        </div>
      </div>
    </div>
  );
};
