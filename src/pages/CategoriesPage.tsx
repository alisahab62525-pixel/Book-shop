import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { ProductService } from '../services/productService.ts';
import { BookOpen, ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { t, language } = useApp();
  const categories = ProductService.getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Product Categories', 'تمام کیٹیگریز و شعبہ جات')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t(
            'Explore our full range of student exercise books, heavy-duty registers, aesthetic spiral journals, and personalized gifts.',
            'اسکول کی کاپیوں، کھاتہ رجسٹرز، ڈائریوں اور کسٹمائزڈ پرنٹنگ کی مکمل فہرست۔'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 flex flex-col justify-between hover:border-[#1b3022] dark:hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#f4f0e8] dark:bg-neutral-800 text-[#1b3022] dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'ur' ? cat.nameUrdu : cat.name}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-neutral-800 mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {cat.itemCount || 5} {t('models available', 'ماڈلز دستیاب')}
              </span>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="text-xs font-semibold text-[#1b3022] dark:text-amber-400 flex items-center gap-1 group-hover:underline"
              >
                <span>{t('Browse', 'دیکھیں')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
