import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast, t } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSubmitted(true);
    showToast(t('Message received! We will reply promptly.', 'پیغام موصول ہو گیا! ہم جلد رابطہ کریں گے۔'), 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-slate-900 dark:text-white">
          {t('Contact & Workshop Inquiry', 'رابطہ اور معلوماتی فارم')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t(
            'Get in touch with our printing atelier for custom orders, school copies, or delivery inquiries.',
            'کسٹم آرڈرز یا اسکول کاپیوں کے متعلق براہ راست رابطہ کریں۔'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Information Cards */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-[#18201b] rounded-2xl border border-slate-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2">
              Workshop & Sales Channels
            </h2>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800 dark:text-white">Printing Atelier:</strong>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-white">Telephone:</strong>
                  <a href={`tel:${settings.contactPhone}`} className="hover:underline font-mono">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-white">WhatsApp Order Line:</strong>
                  <a
                    href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-mono text-emerald-600 dark:text-emerald-400 font-semibold"
                  >
                    +{settings.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-white">Email:</strong>
                  <span>{settings.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action Banner */}
          <div className="p-6 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl space-y-3 text-xs">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Need Immediate Assistance?</span>
            </h3>
            <p className="text-emerald-800 dark:text-emerald-400">
              Our sales representative is active on WhatsApp Monday through Saturday, 9:00 AM – 9:00 PM PKT.
            </p>
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello ${settings.shopName}, I have an inquiry about custom printing.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded-lg shadow-xs"
            >
              <span>Chat with Representative</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#18201b] rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                Thank you for reaching out. We will get back to your WhatsApp/phone shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#1b3022] dark:text-amber-400 font-semibold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2">
                Send a Message
              </h2>

              <div>
                <label className="font-semibold block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Message / Inquiry Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what notebook format, quantity, or query you have..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
