import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  BookOpen,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { ProductService } from '../../services/productService.ts';
import { OrderService } from '../../services/orderService.ts';
import { CustomDesignService } from '../../services/customDesignService.ts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminOverview: React.FC = () => {
  const { settings } = useApp();

  const products = useMemo(() => ProductService.getProducts(), []);
  const orders = useMemo(() => OrderService.getOrders(), []);
  const designRequests = useMemo(() => CustomDesignService.getRequests(), []);

  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const lowStockProducts = products.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 10));
  const pendingRequests = designRequests.filter((r) => r.status === 'Request Received' || r.status === 'Under Review');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment.status === 'Verified' || o.payment.status === 'Cash on Delivery' ? o.grandTotal : 0), 0);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time snapshot of store operations, orders, and workshop queue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3 py-1.5 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Local Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#1b3022] dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {orders.length}
          </div>
          <div className="text-[10px] text-amber-600 font-medium">
            {pendingOrders.length} pending fulfillment
          </div>
        </div>

        {/* Recorded Revenue */}
        <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recorded Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">
            From verified & COD orders
          </div>
        </div>

        {/* Custom Design Requests */}
        <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Design Briefs</span>
            <FileSpreadsheet className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {designRequests.length}
          </div>
          <div className="text-[10px] text-sky-600 font-medium">
            {pendingRequests.length} awaiting quotation
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {lowStockProducts.length}
          </div>
          <div className="text-[10px] text-rose-600 font-medium">
            Products need restocking
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Recent Local Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#1b3022] dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-neutral-900 rounded-xl border text-xs text-slate-500">
            No local orders placed yet. Place an order on the public storefront to test the workflow.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 border-b font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                      {ord.customer.fullName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{ord.customer.city}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold">Rs. {ord.grandTotal}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] text-slate-600">
                        {ord.payment.method} ({ord.payment.status})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Workshop Queue & Low Stock Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Design Requests Awaiting Action */}
        <div className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Pending Design Requests
            </h3>
            <Link to="/admin/design-requests" className="text-xs text-amber-700 hover:underline">
              Manage
            </Link>
          </div>
          {pendingRequests.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">No pending custom requests</p>
          ) : (
            <div className="space-y-2">
              {pendingRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="p-2.5 bg-white dark:bg-neutral-800 rounded border text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-amber-700 block">{req.requestId}</span>
                    <span className="text-slate-600">{req.customerName} · {req.estimatedQuantity} units</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{req.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Items */}
        <div className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Low Stock Alert
            </h3>
            <Link to="/admin/inventory" className="text-xs text-amber-700 hover:underline">
              Adjust Stock
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">All products have healthy inventory</p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.slice(0, 3).map((prod) => (
                <div key={prod.id} className="p-2.5 bg-white dark:bg-neutral-800 rounded border text-xs flex justify-between items-center">
                  <div className="truncate pr-2">
                    <span className="font-semibold block truncate text-slate-900 dark:text-white">
                      {prod.name}
                    </span>
                    <span className="text-slate-400 text-[10px]">SKU: {prod.sku}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-mono font-bold rounded text-xs shrink-0">
                    {prod.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
