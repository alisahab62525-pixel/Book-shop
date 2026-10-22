import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';
import { initialProducts, initialCategories, initialSettings, initialSuppliers, initialExpenses, initialCoupons } from '../data/initialData.ts';

export interface AppBackupData {
  version: number;
  exportedAt: string;
  source: string;
  settings?: any;
  products?: any[];
  categories?: any[];
  orders?: any[];
  designRequests?: any[];
  inventoryMovements?: any[];
  suppliers?: any[];
  expenses?: any[];
  coupons?: any[];
}

export class BackupService {
  static exportFullBackup(): string {
    const backup: AppBackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      source: 'Beyond Notebooks Pakistan Local System',
      settings: LocalStorageUtil.get(StorageKeys.SETTINGS, null),
      products: LocalStorageUtil.get(StorageKeys.PRODUCTS, []),
      categories: LocalStorageUtil.get(StorageKeys.CATEGORIES, []),
      orders: LocalStorageUtil.get(StorageKeys.ORDERS, []),
      designRequests: LocalStorageUtil.get(StorageKeys.DESIGN_REQUESTS, []),
      inventoryMovements: LocalStorageUtil.get(StorageKeys.INVENTORY_MOVEMENTS, []),
      suppliers: LocalStorageUtil.get(StorageKeys.SUPPLIERS, []),
      expenses: LocalStorageUtil.get(StorageKeys.EXPENSES, []),
      coupons: LocalStorageUtil.get(StorageKeys.COUPONS, []),
    };

    return JSON.stringify(backup, null, 2);
  }

  static downloadJSONFile(jsonString: string, filename = 'beyond-notebooks-backup.json'): void {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static validateBackupJSON(jsonString: string): { valid: boolean; summary?: string; data?: AppBackupData; error?: string } {
    try {
      const parsed = JSON.parse(jsonString) as AppBackupData;
      if (!parsed || typeof parsed !== 'object') {
        return { valid: false, error: 'JSON payload is not an object.' };
      }

      const productsCount = Array.isArray(parsed.products) ? parsed.products.length : 0;
      const ordersCount = Array.isArray(parsed.orders) ? parsed.orders.length : 0;
      const designRequestsCount = Array.isArray(parsed.designRequests) ? parsed.designRequests.length : 0;

      const summary = `Backup from ${parsed.exportedAt || 'Unknown date'}: Contains ${productsCount} products, ${ordersCount} orders, and ${designRequestsCount} design requests.`;

      return { valid: true, summary, data: parsed };
    } catch (e: any) {
      return { valid: false, error: e?.message || 'Invalid JSON format.' };
    }
  }

  static restoreBackup(backup: AppBackupData): boolean {
    try {
      if (backup.settings) LocalStorageUtil.set(StorageKeys.SETTINGS, backup.settings);
      if (Array.isArray(backup.products)) LocalStorageUtil.set(StorageKeys.PRODUCTS, backup.products);
      if (Array.isArray(backup.categories)) LocalStorageUtil.set(StorageKeys.CATEGORIES, backup.categories);
      if (Array.isArray(backup.orders)) LocalStorageUtil.set(StorageKeys.ORDERS, backup.orders);
      if (Array.isArray(backup.designRequests)) LocalStorageUtil.set(StorageKeys.DESIGN_REQUESTS, backup.designRequests);
      if (Array.isArray(backup.inventoryMovements)) LocalStorageUtil.set(StorageKeys.INVENTORY_MOVEMENTS, backup.inventoryMovements);
      if (Array.isArray(backup.suppliers)) LocalStorageUtil.set(StorageKeys.SUPPLIERS, backup.suppliers);
      if (Array.isArray(backup.expenses)) LocalStorageUtil.set(StorageKeys.EXPENSES, backup.expenses);
      if (Array.isArray(backup.coupons)) LocalStorageUtil.set(StorageKeys.COUPONS, backup.coupons);
      return true;
    } catch {
      return false;
    }
  }

  static resetToDefaultDemoData(): void {
    LocalStorageUtil.set(StorageKeys.SETTINGS, initialSettings);
    LocalStorageUtil.set(StorageKeys.PRODUCTS, initialProducts);
    LocalStorageUtil.set(StorageKeys.CATEGORIES, initialCategories);
    LocalStorageUtil.set(StorageKeys.ORDERS, []);
    LocalStorageUtil.set(StorageKeys.DESIGN_REQUESTS, []);
    LocalStorageUtil.set(StorageKeys.INVENTORY_MOVEMENTS, []);
    LocalStorageUtil.set(StorageKeys.SUPPLIERS, initialSuppliers);
    LocalStorageUtil.set(StorageKeys.EXPENSES, initialExpenses);
    LocalStorageUtil.set(StorageKeys.COUPONS, initialCoupons);
    LocalStorageUtil.remove(StorageKeys.CART);
    LocalStorageUtil.remove(StorageKeys.WISHLIST);
  }

  static exportOrdersCSV(orders: any[]): void {
    if (!orders || orders.length === 0) return;
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Status', 'Payment Method', 'Payment Status', 'Grand Total (PKR)'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${(o.customer?.fullName || '').replace(/"/g, '""')}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.city || ''}"`,
      o.status,
      o.payment?.method || '',
      o.payment?.status || '',
      o.grandTotal,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
