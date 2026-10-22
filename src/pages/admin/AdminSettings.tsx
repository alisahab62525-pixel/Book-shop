import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, DollarSign, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { ShopSettings } from '../../types/index.ts';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();
  const [form, setForm] = useState<ShopSettings>({ ...settings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Shop configuration saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          Shop Settings & Business Rules
        </h1>
        <p className="text-slate-500">
          Configure store branding, Pakistani payment instructions, shipping thresholds, and pricing engines
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branding & Contacts */}
        <div className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2">
            1. Brand Identity & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Shop Name (English)</label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Shop Name (Urdu)</label>
              <input
                type="text"
                value={form.shopNameUrdu}
                onChange={(e) => setForm({ ...form, shopNameUrdu: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-urdu"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tagline (English)</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tagline (Urdu)</label>
              <input
                type="text"
                value={form.taglineUrdu}
                onChange={(e) => setForm({ ...form, taglineUrdu: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-urdu"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">WhatsApp Ordering Number (Without + or dashes)</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="923001234567"
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Workshop Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>2. Delivery Charges Throughout Pakistan</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                min={0}
                value={form.freeShippingThreshold}
                onChange={(e) =>
                  setForm({ ...form, freeShippingThreshold: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Set to 0 to disable free delivery completely (standard courier rates apply to all orders).
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1">Default Flat Delivery Fee (PKR)</label>
              <input
                type="number"
                min={0}
                value={form.defaultFlatShippingFee}
                onChange={(e) =>
                  setForm({ ...form, defaultFlatShippingFee: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-mono"
              />
            </div>
          </div>
        </div>

        {/* Advance Payment Bank & Mobile Wallets */}
        <div className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2">
            3. Advance Bank & Mobile Wallet Details
          </h2>

          <div className="space-y-4">
            {/* Meezan Bank */}
            <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">Official Bank Account</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={form.bankPaymentDetails.bankName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankPaymentDetails: { ...form.bankPaymentDetails, bankName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Account Title</label>
                  <input
                    type="text"
                    value={form.bankPaymentDetails.accountTitle}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankPaymentDetails: { ...form.bankPaymentDetails, accountTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={form.bankPaymentDetails.accountNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankPaymentDetails: { ...form.bankPaymentDetails, accountNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">IBAN</label>
                  <input
                    type="text"
                    value={form.bankPaymentDetails.iban}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankPaymentDetails: { ...form.bankPaymentDetails, iban: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Wallets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border space-y-2">
                <span className="font-bold text-amber-700 dark:text-amber-400 block">JazzCash Account</span>
                <div>
                  <label className="block font-semibold mb-1">JazzCash Account Number</label>
                  <input
                    type="text"
                    value={form.jazzCashDetails.accountNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        jazzCashDetails: { ...form.jazzCashDetails, accountNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">JazzCash Account Title</label>
                  <input
                    type="text"
                    value={form.jazzCashDetails.accountTitle}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        jazzCashDetails: { ...form.jazzCashDetails, accountTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded"
                  />
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg border space-y-2">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">EasyPaisa Account</span>
                <div>
                  <label className="block font-semibold mb-1">EasyPaisa Account Number</label>
                  <input
                    type="text"
                    value={form.easyPaisaDetails.accountNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        easyPaisaDetails: { ...form.easyPaisaDetails, accountNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">EasyPaisa Account Title</label>
                  <input
                    type="text"
                    value={form.easyPaisaDetails.accountTitle}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        easyPaisaDetails: { ...form.easyPaisaDetails, accountTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-900 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Rules */}
        <div className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>4. Customization & Surcharge Pricing Rules</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Custom Printing Base Fee (PKR)</label>
              <input
                type="number"
                min={0}
                value={form.pricingRules.customPrintBaseSurcharge}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricingRules: {
                      ...form.pricingRules,
                      customPrintBaseSurcharge: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Gold Foil Stamping Surcharge (PKR)</label>
              <input
                type="number"
                min={0}
                value={form.pricingRules.foilStampSurcharge}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricingRules: {
                      ...form.pricingRules,
                      foilStampSurcharge: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Hardcover Binding Surcharge (PKR)</label>
              <input
                type="number"
                min={0}
                value={form.pricingRules.hardcoverSurcharge}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricingRules: {
                      ...form.pricingRules,
                      hardcoverSurcharge: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
              />
            </div>
          </div>
        </div>

        {/* Admin PIN */}
        <div className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>5. Security PIN</span>
          </h2>
          <div className="max-w-xs">
            <label className="block font-semibold mb-1">Client Admin PIN Code</label>
            <input
              type="text"
              required
              value={form.adminPin}
              onChange={(e) => setForm({ ...form, adminPin: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-mono tracking-widest"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </form>
    </div>
  );
};
