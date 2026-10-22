import React, { useState } from 'react';
import { Layers, Plus, Minus, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { ProductService } from '../../services/productService.ts';
import { InventoryService } from '../../services/inventoryService.ts';
import { Product, InventoryMovement } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminInventory: React.FC = () => {
  const { showToast } = useApp();
  const [products, setProducts] = useState<Product[]>(() => ProductService.getProducts());
  const [movements, setMovements] = useState<InventoryMovement[]>(() =>
    InventoryService.getMovements()
  );

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [adjustmentChange, setAdjustmentChange] = useState<number>(20);
  const [reason, setReason] = useState<InventoryMovement['reason']>('Purchase');
  const [notes, setNotes] = useState('');

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const newStock = Math.max(0, prod.stockQuantity + adjustmentChange);
    ProductService.updateStock(prod.id, newStock);

    InventoryService.recordMovement({
      productId: prod.id,
      productName: prod.name,
      change: adjustmentChange,
      newStock,
      reason,
      notes: notes.trim() || undefined,
    });

    setProducts(ProductService.getProducts());
    setMovements(InventoryService.getMovements());
    setNotes('');
    showToast(`Stock updated for ${prod.name} (New count: ${newStock})`, 'success');
  };

  const lowStock = products.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 10));

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          Inventory Control & Stock Adjustments
        </h1>
        <p className="text-xs text-slate-500">
          Manage warehouse inventory, record raw notebook arrivals, and track damaged wastage
        </p>
      </div>

      {/* Stock Adjustment Form */}
      <form onSubmit={handleAdjustStock} className="p-5 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Record Stock In / Stock Out / Adjustment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold mb-1">Select Notebook Model *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Stock Adjustment (+ or -) *</label>
            <input
              type="number"
              required
              value={adjustmentChange}
              onChange={(e) => setAdjustmentChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded font-mono"
            />
            <span className="text-[10px] text-slate-400">
              Positive to add, negative (e.g. -5) to subtract
            </span>
          </div>

          <div>
            <label className="block font-semibold mb-1">Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded"
            >
              <option value="Purchase">Purchase (New Batch from Press)</option>
              <option value="Sale Order">Sale Order (Manual Sale)</option>
              <option value="Damaged / Waste">Damaged / Printing Waste</option>
              <option value="Adjustment">Physical Count Adjustment</option>
              <option value="Customer Return">Customer Return</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Reference Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Invoice #902, bindery test"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-[#1b3022] hover:bg-[#25422f] text-white rounded font-semibold transition-colors"
        >
          Record Stock Adjustment
        </button>
      </form>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Low Stock Products ({lowStock.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {lowStock.map((p) => (
              <div key={p.id} className="p-2 bg-white dark:bg-neutral-800 rounded border flex justify-between">
                <span className="font-medium truncate pr-1">{p.name}</span>
                <span className="font-mono font-bold text-rose-600 shrink-0">
                  {p.stockQuantity} left (Min: {p.lowStockThreshold})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movement Log */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
          Inventory Movement Log
        </h3>

        {movements.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No stock movements recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 border-b font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Change</th>
                  <th className="py-2.5 px-3">New Stock</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {movements.slice(0, 15).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-mono text-slate-500">
                      {new Date(m.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 font-semibold">{m.productName}</td>
                    <td className="py-2 px-3 font-mono font-bold">
                      <span className={m.change > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {m.change > 0 ? `+${m.change}` : m.change}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono">{m.newStock}</td>
                    <td className="py-2 px-3">{m.reason}</td>
                    <td className="py-2 px-3 text-slate-400">{m.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
