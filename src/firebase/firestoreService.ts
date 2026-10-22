import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config.ts';
import {
  Product,
  ProductCategory,
  Order,
  CustomDesignRequest,
  ShopSettings,
} from '../types/index.ts';
import {
  initialProducts,
  initialCategories,
  initialSettings,
} from '../data/initialData.ts';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';

export class FirestoreService {
  // ----------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------
  static async getProducts(): Promise<Product[]> {
    const path = 'products';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        // Auto-seed initial catalog if Firestore is fresh
        await this.seedInitialProducts();
        return initialProducts;
      }
      const list: Product[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      // Cache to local storage
      LocalStorageUtil.set(StorageKeys.PRODUCTS, list);
      return list;
    } catch (err) {
      console.warn('Firestore getProducts offline, using local cache:', err);
      return LocalStorageUtil.get<Product[]>(StorageKeys.PRODUCTS, initialProducts);
    }
  }

  static async seedInitialProducts(): Promise<void> {
    try {
      for (const prod of initialProducts) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      for (const cat of initialCategories) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      await setDoc(doc(db, 'shopSettings', 'main'), initialSettings);
    } catch (e) {
      console.warn('Could not seed Firestore (might be read-only):', e);
    }
  }

  static async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const path = 'products';
    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newProduct: Product = { id: newId, ...productData };
    try {
      await setDoc(doc(db, path, newId), {
        ...newProduct,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return newProduct;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `${path}/${newId}`);
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const path = `products/${id}`;
    try {
      await updateDoc(doc(db, 'products', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  // ----------------------------------------------------
  // ORDERS
  // ----------------------------------------------------
  static async getOrders(): Promise<Order[]> {
    const path = 'orders';
    try {
      const snap = await getDocs(collection(db, path));
      const list: Order[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      LocalStorageUtil.set(StorageKeys.ORDERS, list);
      return list;
    } catch (err) {
      console.warn('Firestore getOrders offline or unauthorized, reading local cache:', err);
      return LocalStorageUtil.get<Order[]>(StorageKeys.ORDERS, []);
    }
  }

  static async createOrder(order: Order): Promise<Order> {
    const path = 'orders';
    try {
      // Concurrency-safe stock adjustment with transaction
      await runTransaction(db, async (transaction) => {
        // Adjust product stock if non-custom
        for (const it of order.items) {
          const prodRef = doc(db, 'products', it.productId);
          const prodSnap = await transaction.get(prodRef);
          if (prodSnap.exists()) {
            const currentStock = prodSnap.data().stockQuantity || 0;
            transaction.update(prodRef, {
              stockQuantity: Math.max(0, currentStock - it.quantity),
            });
          }
        }
        // Save order document
        const orderRef = doc(db, path, order.id);
        transaction.set(orderRef, {
          ...order,
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: order.updatedAt || new Date().toISOString(),
        });
      });

      // Also save locally
      const local = LocalStorageUtil.get<Order[]>(StorageKeys.ORDERS, []);
      LocalStorageUtil.set(StorageKeys.ORDERS, [order, ...local]);
      return order;
    } catch (err) {
      // Fallback: save to local storage if Firestore write fails
      console.warn('Firestore order write error, saving locally:', err);
      const local = LocalStorageUtil.get<Order[]>(StorageKeys.ORDERS, []);
      LocalStorageUtil.set(StorageKeys.ORDERS, [order, ...local]);
      return order;
    }
  }

  static async lookupOrder(orderNumber: string, phone: string): Promise<Order | undefined> {
    const path = 'orders';
    const cleanNumber = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    try {
      // Query by orderNumber
      const q = query(collection(db, path), where('orderNumber', '==', cleanNumber));
      const snap = await getDocs(q);
      if (!snap.empty) {
        for (const d of snap.docs) {
          const o = { id: d.id, ...(d.data() as any) } as Order;
          const oPhone = (o.customer.phone || '').replace(/[^0-9]/g, '');
          if (oPhone.endsWith(cleanPhone.slice(-7)) || cleanPhone.endsWith(oPhone.slice(-7))) {
            return o;
          }
        }
      }
    } catch (err) {
      console.warn('Firestore lookup error, checking local store:', err);
    }

    // Local fallback
    const local = LocalStorageUtil.get<Order[]>(StorageKeys.ORDERS, []);
    return local.find((o) => {
      const matchNumber = o.orderNumber.toUpperCase() === cleanNumber;
      const oPhone = o.customer.phone.replace(/[^0-9]/g, '');
      return matchNumber && (oPhone.endsWith(cleanPhone.slice(-7)) || cleanPhone.endsWith(oPhone.slice(-7)));
    });
  }

  static async updateOrderStatus(orderId: string, status: Order['status'], note?: string): Promise<void> {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        internalNotes: note || '',
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async updateOrderPayment(orderId: string, payment: Order['payment']): Promise<void> {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        payment,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  static async updateOrderShipping(orderId: string, shipping: Order['shipping']): Promise<void> {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        shipping,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  // ----------------------------------------------------
  // DESIGN REQUESTS (WORKFLOW B)
  // ----------------------------------------------------
  static async getDesignRequests(): Promise<CustomDesignRequest[]> {
    const path = 'designRequests';
    try {
      const snap = await getDocs(collection(db, path));
      const list: CustomDesignRequest[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      LocalStorageUtil.set(StorageKeys.DESIGN_REQUESTS, list);
      return list;
    } catch (err) {
      console.warn('Firestore designRequests offline, reading local cache:', err);
      return LocalStorageUtil.get<CustomDesignRequest[]>(StorageKeys.DESIGN_REQUESTS, []);
    }
  }

  static async createDesignRequest(req: CustomDesignRequest): Promise<CustomDesignRequest> {
    const path = 'designRequests';
    try {
      await setDoc(doc(db, path, req.id), {
        ...req,
        createdAt: req.createdAt || new Date().toISOString(),
        updatedAt: req.updatedAt || new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not write design request to Firestore, saving locally:', err);
    }
    const local = LocalStorageUtil.get<CustomDesignRequest[]>(StorageKeys.DESIGN_REQUESTS, []);
    LocalStorageUtil.set(StorageKeys.DESIGN_REQUESTS, [req, ...local]);
    return req;
  }

  static async updateDesignRequest(id: string, updates: Partial<CustomDesignRequest>): Promise<void> {
    const path = `designRequests/${id}`;
    try {
      await updateDoc(doc(db, 'designRequests', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}
