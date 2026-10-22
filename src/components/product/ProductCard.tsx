import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist, language, t } = useApp();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#18201b] rounded-xl border border-[#e8e2d7] dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Visual Slot: Clean Neutral Surface */}
      <div className="relative aspect-[4/3] w-full bg-[#f4f0e8] dark:bg-neutral-800/80 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.coverImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 shadow'
              : 'bg-white/80 dark:bg-neutral-900/80 text-slate-700 dark:text-slate-200 hover:text-rose-600'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Single subtle tag: No badge spam */}
        {product.isCustomizable && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded text-[11px] font-medium text-[#1b3022] dark:text-amber-300 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t('Customizable', 'کسٹمائزیشن دستیاب')}</span>
          </div>
        )}
      </div>

      {/* Card Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Quiet Unboxed Metadata (Zero-pill discipline) */}
          <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
            <span>{product.categoryName}</span>
            {product.isBestseller && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  {t('Bestseller', 'سب سے زیادہ فروخت')}
                </span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1b3022] dark:group-hover:text-amber-300 transition-colors">
            <Link to={`/product/${product.slug}`}>
              {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
            </Link>
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              Rs. {product.discountedPrice || product.basePrice}
            </span>
            {product.discountedPrice && (
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                Rs. {product.basePrice}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-100 hover:bg-[#1b3022] hover:text-white dark:bg-neutral-800 dark:hover:bg-amber-500 dark:hover:text-black transition-colors"
          >
            {product.isCustomizable ? t('Customize', 'ترتیب دیں') : t('View', 'دیکھیں')}
          </Link>
        </div>
      </div>
    </div>
  );
};
