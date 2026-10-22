import {
  Order,
  OrderStatus,
  PaymentStatus,
  ShippingRecord,
  PaymentRecord,
  CustomerDetails,
  CartItem,
  OrderItemSnapshot,
} from '../types/index.ts';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';
import { ProductService } from './productService.ts';
import { InventoryService } from './inventoryService.ts';
import { FirestoreService } from '../firebase/firestoreService.ts';

export class OrderService {
  static getOrders(): Order[] {
    return LocalStorageUtil.get<Order[]>(StorageKeys.ORDERS, []);
  }

  static saveOrders(orders: Order[]): boolean {
    return LocalStorageUtil.set(StorageKeys.ORDERS, orders);
  }

  static getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  static lookupOrder(orderNumber: string, phone: string): Order | undefined {
    const cleanNumber = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    return this.getOrders().find((o) => {
      const matchNumber = o.orderNumber.toUpperCase() === cleanNumber;
      const oPhone = o.customer.phone.replace(/[^0-9]/g, '');
      const matchPhone = oPhone.endsWith(cleanPhone.slice(-7)) || cleanPhone.endsWith(oPhone.slice(-7));
      return matchNumber && matchPhone;
    });
  }

  static generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BN-${year}-${random}`;
  }

  static createOrder(params: {
    customer: CustomerDetails;
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    couponCode?: string;
    grandTotal: number;
    paymentMethod: PaymentRecord['method'];
    transactionReference?: string;
    paymentProofImageId?: string;
    orderSource?: 'website' | 'whatsapp' | 'manual-quotation';
    isBulkOrder?: boolean;
  }): { success: boolean; order?: Order; error?: string } {
    if (!params.items || params.items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Freeze snapshots of items
    const itemSnapshots: OrderItemSnapshot[] = params.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.productSku,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.unitPrice * item.quantity,
      thumbnail: item.coverImageThumbnail,
      isCustomized: item.isCustomized,
      customizationDetails: item.customization,
    }));

    const now = new Date().toISOString();
    const orderNumber = this.generateOrderNumber();
    const id = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const initialPaymentStatus: PaymentStatus =
      params.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Awaiting Verification';

    const newOrder: Order = {
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      customer: params.customer,
      items: itemSnapshots,
      subtotal: params.subtotal,
      shippingFee: params.shippingFee,
      discountAmount: params.discountAmount,
      couponCode: params.couponCode,
      grandTotal: params.grandTotal,
      status: 'Pending',
      payment: {
        method: params.paymentMethod,
        status: initialPaymentStatus,
        transactionReference: params.transactionReference,
        paymentProofImageId: params.paymentProofImageId,
      },
      shipping: {
        shippingFee: params.shippingFee,
      },
      isBulkOrder: params.isBulkOrder || false,
      orderSource: params.orderSource || 'website',
    };

    // Deduct stock for non-custom bulk items
    params.items.forEach((item) => {
      const prod = ProductService.getProductById(item.productId);
      if (prod && prod.stockQuantity !== undefined) {
        const updatedQty = Math.max(0, prod.stockQuantity - item.quantity);
        ProductService.updateStock(item.productId, updatedQty);
        InventoryService.recordMovement({
          productId: item.productId,
          productName: item.productName,
          change: -item.quantity,
          newStock: updatedQty,
          reason: 'Sale Order',
          referenceId: orderNumber,
          notes: `Customer Order #${orderNumber}`,
        });
      }
    });

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Persist to shared Firestore database
    FirestoreService.createOrder(newOrder).catch((err) => {
      console.warn('Could not sync order to Firestore immediately:', err);
    });

    return { success: true, order: newOrder };
  }

  static updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    if (note) {
      orders[index].internalNotes = (orders[index].internalNotes ? orders[index].internalNotes + '\n' : '') + note;
    }
    this.saveOrders(orders);
    return orders[index];
  }

  static updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    verifiedBy = 'Admin'
  ): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index].payment.status = paymentStatus;
    if (paymentStatus === 'Verified') {
      orders[index].payment.verifiedAt = new Date().toISOString();
      orders[index].payment.verifiedBy = verifiedBy;
    }
    orders[index].updatedAt = new Date().toISOString();
    this.saveOrders(orders);
    return orders[index];
  }

  static updateShippingInfo(orderId: string, shipping: Partial<ShippingRecord>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index].shipping = { ...orders[index].shipping, ...shipping };
    orders[index].updatedAt = new Date().toISOString();
    this.saveOrders(orders);
    return orders[index];
  }
}
