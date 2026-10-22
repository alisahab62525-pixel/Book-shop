import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  FileSpreadsheet,
  Layers,
  DollarSign,
  Settings,
  Database,
  LogOut,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const AdminLayout: React.FC = () => {
  const { isAdminAuthenticated, adminLogout, settings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { label: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { label: 'Products & Catalog', path: '/admin/products', icon: BookOpen },
    { label: 'Orders & Receipts', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Design Requests', path: '/admin/design-requests', icon: FileSpreadsheet },
    { label: 'Inventory & Stock', path: '/admin/inventory', icon: Layers },
    { label: 'Finance & Suppliers', path: '/admin/finance', icon: DollarSign },
    { label: 'Shop Settings', path: '/admin/settings', icon: Settings },
    { label: 'Backup & Restore', path: '/admin/backup', icon: Database },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f7f5f0] dark:bg-[#121815] text-slate-800 dark:text-slate-200">
      {/* Top Banner Notice: Local-First Prototype Disclosure */}
      <div className="bg-[#1b3022] text-[#f4edd9] px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#2d4d38]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            <strong>Local-First Mode:</strong> Orders and products are saved in browser storage. Customer orders placed on other devices will not appear here until a production cloud database is connected.
          </span>
        </div>
        <Link to="/" className="text-amber-300 hover:underline flex items-center gap-1 font-semibold whitespace-nowrap">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View Public Storefront</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white dark:bg-[#18201b] rounded-2xl border border-slate-200 dark:border-neutral-800 p-4 space-y-4 shadow-sm lg:sticky lg:top-8">
            <div className="border-b border-slate-100 dark:border-neutral-800 pb-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                Shop Administration
              </span>
              <h2 className="text-base font-editorial font-bold text-slate-900 dark:text-white truncate">
                {settings.shopName}
              </h2>
            </div>

            <nav className="space-y-1 text-xs font-medium">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                      active
                        ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-neutral-800">
              <button
                onClick={() => {
                  adminLogout();
                  navigate('/admin/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out Admin</span>
              </button>
            </div>
          </aside>

          {/* Main Admin Content View */}
          <main className="lg:col-span-9 bg-white dark:bg-[#18201b] rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm min-h-[600px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
