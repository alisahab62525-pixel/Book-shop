import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Truck,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';
import { Coupon } from '../types/index.ts';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartSubtotal, settings, showToast, t } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercentage) {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountPercentage) / 100);
    } else if (appliedCoupon.fixedDiscount) {
      discountAmount = Math.min(cartSubtotal, appliedCoupon.fixedDiscount);
    }
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);

    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const coupons = LocalStorageUtil.get<Coupon[]>(StorageKeys.COUPONS, []);
    const match = coupons.find((c) => c.code.toUpperCase() === code && c.isActive);

    if (!match) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }

    if (cartSubtotal < match.minOrderValue) {
      setCouponError(`This code requires minimum order value of Rs. ${match.minOrderValue}.`);
      return;
    }

    setAppliedCoupon(match);
    showToast(`Coupon ${match.code} applied!`, 'success');
  };

  const handleWhatsAppCartOrder = () => {
    const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const itemLines = cart.map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}* × ${item.quantity} = Rs. ${item.unitPrice * item.quantity}${
          item.isCustomized && item.customization
            ? `\n   (Format: ${item.customization.size}, ${item.customization.pageCount}p, ${item.customization.ruling}, Title: "${item.customization.customTitle}")`
            : ''
        }`
    );

    const message = encodeURIComponent(
      `*Order Inquiry via Beyond Notebooks Website*\n\n` +
        `*Items in Cart:*\n${itemLines.join('\n')}\n\n` +
        `*Cart Subtotal:* Rs. ${cartSubtotal}\n` +
        (discountAmount > 0 ? `*Discount Applied:* -Rs. ${discountAmount}\n` : '') +
        `*Total Expected:* Rs. ${cartSubtotal - discountAmount}\n\n` +
        `Please confirm available stock and delivery details!`
    );

    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-400 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Your Shopping Cart is Empty', 'آپ کی ٹوکری خالی ہے')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          {t(
            'Explore our handcrafted registers, custom notebooks, and diaries to start creating.',
            'ہماری معیاری کاپیاں، رجسٹرز اور کسٹم ڈائریاں دیکھیں اور پسندیدہ اشیاء شامل کریں۔'
          )}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-xs rounded-lg transition-colors"
        >
          <span>{t('Browse Catalog', 'دکان دیکھیں')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Clear Cart */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
            {t('Shopping Cart', 'خریداری کی ٹوکری')}
          </h1>
          <p className="text-xs text-slate-500">
            {cart.length} {t('unique items in your bag', 'اشیاء موجود ہیں')}
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all items from your cart?')) {
              clearCart();
            }
          }}
          className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('Clear Cart', 'ٹوکری خالی کریں')}</span>
        </button>
      </div>

      {/* Nationwide Delivery Notice */}
      <div className="p-4 bg-slate-50 dark:bg-[#18201b] border border-slate-200 dark:border-neutral-800 rounded-xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#1b3022] dark:text-amber-400 shrink-0" />
          <span>
            {t(
              'Express Courier Delivery across all Pakistan cities & towns via TCS & Trax. COD available.',
              'پاکستان بھر میں ٹی سی ایس اور ٹریکس کے ذریعے تیز رفتار ڈلیوری اور کیش آن ڈلیوری کی سہولت دستیاب ہے۔'
            )}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 shrink-0">TCS / Trax</span>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border">
                  {item.coverImageThumbnail ? (
                    <img
                      src={item.coverImageThumbnail}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      BN
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.productName}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    SKU: {item.productSku}
                  </div>

                  {/* Customization Details Badges */}
                  {item.isCustomized && item.customization && (
                    <div className="text-[11px] text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900/50 space-y-0.5 mt-1">
                      <div className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Custom Print: "{item.customization.customTitle}"</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        {item.customization.size} · {item.customization.pageCount} Pages · {item.customization.ruling} · {item.customization.binding}
                      </div>
                      {item.customization.foilStampText && (
                        <div className="text-amber-600 font-semibold">
                          ✦ Hot Gold Foil Stamped Calligraphy
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Quantity Stepper */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-right">
                  <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white block">
                    Rs. {item.unitPrice * item.quantity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    Rs. {item.unitPrice} each
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-300 dark:border-neutral-700 rounded bg-slate-50 dark:bg-neutral-900">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-0.5 text-xs hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-0.5 text-xs font-mono font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-0.5 text-xs hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          {/* Coupon Box */}
          <div className="p-4 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Discount Coupon Code</span>
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="e.g. WELCOME10"
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded text-xs font-mono uppercase"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 dark:bg-neutral-700 text-white rounded text-xs font-semibold hover:bg-slate-800"
              >
                Apply
              </button>
            </form>
            {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Coupon {appliedCoupon.code} applied (-Rs. {discountAmount})</span>
              </p>
            )}
          </div>

          {/* Subtotal & Checkout Card */}
          <div className="p-5 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items):</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  Rs. {cartSubtotal}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span className="font-mono tabular-nums">-Rs. {discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping:</span>
                <span className="font-mono tabular-nums text-slate-500">
                  Calculated at checkout
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Estimated Total:</span>
                <span className="font-mono tabular-nums text-base text-[#1b3022] dark:text-amber-400">
                  Rs. {cartSubtotal - discountAmount}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => navigate('/checkout', { state: { coupon: appliedCoupon } })}
                className="w-full py-3 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('Proceed to Checkout (Pakistan Delivery)', 'چیک آؤٹ پر جائیں')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCartOrder}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('Order via WhatsApp Link', 'واٹس ایپ کے ذریعے آرڈر کریں')}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Cash on Delivery & Advance Bank / JazzCash options supported
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
