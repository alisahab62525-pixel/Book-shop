import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { OrderService } from '../services/orderService.ts';
import { Order, OrderStatus } from '../types/index.ts';

const STATUS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Printing',
  'Ready for Dispatch',
  'Shipped',
  'Delivered',
];

export const OrderLookupPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, showToast, t } = useApp();

  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      showToast('Please enter both Order Number and Phone number', 'error');
      return;
    }

    const order = OrderService.lookupOrder(orderNumber.trim(), phone.trim());
    setFoundOrder(order || null);
    setSearched(true);
  };

  const handleReorder = () => {
    if (!foundOrder) return;
    foundOrder.items.forEach((item) => {
      addToCart({
        id: `reorder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: item.productId,
        productName: item.productName,
        productSku: item.sku,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        coverImageThumbnail: item.thumbnail,
        isCustomized: item.isCustomized,
        customization: item.customizationDetails,
        snapshotPriceBreakdown: {
          basePrice: item.unitPrice,
          optionsSurcharge: 0,
          customPrintingFee: 0,
          unitTotal: item.unitPrice,
        },
      });
    });
    showToast('Items added to cart for reordering!', 'success');
    navigate('/cart');
  };

  const getStepIndex = (status: OrderStatus) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Track Your Notebook Order', 'اپنے آرڈر کی تفصیلات اور ٹریکنگ')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t(
            'Enter your Order Number (e.g. BN-2026-1042) and the mobile phone number used during checkout.',
            'اپنا آرڈر نمبر اور موبائل نمبر درج کر کے لائیو اسٹیٹس چیک کریں۔'
          )}
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-[#18201b] p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
              Order Number *
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. BN-2026-1042"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
              Customer Mobile Phone *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0300 1234567"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>{t('Lookup Order Status', 'اسٹیٹس معلوم کریں')}</span>
        </button>
      </form>

      {/* Results View */}
      {searched && (
        <>
          {!foundOrder ? (
            <div className="p-8 bg-white dark:bg-[#18201b] rounded-2xl border border-rose-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                No matching order found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Please double-check the Order ID and mobile number. In local-only mode, orders are saved in the browser where the order was placed.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#18201b] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-neutral-800 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                    Order #{foundOrder.orderNumber}
                  </span>
                  <div className="text-xs text-slate-500">
                    Placed on {new Date(foundOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 rounded text-xs font-semibold border border-amber-200">
                    {foundOrder.status}
                  </span>
                  <button
                    onClick={handleReorder}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Production & Dispatch Timeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  {STATUS_STEPS.map((st, i) => {
                    const isDone = i <= getStepIndex(foundOrder.status);
                    return (
                      <div
                        key={st}
                        className={`p-2 rounded-lg border text-[11px] font-medium ${
                          isDone
                            ? 'bg-[#1b3022] text-white border-[#1b3022]'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {st}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Tracking Info if dispatched */}
              {foundOrder.shipping.trackingNumber ? (
                <div className="p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-sky-900 dark:text-sky-300 block flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>Courier Shipment Dispatched</span>
                  </span>
                  <div>
                    <strong>Courier:</strong> {foundOrder.shipping.courierName || 'TCS Express Pakistan'}
                  </div>
                  <div>
                    <strong>Tracking Number / Consignment:</strong>{' '}
                    <span className="font-mono font-bold text-sky-800">
                      {foundOrder.shipping.trackingNumber}
                    </span>
                  </div>
                  {foundOrder.shipping.dispatchDate && (
                    <div>
                      <strong>Dispatch Date:</strong> {foundOrder.shipping.dispatchDate}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-lg text-xs text-amber-800 dark:text-amber-400">
                  Your order is currently being printed and bound in our workshop. Tracking number will appear here once dispatched.
                </div>
              )}

              {/* Items summary */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold block text-slate-800 dark:text-white">Ordered Items:</span>
                {foundOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>
                      {it.productName} × {it.quantity}
                    </span>
                    <span className="font-mono">Rs. {it.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-between items-center font-bold text-sm">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-[#1b3022] dark:text-amber-400">
                  Rs. {foundOrder.grandTotal}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
