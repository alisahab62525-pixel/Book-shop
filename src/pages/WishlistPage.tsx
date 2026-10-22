import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ProductService } from '../services/productService.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';

export const WishlistPage: React.FC = () => {
  const { wishlist, t } = useApp();
  const allProducts = useMemo(() => ProductService.getProducts(), []);

  const wishlistProducts = useMemo(() => {
    return allProducts.filter((p) => wishlist.includes(p.id));
  }, [allProducts, wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Saved Wishlist Items', 'محفوظ کردہ پروڈکٹس')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {wishlistProducts.length} {t('notebooks and stationery saved for later', 'اشیاء آپ کی فہرست میں ہیں')}
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('Your wishlist is empty', 'آپ کی وش لسٹ خالی ہے')}
          </h2>
          <p className="text-xs text-slate-500">
            {t(
              'Save custom notebooks, executive diaries, or school copies to review them anytime.',
              'پروڈکٹس پر دل کے نشان کو دبا کر انہیں بعد میں دیکھنے کے لیے محفوظ کریں۔'
            )}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1b3022] text-white rounded-lg text-xs font-semibold"
          >
            <span>Explore Notebooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
