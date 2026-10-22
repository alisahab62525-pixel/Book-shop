import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { OrderService } from '../services/orderService.ts';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { settings, t } = useApp();

  const order = useMemo(() => {
    if (!orderId) return undefined;
    return OrderService.getOrderById(orderId);
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Order Details Not Found</h1>
        <p className="text-slate-500 text-xs">
          The order could not be located in your local session.
        </p>
        <Link to="/track" className="inline-block px-5 py-2.5 bg-[#1b3022] text-white rounded text-xs font-semibold">
          Look up Order
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppSend = () => {
    const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const itemsSummary = order.items
      .map(
        (it) =>
          `• ${it.productName} × ${it.quantity} (Rs. ${it.totalPrice})${
            it.isCustomized && it.customizationDetails
              ? ` [Custom: ${it.customizationDetails.customTitle}]`
              : ''
          }`
      )
      .join('\n');

    const message = encodeURIComponent(
      `*Beyond Notebooks Order Receipt*\n\n` +
        `*Order Number:* ${order.orderNumber}\n` +
        `*Customer:* ${order.customer.fullName}\n` +
        `*Phone:* ${order.customer.phone}\n` +
        `*City:* ${order.customer.city}\n` +
        `*Address:* ${order.customer.deliveryAddress}\n\n` +
        `*Items Ordered:*\n${itemsSummary}\n\n` +
        `*Grand Total:* Rs. ${order.grandTotal}\n` +
        `*Payment Method:* ${order.payment.method} (${order.payment.status})\n` +
        (order.payment.transactionReference
          ? `*Trx ID:* ${order.payment.transactionReference}\n`
          : '') +
        `\nPlease confirm order receipt and start production schedule!`
    );

    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner (hidden on print) */}
      <div className="no-print bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Thank You! Your Order has been Placed', 'شکریہ! آپ کا آرڈر موصول ہو چکا ہے')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          {t(
            `Order reference #${order.orderNumber} is saved. Send your receipt to our WhatsApp to ensure express production!`,
            `آرڈر نمبر ${order.orderNumber} محفوظ کر لیا گیا ہے۔ تیز رفتار تیاری کے لیے واٹس ایپ پر رسید بھیجیں۔`
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleWhatsAppSend}
            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t('Send Receipt to Shop WhatsApp', 'واٹس ایپ پر رسید بھیجیں')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 dark:bg-neutral-800 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t('Print Order Receipt', 'رسید پرنٹ کریں')}</span>
          </button>
        </div>
      </div>

      {/* Printable Formal Invoice / Receipt */}
      <div className="bg-white dark:bg-[#18201b] p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-neutral-800 space-y-8 shadow-sm">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-neutral-800">
          <div>
            <h2 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
              {settings.shopName}
            </h2>
            <p className="text-xs text-slate-500">{settings.tagline}</p>
            <p className="text-xs text-slate-500 font-mono mt-1">{settings.address}</p>
          </div>

          <div className="sm:text-right text-xs space-y-1">
            <div className="text-sm font-bold font-mono text-amber-700 dark:text-amber-400">
              {order.orderNumber}
            </div>
            <div className="text-slate-500 font-mono">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Status: <span className="text-amber-600">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider block mb-1">
              Billed & Shipped To:
            </span>
            <div className="font-semibold text-sm text-slate-900 dark:text-white">
              {order.customer.fullName}
            </div>
            <div className="font-mono text-slate-600 dark:text-slate-300">
              Phone: {order.customer.phone}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              Address: {order.customer.deliveryAddress}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              City: {order.customer.city}, {order.customer.province}
            </div>
            {order.customer.nearestLandmark && (
              <div className="text-slate-500 italic">
                Landmark: {order.customer.nearestLandmark}
              </div>
            )}
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider block mb-1">
              Payment Method:
            </span>
            <div className="font-semibold text-sm text-slate-900 dark:text-white">
              {order.payment.method}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              Payment Status: <span className="font-semibold text-amber-600">{order.payment.status}</span>
            </div>
            {order.payment.transactionReference && (
              <div className="text-slate-500 font-mono">
                Trx Ref: {order.payment.transactionReference}
              </div>
            )}
            <div className="text-slate-500 pt-1">
              Courier Delivery: Nationwide Pakistan
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-xs text-left min-w-[340px]">
              <thead className="border-b border-slate-200 dark:border-neutral-700 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-3 pr-2">
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {item.productName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.sku}
                      </span>
                      {item.isCustomized && item.customizationDetails && (
                        <div className="text-[11px] text-amber-800 dark:text-amber-400 mt-1">
                          Custom: "{item.customizationDetails.customTitle}" ({item.customizationDetails.size}, {item.customizationDetails.pageCount}p, {item.customizationDetails.ruling})
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 text-right font-mono tabular-nums">Rs. {item.unitPrice}</td>
                    <td className="py-3 text-right font-mono tabular-nums font-semibold">
                      Rs. {item.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-slate-200 dark:border-neutral-800 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums">Rs. {order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono tabular-nums">-Rs. {order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-mono tabular-nums">
                  {order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-neutral-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-base text-[#1b3022] dark:text-amber-400">
                  Rs. {order.grandTotal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer notes */}
        <div className="pt-6 border-t border-slate-100 dark:border-neutral-800 text-[11px] text-slate-400 text-center">
          Thank you for choosing {settings.shopName}. Handcrafted in Pakistan with FSC Certified Paper.
        </div>
      </div>

      {/* Navigation links */}
      <div className="no-print flex justify-between items-center text-xs">
        <Link to="/track" className="text-[#1b3022] dark:text-amber-400 font-semibold hover:underline">
          Track this order with your mobile number →
        </Link>
        <Link to="/shop" className="text-slate-600 hover:underline">
          Return to Catalog
        </Link>
      </div>
    </div>
  );
};
