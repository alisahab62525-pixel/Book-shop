import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.tsx';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, t } = useApp();

  return (
    <footer className="bg-[#17231c] text-[#dcd6ca] text-xs pt-12 pb-8 border-t border-[#25392d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#25392d]">
          {/* Col 1: Brand story */}
          <div className="space-y-3">
            <h3 className="text-xl font-editorial font-bold text-[#f5ebd7] tracking-tight">
              {settings.shopName}
            </h3>
            <p className="text-xs leading-relaxed text-[#b5ad9e]">
              {t(
                'Pakistan’s dedicated custom notebook printing atelier. We craft personalized journals, school copies, accounting registers, and bespoke stationery with unmatched paper quality and artisanal finishes.',
                'پاکستان کا معیاری کسٹم نوٹ بک پرنٹنگ ادارہ۔ ہم آپ کے نام، تصویر اور لوگو کے ساتھ بہترین ڈائریاں، اسکول کاپیاں اور رجسٹرز تیار کرتے ہیں۔'
              )}
            </p>
            <div className="pt-1 flex items-center gap-3 text-[11px] text-[#938b7e]">
              <span>Cash on Delivery</span>
              <span>·</span>
              <span>Nationwide Shipping</span>
              <span>·</span>
              <span>Bulk Discounts</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#f5ebd7] uppercase tracking-wider">
              {t('Stationery Collections', 'اسٹیشنری کلیکشنز')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="hover:text-amber-300 transition-colors">
                  {t('All Products & Catalog', 'تمام پروڈکٹس')}
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:text-amber-300 transition-colors">
                  {t('Custom Notebook Studio', 'نوٹ بک کسٹمائز کریں')}
                </Link>
              </li>
              <li>
                <Link to="/request-design" className="hover:text-amber-300 transition-colors">
                  {t('Upload Custom Design Brief', 'اپنی پسند کا ڈیزائن بنوائیں')}
                </Link>
              </li>
              <li>
                <Link to="/ready-made" className="hover:text-amber-300 transition-colors">
                  {t('Ready-Made Cover Designs', 'ریڈی میڈ ڈیزائنز')}
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="hover:text-amber-300 transition-colors">
                  {t('Bulk School & Corporate Printing', 'سکول و دفتری بلک آرڈرز')}
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-amber-300 transition-colors">
                  {t('Track Your Order', 'آرڈر کی تفصیلات و ٹریکنگ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#f5ebd7] uppercase tracking-wider">
              {t('Customer Policies', 'پالیسیز و معلومات')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping-policy" className="hover:text-amber-300 transition-colors">
                  {t('Shipping & Delivery Policy', 'ڈلیوری و ترسیل پالیسی')}
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-amber-300 transition-colors">
                  {t('Returns & Custom Order Policy', 'واپسی و کسٹم آرڈر پالیسی')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors">
                  {t('Privacy Policy', 'پرائیویسی پالیسی')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-300 transition-colors">
                  {t('Terms & Conditions', 'شرائط و ضوابط')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-300 transition-colors">
                  {t('Frequently Asked Questions (FAQ)', 'عام سوالات و جوابات')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors">
                  {t('About Our Printing Press', 'ہمارے پرنٹنگ پریس کے بارے میں')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Workshop */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#f5ebd7] uppercase tracking-wider">
              {t('Workshop & Contact', 'رابطہ و ورکشاپ')}
            </h4>
            <div className="space-y-2.5 text-[#b5ad9e]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:underline">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-emerald-300"
                >
                  WhatsApp: +{settings.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and local-first notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8e8679]">
          <p>© {new Date().getFullYear()} {settings.shopName}. All rights reserved. Made for Pakistan.</p>
          <div className="flex items-center gap-4">
            <span>Payment Options: Cash on Delivery · Bank Transfer · JazzCash · EasyPaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
