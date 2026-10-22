import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Upload,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { OrderService } from '../services/orderService.ts';
import { PricingService } from '../services/pricingService.ts';
import { IndexedDBImageUtil } from '../utils/storage.ts';
import { CustomerDetails, PaymentMethod } from '../types/index.ts';

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

const COMMON_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Sukkur',
  'Other / Remote Town',
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartSubtotal, clearCart, settings, showToast, t } = useApp();

  const coupon = (location.state as any)?.coupon;

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentProofId, setPaymentProofId] = useState<string | undefined>(undefined);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | undefined>(undefined);

  // Submission protection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const effectiveCity = city === 'Other / Remote Town' ? customCity || 'Remote / Other Cities' : city;

  // Shipping calculation
  const shippingFee = PricingService.calculateShippingFee(cartSubtotal, effectiveCity, settings);

  // Discount calculation
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountPercentage) {
      discountAmount = Math.round((cartSubtotal * coupon.discountPercentage) / 100);
    } else if (coupon.fixedDiscount) {
      discountAmount = Math.min(cartSubtotal, coupon.fixedDiscount);
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Receipt image exceeds 5MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const proofId = `proof-${Date.now()}`;
      await IndexedDBImageUtil.saveImage(proofId, dataUrl);
      setPaymentProofId(proofId);
      setPaymentProofUrl(dataUrl);
      showToast('Payment screenshot attached successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/shop');
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 11-digit Pakistani phone number (e.g. 0300 1234567)', 'error');
      return;
    }

    if (!fullName.trim() || !deliveryAddress.trim() || !effectiveCity.trim()) {
      showToast('Please fill all mandatory shipping address fields', 'error');
      return;
    }

    if (paymentMethod !== 'Cash on Delivery' && !transactionRef.trim() && !paymentProofId) {
      showToast('Please enter transaction reference ID or upload payment receipt screenshot', 'error');
      return;
    }

    setIsSubmitting(true);

    const customer: CustomerDetails = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      province,
      city: effectiveCity,
      deliveryAddress: deliveryAddress.trim(),
      nearestLandmark: nearestLandmark.trim() || undefined,
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      orderNotes: orderNotes.trim() || undefined,
    };

    const res = OrderService.createOrder({
      customer,
      items: cart,
      subtotal: cartSubtotal,
      shippingFee,
      discountAmount,
      couponCode: coupon?.code,
      grandTotal,
      paymentMethod,
      transactionReference: transactionRef.trim() || undefined,
      paymentProofImageId: paymentProofId,
      orderSource: 'website',
    });

    if (res.success && res.order) {
      clearCart();
      navigate(`/order-confirmation/${res.order.id}`);
    } else {
      showToast(res.error || 'Failed to place order. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-slate-500 text-xs">Add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-[#1b3022] text-white rounded-lg text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Secure Checkout & Delivery Details', 'محفوظ چیک آؤٹ اور ڈلیوری معلومات')}
        </h1>
        <p className="text-xs text-slate-500">
          {t(
            'Delivery throughout Pakistan via TCS, Leopard, or Trax Couriers',
            'ٹی سی ایس، لیپرڈ، یا ٹریکس کے ذریعے پاکستان کے تمام اضلاع میں ترسیل'
          )}
        </p>
      </div>

      <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer and Address Forms + Payment Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Customer Contact Details */}
          <div className="p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white border-b pb-2">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Usman"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile / WhatsApp Number *
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

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Optional for digital invoice copy)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pakistan Shipping Address */}
          <div className="p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white border-b pb-2 flex items-center justify-between">
              <span>2. Delivery Address in Pakistan</span>
              <span className="text-[11px] font-normal text-emerald-600 font-mono">
                {shippingFee === 0 ? 'FREE Shipping Qualified' : `Delivery: Rs. ${shippingFee}`}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Province *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {PAKISTAN_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {COMMON_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {city === 'Other / Remote Town' && (
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Your Town / Village / Tehsil Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="e.g. Swabi, Chakwal, Khairpur, Turbat..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Complete Street Address / House / Flat / Office Number *
                </label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. House # 14, Street 3, Block D, Model Town / Gulshan-e-Iqbal..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nearest Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  placeholder="e.g. Near PSO Pump or Central Jamia Masjid"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Call before delivery, handle with care"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Options (COD vs Manual Advance) */}
          <div className="p-6 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white border-b pb-2">
              3. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#1b3022] bg-[#1b3022]/5 dark:bg-amber-400/10 dark:border-amber-400'
                    : 'border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-1 text-[#1b3022] focus:ring-[#1b3022]"
                />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-slate-500">
                    Pay in cash when courier delivers the parcel at your doorstep. Available for all cities.
                  </p>
                </div>
              </label>

              {/* Option 2: Bank Transfer (Meezan Bank) */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-[#1b3022] bg-[#1b3022]/5 dark:bg-amber-400/10 dark:border-amber-400'
                    : 'border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="mt-1 text-[#1b3022] focus:ring-[#1b3022]"
                />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Direct Bank Transfer (Meezan Bank)
                  </span>
                  <p className="text-slate-500">
                    Transfer advance payment directly to the shop’s Meezan Bank account.
                  </p>
                </div>
              </label>

              {/* Option 3: JazzCash / EasyPaisa / SadaPay */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa' || paymentMethod === 'SadaPay / Nayapay'
                    ? 'border-[#1b3022] bg-[#1b3022]/5 dark:bg-amber-400/10 dark:border-amber-400'
                    : 'border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="JazzCash"
                  checked={paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa' || paymentMethod === 'SadaPay / Nayapay'}
                  onChange={() => setPaymentMethod('JazzCash')}
                  className="mt-1 text-[#1b3022] focus:ring-[#1b3022]"
                />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Mobile Wallet (JazzCash / EasyPaisa / SadaPay)
                  </span>
                  <p className="text-slate-500">
                    Send to shop's verified mobile account and enter Transaction ID.
                  </p>
                </div>
              </label>
            </div>

            {/* Advance Payment Details Sub-Panel */}
            {paymentMethod !== 'Cash on Delivery' && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4 text-xs">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Official Shop Payment Instructions:
                  </h4>

                  {/* Bank info */}
                  {paymentMethod === 'Bank Transfer' && (
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded border space-y-1 font-mono text-[11px]">
                      <div><strong>Bank:</strong> {settings.bankPaymentDetails.bankName}</div>
                      <div><strong>Title:</strong> {settings.bankPaymentDetails.accountTitle}</div>
                      <div className="flex items-center justify-between">
                        <span><strong>Account:</strong> {settings.bankPaymentDetails.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.bankPaymentDetails.accountNumber, 'Account #')}
                          className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedAccount === 'Account #' ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span><strong>IBAN:</strong> {settings.bankPaymentDetails.iban}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.bankPaymentDetails.iban, 'IBAN')}
                          className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedAccount === 'IBAN' ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wallet info */}
                  {paymentMethod !== 'Bank Transfer' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="p-2.5 bg-white dark:bg-neutral-800 rounded border space-y-1">
                        <div className="font-bold text-amber-700 dark:text-amber-400">JazzCash</div>
                        <div>{settings.jazzCashDetails.accountNumber}</div>
                        <div className="text-[10px] text-slate-500">{settings.jazzCashDetails.accountTitle}</div>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-neutral-800 rounded border space-y-1">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400">EasyPaisa</div>
                        <div>{settings.easyPaisaDetails.accountNumber}</div>
                        <div className="text-[10px] text-slate-500">{settings.easyPaisaDetails.accountTitle}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Transaction Reference & Screenshot Input */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-neutral-800">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Transaction Reference / Trx ID / TID *
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. 029384712039 or Bank Ref #"
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Upload Payment Screenshot / Receipt (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 hover:file:bg-slate-300 cursor-pointer"
                    />
                    {paymentProofUrl && (
                      <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot attached
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                    Advance payments will remain in <strong>"Awaiting Verification"</strong> status until manually reviewed by our accounting manager.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="p-5 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2">
              Order Items ({cart.length})
            </h3>

            {/* Thumbnail list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="truncate pr-2">
                    <span className="font-semibold block truncate text-slate-900 dark:text-white">
                      {item.productName}
                    </span>
                    <span className="text-[11px] text-slate-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold shrink-0">
                    Rs. {item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  Rs. {cartSubtotal}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono tabular-nums">-Rs. {discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery to {effectiveCity}:</span>
                <span className="font-mono tabular-nums font-semibold">
                  {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex justify-between text-base font-bold text-slate-900 dark:text-white">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-lg text-[#1b3022] dark:text-amber-400">
                  Rs. {grandTotal}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{isSubmitting ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
            </button>

            <div className="text-[10px] text-slate-400 space-y-1 text-center">
              <div>Protected by local-first browser storage</div>
              <div>Estimated production & delivery: 3–5 business days</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
