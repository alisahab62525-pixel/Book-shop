import React, { useState } from 'react';
import { DollarSign, Plus, Building2, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { LocalStorageUtil, StorageKeys } from '../../utils/storage.ts';
import { Supplier, ExpenseRecord } from '../../types/index.ts';
import { initialSuppliers, initialExpenses } from '../../data/initialData.ts';
import { OrderService } from '../../services/orderService.ts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminFinance: React.FC = () => {
  const { showToast } = useApp();

  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    LocalStorageUtil.get<Supplier[]>(StorageKeys.SUPPLIERS, initialSuppliers)
  );

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() =>
    LocalStorageUtil.get<ExpenseRecord[]>(StorageKeys.EXPENSES, initialExpenses)
  );

  const orders = OrderService.getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const estimatedProfit = totalRevenue - totalExpenses;

  // Add Expense form state
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseRecord['category']>('Raw Paper');
  const [expensePaidTo, setExpensePaidTo] = useState('');

  // Add Supplier form state
  const [supplierName, setSupplierName] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierCity, setSupplierCity] = useState('');
  const [supplierItems, setSupplierItems] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || expenseAmount <= 0) return;

    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: expenseAmount,
      paidTo: expensePaidTo.trim() || undefined,
    };

    const updated = [newExp, ...expenses];
    LocalStorageUtil.set(StorageKeys.EXPENSES, updated);
    setExpenses(updated);
    setExpenseTitle('');
    setExpenseAmount(0);
    setExpensePaidTo('');
    showToast('Expense recorded', 'success');
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim()) return;

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: supplierName.trim(),
      contactPerson: supplierContact.trim(),
      phone: supplierPhone.trim(),
      city: supplierCity.trim() || 'Lahore',
      itemsSupplied: supplierItems.trim() || 'Paper & Board',
    };

    const updated = [...suppliers, newSup];
    LocalStorageUtil.set(StorageKeys.SUPPLIERS, updated);
    setSuppliers(updated);
    setSupplierName('');
    setSupplierContact('');
    setSupplierPhone('');
    setSupplierCity('');
    setSupplierItems('');
    showToast('Supplier added', 'success');
  };

  return (
    <div className="space-y-8 text-xs">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          Financial Management & Suppliers
        </h1>
        <p className="text-slate-500">
          Track workshop paper expenses, foil costs, courier charges, and supplier directories
        </p>
      </div>

      {/* Financial Health KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[11px]">Total Recorded Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">From {orders.length} orders</div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[11px]">Total Workshop Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            Rs. {totalExpenses.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Raw materials & couriers</div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[11px]">Estimated Net Profit</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className={`text-2xl font-bold font-mono ${estimatedProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            Rs. {estimatedProfit.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Based on local ledger</div>
        </div>
      </div>

      {/* Expenses & Record Form */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Workshop Expenses
          </h2>
        </div>

        <form onSubmit={handleAddExpense} className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Expense Title *</label>
            <input
              type="text"
              required
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              placeholder="e.g. 50 reams 80 GSM ivory paper"
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value as any)}
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded"
            >
              <option value="Raw Paper">Raw Paper</option>
              <option value="Printing Ink & Foil">Printing Ink & Foil</option>
              <option value="Binding Materials">Binding Materials</option>
              <option value="Courier Delivery">Courier Delivery</option>
              <option value="Packaging">Packaging</option>
              <option value="Shop Maintenance">Shop Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Amount (PKR) *</label>
            <input
              type="number"
              min={1}
              required
              value={expenseAmount || ''}
              onChange={(e) => setExpenseAmount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#1b3022] text-white rounded font-semibold"
          >
            Add Expense
          </button>
        </form>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 border-b font-semibold uppercase">
              <tr>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Paid To</th>
                <th className="py-2 px-3 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{exp.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{exp.title}</td>
                  <td className="py-2.5 px-3 text-slate-600">{exp.category}</td>
                  <td className="py-2.5 px-3 text-slate-500">{exp.paidTo || '—'}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    Rs. {exp.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suppliers Section */}
      <div className="space-y-4 pt-4 border-t">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Raw Material Suppliers
        </h2>

        <form onSubmit={handleAddSupplier} className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block font-semibold mb-1">Supplier / Mill Name *</label>
            <input
              type="text"
              required
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="e.g. Century Paper Mills"
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Person</label>
            <input
              type="text"
              value={supplierContact}
              onChange={(e) => setSupplierContact(e.target.value)}
              placeholder="e.g. Tariq Mehmood"
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              value={supplierPhone}
              onChange={(e) => setSupplierPhone(e.target.value)}
              placeholder="042 35712345"
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Items Supplied</label>
            <input
              type="text"
              value={supplierItems}
              onChange={(e) => setSupplierItems(e.target.value)}
              placeholder="80 GSM Paper, Spiral Coils..."
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#1b3022] text-white rounded font-semibold"
          >
            Add Supplier
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suppliers.map((s) => (
            <div key={s.id} className="p-4 bg-white dark:bg-neutral-800 rounded-xl border space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">{s.name}</span>
              <div className="text-slate-500 font-mono text-[11px]">{s.phone} · {s.city}</div>
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                {s.itemsSupplied}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
