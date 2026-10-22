import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  X,
  CreditCard,
} from 'lucide-react';
import { OrderService } from '../../services/orderService.ts';
import { BackupService } from '../../services/backupService.ts';
import { Order, OrderStatus, PaymentStatus } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminOrders: React.FC = () => {
  const { showToast } = useApp();
  const [orders, setOrders] = useState<Order[]>(() => OrderService.getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modal edit fields
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('Awaiting Verification');
  const [courierName, setCourierName] = useState('TCS Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [dispatchDate, setDispatchDate] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchCust = o.customer.fullName.toLowerCase().includes(q) || o.customer.phone.includes(q);
      const matchCity = o.customer.city.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchCity) return false;
    }
    return true;
  });

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.payment.status);
    setCourierName(order.shipping.courierName || 'TCS Express');
    setTrackingNumber(order.shipping.trackingNumber || '');
    setDispatchDate(order.shipping.dispatchDate || new Date().toISOString().slice(0, 10));
    setStatusNote('');
  };

  const handleSaveOrderChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Update status
    OrderService.updateOrderStatus(selectedOrder.id, newStatus, statusNote);
    // Update payment
    OrderService.updatePaymentStatus(selectedOrder.id, newPaymentStatus);
    // Update shipping
    if (trackingNumber.trim()) {
      OrderService.updateShippingInfo(selectedOrder.id, {
        courierName,
        trackingNumber: trackingNumber.trim(),
        dispatchDate,
      });
    }

    setOrders(OrderService.getOrders());
    setSelectedOrder(null);
    showToast('Order details updated', 'success');
  };

  const handleExportCSV = () => {
    BackupService.exportOrdersCSV(orders);
    showToast('Orders report exported as CSV', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
            Order Management & Fulfillment
          </h1>
          <p className="text-xs text-slate-500">
            Track customer orders, verify advance payments, and assign courier consignment numbers
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg text-xs text-slate-900 dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'Pending', 'Confirmed', 'Printing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#1b3022] text-white dark:bg-amber-400 dark:text-black'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-neutral-900 rounded-xl border text-xs text-slate-500">
          No orders match your filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 border-b font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer & City</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Grand Total</th>
                <th className="py-2.5 px-3">Order Status</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold block text-slate-900 dark:text-white">
                      {ord.customer.fullName}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {ord.customer.city} · {ord.customer.phone}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {ord.items.reduce((s, it) => s + it.quantity, 0)} units
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold">
                    Rs. {ord.grandTotal}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ord.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="block font-medium">{ord.payment.method}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        ord.payment.status === 'Verified'
                          ? 'text-emerald-600'
                          : ord.payment.status === 'Awaiting Verification'
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {ord.payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenDetail(ord)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-[#1b3022] hover:text-white rounded text-xs font-semibold transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ORDER DETAILS & STATUS UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#18201b] rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto border shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono font-bold text-amber-700 text-sm">
                  Order #{selectedOrder.orderNumber}
                </span>
                <span className="text-slate-400 block text-[11px]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="p-3 bg-slate-50 dark:bg-neutral-900 rounded-xl space-y-1">
              <div><strong>Customer:</strong> {selectedOrder.customer.fullName} ({selectedOrder.customer.phone})</div>
              <div><strong>Address:</strong> {selectedOrder.customer.deliveryAddress}, {selectedOrder.customer.city}, {selectedOrder.customer.province}</div>
              {selectedOrder.customer.nearestLandmark && (
                <div><strong>Landmark:</strong> {selectedOrder.customer.nearestLandmark}</div>
              )}
              {selectedOrder.customer.deliveryInstructions && (
                <div className="text-amber-800"><strong>Instructions:</strong> {selectedOrder.customer.deliveryInstructions}</div>
              )}
            </div>

            {/* Itemized breakdown */}
            <div className="space-y-2 border-b pb-3">
              <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Purchased Items
              </span>
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100">
                  <div>
                    <span className="font-semibold block">{it.productName} × {it.quantity}</span>
                    {it.isCustomized && it.customizationDetails && (
                      <span className="text-[10px] text-amber-700">
                        Custom: "{it.customizationDetails.customTitle}" ({it.customizationDetails.size}, {it.customizationDetails.pageCount}p, {it.customizationDetails.ruling})
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-semibold">Rs. {it.totalPrice}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-1">
                <span>Grand Total:</span>
                <span className="font-mono text-sm text-[#1b3022]">Rs. {selectedOrder.grandTotal}</span>
              </div>
            </div>

            {/* Manage Form */}
            <form onSubmit={handleSaveOrderChanges} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order Status */}
                <div>
                  <label className="block font-semibold mb-1">Update Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Printing">Printing / In Workshop</option>
                    <option value="Ready for Dispatch">Ready for Dispatch</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Return Requested">Return Requested</option>
                    <option value="Returned">Returned</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block font-semibold mb-1">Update Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded"
                  >
                    <option value="Awaiting Verification">Awaiting Verification</option>
                    <option value="Verified">Verified (Payment Confirmed)</option>
                    <option value="Cash on Delivery">Cash on Delivery (Pending Courier Collection)</option>
                    <option value="Failed">Failed / Declined</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                {/* Courier Selection */}
                <div>
                  <label className="block font-semibold mb-1">Courier Partner</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded"
                  >
                    <option value="TCS Express">TCS Express</option>
                    <option value="Trax Logistics">Trax Logistics</option>
                    <option value="Leopard Courier">Leopard Courier</option>
                    <option value="PostEx">PostEx</option>
                    <option value="M&P Express">M&P Express</option>
                    <option value="Pakistan Post">Pakistan Post (Remote)</option>
                  </select>
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block font-semibold mb-1">Consignment / Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. 78291049210"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Add Internal Note or Reason</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Dispatched via TCS Mall Road branch. Verified JazzCash Trx."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b3022] text-white rounded font-semibold"
                >
                  Save Order Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
