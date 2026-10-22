import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Globe, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const Header: React.FC = () => {
  const { cartCount, wishlist, settings, language, setLanguage, theme, toggleTheme, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: t('Shop', 'دکان'), path: '/shop' },
    { label: t('Customize', 'کسٹمائز'), path: '/customize' },
    { label: t('Ready-Made', 'ریڈی میڈ'), path: '/ready-made' },
    { label: t('Bulk Orders', 'بلک آرڈرز'), path: '/bulk-orders' },
    { label: t('Track Order', 'ٹریکنگ'), path: '/track' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Promotional Bar (max 38px, quiet, dismissible) */}
      <div className="bg-[#1b3022] text-[#f7f5f0] text-xs py-2 px-4 text-center flex items-center justify-between border-b border-[#2d4d38]">
        <div className="hidden sm:block text-[11px] opacity-75">
          {t('Custom Notebook Printing Throughout Pakistan', 'پاکستان بھر میں کسٹم نوٹ بکس کی پرنٹنگ اور ڈلیوری')}
        </div>
        <div className="mx-auto sm:mx-0 font-medium tracking-wide">
          {t(
            'Sidhu Moose Wala & Cheema Y Editions · Fast Delivery All Pakistan · COD Available',
            'سدھو موسے والا اور چیمہ وائی اسپیشل ایڈیشن نوٹ بکس · پورے پاکستان میں ڈیلیوری · کیش آن ڈلیوری'
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hover:text-amber-300 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Header adhering strictly to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 dark:bg-[#121815]/95 backdrop-blur-md border-b border-[#e6e0d5] dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-editorial font-bold tracking-tight text-[#1b3022] dark:text-[#f4edd9] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            {settings.shopName}
          </Link>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-all ${
                  isActive(link.path)
                    ? 'border-[#1b3022] dark:border-amber-400 text-[#1b3022] dark:text-amber-400 font-semibold'
                    : 'border-transparent hover:border-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Zone 3: 1 primary action area (Shopping Bag + Wishlist + Mobile Trigger) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-[#1b3022] dark:hover:text-amber-400 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button (Primary Action) */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 bg-[#1b3022] hover:bg-[#25422f] dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t('Cart', 'ٹوکری')}</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
                {cartCount}
              </span>
            </Link>

            {/* Admin Quick Entry */}
            <Link
              to="/admin"
              className="hidden lg:flex items-center p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors"
              title="Shop Management System"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e6e0d5] dark:border-neutral-800 bg-[#faf8f5] dark:bg-[#121815] px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-[#1b3022] text-white dark:bg-amber-500/20 dark:text-amber-300'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 px-3">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('Admin Management', 'ایڈمن پینل')}</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:underline"
              >
                {t('Contact Us', 'ہم سے رابطہ کریں')}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
