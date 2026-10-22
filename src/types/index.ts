export type NotebookSize = 'A4' | 'A5' | 'A6' | 'B5' | 'Custom';
export type PageCount = 60 | 100 | 160 | 200 | 300;
export type RulingType = 'Single Line' | 'Four Line' | 'Grid / Math' | 'Dotted' | 'Plain / Blank' | 'Accounting / Ledger' | 'Urdu / Right Margin';
export type BindingType = 'Hardcover Bound' | 'Spiral Wire-O' | 'Stitched & Taped Spine' | 'Softcover Saddle-Stitch' | 'Leatherette Executive';
export type PaperType = '70 GSM Premium Offset' | '80 GSM Ivory Book Paper' | '100 GSM Bleed-Proof' | '80 GSM Brown Kraft';
export type CoverFinish = 'Velvet Matte Lamination' | 'High Gloss Lamination' | 'Gold Foil Stamping' | 'Embossed Leather Texture' | 'Natural Kraft Card';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Printing'
  | 'Ready for Dispatch'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned'
  | 'Refund Pending'
  | 'Refunded';

export type PaymentStatus =
  | 'Awaiting Verification'
  | 'Verified'
  | 'Failed'
  | 'Refunded'
  | 'Cash on Delivery';

export type PaymentMethod = 'Cash on Delivery' | 'Bank Transfer' | 'JazzCash' | 'EasyPaisa' | 'SadaPay / Nayapay';

export type CustomDesignStatus =
  | 'Request Received'
  | 'Under Review'
  | 'Revision Requested'
  | 'Quotation Sent'
  | 'Awaiting Customer Approval'
  | 'Approved'
  | 'Rejected'
  | 'Converted to Order';

export interface ProductCategory {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  description: string;
  order: number;
  itemCount?: number;
}

export interface CustomizationOptionsConfig {
  allowCustomText: boolean;
  allowCustomSubtext: boolean;
  allowImageUpload: boolean;
  availableSizes: NotebookSize[];
  availablePageCounts: PageCount[];
  availableRulings: RulingType[];
  availableBindings: BindingType[];
  availablePaper: PaperType[];
  availableFinishes: CoverFinish[];
  allowFoilAccent: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameUrdu?: string;
  slug: string;
  description: string;
  descriptionUrdu?: string;
  categoryId: string;
  categoryName: string;
  coverImage: string;
  additionalImages?: string[];
  basePrice: number; // in PKR
  discountedPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  availableSizes: NotebookSize[];
  availablePageCounts: PageCount[];
  availableRulings: RulingType[];
  availableBindings: BindingType[];
  availablePaper: PaperType[];
  availableFinishes: CoverFinish[];
  isCustomizable: boolean;
  minOrderQuantity: number;
  estimatedProductionDays: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isActive: boolean;
  weightGrams?: number;
}

export interface NotebookCustomizationSelection {
  size: NotebookSize;
  pageCount: PageCount;
  ruling: RulingType;
  binding: BindingType;
  paperType: PaperType;
  coverFinish: CoverFinish;
  customTitle: string;
  customSubtitle?: string;
  coverColor: string;
  accentColor: string;
  fontStyle: 'classic' | 'modern' | 'urdu' | 'script';
  alignment: 'center' | 'left' | 'bottom-right';
  uploadedImageId?: string; // id in indexedDB or dataUrl
  uploadedImageUrl?: string;
  imageScale?: number;
  imagePositionX?: number;
  imagePositionY?: number;
  foilStampText: boolean;
  extraNotes?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  coverImageThumbnail: string;
  isCustomized: boolean;
  customization?: NotebookCustomizationSelection;
  snapshotPriceBreakdown: {
    basePrice: number;
    optionsSurcharge: number;
    customPrintingFee: number;
    unitTotal: number;
  };
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  province: string;
  city: string;
  deliveryAddress: string;
  nearestLandmark?: string;
  deliveryInstructions?: string;
  orderNotes?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  thumbnail: string;
  isCustomized: boolean;
  customizationDetails?: NotebookCustomizationSelection;
}

export interface ShippingRecord {
  courierName?: string;
  trackingNumber?: string;
  dispatchDate?: string;
  estimatedDeliveryDate?: string;
  shippingFee: number;
}

export interface PaymentRecord {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference?: string;
  paymentProofImageId?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. BN-2026-1042
  createdAt: string;
  updatedAt: string;
  customer: CustomerDetails;
  items: OrderItemSnapshot[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  status: OrderStatus;
  payment: PaymentRecord;
  shipping: ShippingRecord;
  internalNotes?: string;
  isBulkOrder?: boolean;
  orderSource: 'website' | 'whatsapp' | 'manual-quotation';
}

export interface CustomDesignRequest {
  id: string;
  requestId: string; // e.g. CDR-9081
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  organizationName?: string; // for schools/offices
  notebookType: string;
  size: NotebookSize;
  pageCount: PageCount;
  ruling: RulingType;
  binding: BindingType;
  paperType: PaperType;
  coverFinish: CoverFinish;
  estimatedQuantity: number;
  designBrief: string;
  referenceImages: string[]; // dataUrls or indexedDB keys
  status: CustomDesignStatus;
  quotation?: {
    quotedPricePerUnit: number;
    setupFee: number;
    shippingFee: number;
    grandTotalQuoted: number;
    estimatedProductionDays: number;
    validUntil: string;
    notes?: string;
    adminQuotedAt: string;
  };
  customerFeedback?: string;
  statusHistory: {
    status: CustomDesignStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  change: number; // positive for stock in, negative for order/damaged
  newStock: number;
  reason: 'Purchase' | 'Sale Order' | 'Damaged / Waste' | 'Adjustment' | 'Customer Return';
  date: string;
  referenceId?: string; // orderId or purchase invoice
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  city: string;
  itemsSupplied: string; // e.g. Paper reels, Spiral wire, Board
}

export interface ExpenseRecord {
  id: string;
  date: string;
  title: string;
  category: 'Raw Paper' | 'Printing Ink & Foil' | 'Binding Materials' | 'Courier Delivery' | 'Shop Maintenance' | 'Packaging';
  amount: number;
  paidTo?: string;
  notes?: string;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  fixedDiscount?: number;
  minOrderValue: number;
  isActive: boolean;
  expiresAt: string;
}

export interface ShopSettings {
  shopName: string;
  shopNameUrdu: string;
  tagline: string;
  taglineUrdu: string;
  whatsappNumber: string; // e.g. +923001234567
  contactPhone: string;
  contactEmail: string;
  address: string;
  currencySymbol: string;
  currencyCode: string;
  freeShippingThreshold: number;
  defaultFlatShippingFee: number;
  cityShippingRates: Record<string, number>;
  bankPaymentDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCity: string;
  };
  jazzCashDetails: {
    accountTitle: string;
    accountNumber: string;
  };
  easyPaisaDetails: {
    accountTitle: string;
    accountNumber: string;
  };
  sadaPayDetails: {
    accountTitle: string;
    accountNumber: string;
  };
  pricingRules: {
    customPrintBaseSurcharge: number;
    foilStampSurcharge: number;
    hardcoverSurcharge: number;
    leatheretteSurcharge: number;
    spiralSurcharge: number;
    paper100GsmSurcharge: number;
    bulkDiscounts: { minQty: number; discountPercent: number }[];
  };
  adminPin: string; // Demo client PIN for local dashboard
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  city: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  isVerifiedBuyer: boolean;
}
