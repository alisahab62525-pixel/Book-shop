import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, ShopSettings } from '../types/index.ts';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';
import { SettingsService } from '../services/settingsService.ts';
import { auth } from '../firebase/config.ts';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Settings
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  refreshSettings: () => void;

  // Language & Localization
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  t: (en: string, ur: string) => string;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Search & Recent
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  searchHistory: string[];
  addSearchTerm: (term: string) => void;
  clearSearchHistory: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Admin Auth (client-side demo)
  isAdminAuthenticated: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() =>
    LocalStorageUtil.get<CartItem[]>(StorageKeys.CART, [])
  );

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() =>
    LocalStorageUtil.get<string[]>(StorageKeys.WISHLIST, [])
  );

  // Settings state
  const [settings, setSettings] = useState<ShopSettings>(() =>
    SettingsService.getSettings()
  );

  // Language state
  const [language, setLanguageState] = useState<'en' | 'ur'>(() =>
    LocalStorageUtil.get<'en' | 'ur'>(StorageKeys.LANGUAGE, 'en')
  );

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() =>
    LocalStorageUtil.get<'light' | 'dark'>(StorageKeys.THEME, 'light')
  );

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    LocalStorageUtil.get<string[]>(StorageKeys.RECENTLY_VIEWED, [])
  );

  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>(() =>
    LocalStorageUtil.get<string[]>(StorageKeys.SEARCH_HISTORY, [])
  );

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Admin session
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('beyond_admin_auth') === 'true';
  });

  // Sync cart to storage
  useEffect(() => {
    LocalStorageUtil.set(StorageKeys.CART, cart);
  }, [cart]);

  // Sync wishlist to storage
  useEffect(() => {
    LocalStorageUtil.set(StorageKeys.WISHLIST, wishlist);
  }, [wishlist]);

  // Sync language to storage & HTML dir/lang attributes
  const setLanguage = (lang: 'en' | 'ur') => {
    setLanguageState(lang);
    LocalStorageUtil.set(StorageKeys.LANGUAGE, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  // Sync theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    LocalStorageUtil.set(StorageKeys.THEME, nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Cart operations
  const addToCart = useCallback((newItem: CartItem) => {
    setCart((prev) => {
      if (newItem.isCustomized) {
        return [newItem, ...prev];
      }
      const existingIndex = prev.findIndex((item) => item.productId === newItem.productId && !item.isCustomized);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [newItem, ...prev];
    });
    showToast(language === 'ur' ? 'آئٹم کارٹ میں شامل کر دیا گیا' : 'Item added to your cart', 'success');
  }, [language, showToast]);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast(language === 'ur' ? 'آئٹم کارٹ سے ہٹا دیا گیا' : 'Item removed from cart', 'info');
  }, [language, showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    LocalStorageUtil.remove(StorageKeys.CART);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'ur' ? 'وش لسٹ سے ہٹا دیا گیا' : 'Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'ur' ? 'وش لسٹ میں شامل کر دیا گیا' : 'Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  }, [language, showToast]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Settings
  const refreshSettings = useCallback(() => {
    setSettings(SettingsService.getSettings());
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ShopSettings>) => {
    const updated = SettingsService.updateSettings(newSettings);
    setSettings(updated);
    showToast(language === 'ur' ? 'ترتیبات محفوظ ہو گئیں' : 'Settings updated successfully', 'success');
  }, [language, showToast]);

  // Translations helper
  const t = useCallback((en: string, ur: string) => (language === 'ur' ? ur : en), [language]);

  // Recently viewed - with strict guard against identical updates
  const addRecentlyViewed = useCallback((productId: string) => {
    if (!productId) return;
    setRecentlyViewed((prev) => {
      if (prev.length > 0 && prev[0] === productId) {
        return prev; // No-op: prevents re-rendering when already viewing this product
      }
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, 8);
      LocalStorageUtil.set(StorageKeys.RECENTLY_VIEWED, updated);
      return updated;
    });
  }, []);

  // Search History
  const addSearchTerm = useCallback((term: string) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== term.toLowerCase());
      const updated = [term.trim(), ...filtered].slice(0, 6);
      LocalStorageUtil.set(StorageKeys.SEARCH_HISTORY, updated);
      return updated;
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    LocalStorageUtil.remove(StorageKeys.SEARCH_HISTORY);
  }, []);

  // Admin Auth
  const adminLogin = useCallback((pin: string): boolean => {
    const correctPin = settings.adminPin || '1234';
    if (pin === correctPin) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('beyond_admin_auth', 'true');
      showToast(language === 'ur' ? 'ایڈمن لاگ ان کامیاب' : 'Admin access granted', 'success');
      return true;
    }
    showToast(language === 'ur' ? 'غلط پن کوڈ درج کیا گیا' : 'Incorrect Admin PIN. Default is 1234', 'error');
    return false;
  }, [settings.adminPin, language, showToast]);

  const adminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('beyond_admin_auth');
    sessionStorage.removeItem('beyond_admin_email');
    try {
      auth.signOut().catch(() => {});
    } catch {
      // ignore
    }
    showToast(language === 'ur' ? 'ایڈمن لاگ آؤٹ ہو گیا' : 'Logged out of admin panel', 'info');
  }, [language, showToast]);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        settings,
        updateSettings,
        refreshSettings,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        recentlyViewed,
        addRecentlyViewed,
        searchHistory,
        addSearchTerm,
        clearSearchHistory,
        toasts,
        showToast,
        removeToast,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
