import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { WhatsAppFloatButton } from './components/common/WhatsAppFloatButton.tsx';

// Public Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { ReadyMadeDesignsPage } from './pages/ReadyMadeDesignsPage.tsx';
import { CustomizerPage } from './pages/CustomizerPage.tsx';
import { DesignRequestPage } from './pages/DesignRequestPage.tsx';
import { BulkOrderPage } from './pages/BulkOrderPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { OrderLookupPage } from './pages/OrderLookupPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import {
  ShippingPolicyPage,
  ReturnsPolicyPage,
  PrivacyPolicyPage,
  TermsPage,
} from './pages/PolicyPages.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminLayout } from './pages/admin/AdminLayout.tsx';
import { AdminOverview } from './pages/admin/AdminOverview.tsx';
import { AdminProducts } from './pages/admin/AdminProducts.tsx';
import { AdminOrders } from './pages/admin/AdminOrders.tsx';
import { AdminDesignRequests } from './pages/admin/AdminDesignRequests.tsx';
import { AdminInventory } from './pages/admin/AdminInventory.tsx';
import { AdminFinance } from './pages/admin/AdminFinance.tsx';
import { AdminSettings } from './pages/admin/AdminSettings.tsx';
import { AdminBackup } from './pages/admin/AdminBackup.tsx';

// Layout wrapper for Public Storefront
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf8f5] dark:bg-[#121815] transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatButton />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/ready-made" element={<ReadyMadeDesignsPage />} />
            <Route path="/customize" element={<CustomizerPage />} />
            <Route path="/request-design" element={<DesignRequestPage />} />
            <Route path="/bulk-orders" element={<BulkOrderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/track" element={<OrderLookupPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Management Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="design-requests" element={<AdminDesignRequests />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="backup" element={<AdminBackup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
