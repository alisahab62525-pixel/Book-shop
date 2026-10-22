import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ProductService } from '../services/productService.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';

export const ReadyMadeDesignsPage: React.FC = () => {
  const { t } = useApp();
  const products = ProductService.getProducts().filter((p) => p.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
          Curated Signature Covers
        </span>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Ready-Made Notebook Cover Designs', 'ریڈی میڈ کور ڈیزائنز گیلری')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t(
            'Explore our exclusive in-house artist designs. You can order them as-is or add your own name and year with one click.',
            'ہمارے آرٹسٹوں کے خصوصی ڈیزائنز۔ آپ انہیں من و عن بھی آرڈر کر سکتے ہیں یا اپنا نام شامل کر سکتے ہیں۔'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
