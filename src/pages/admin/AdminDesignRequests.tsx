import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  X,
  Send,
  MessageCircle,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { CustomDesignService } from '../../services/customDesignService.ts';
import { OrderService } from '../../services/orderService.ts';
import { CustomDesignRequest, CustomDesignStatus } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminDesignRequests: React.FC = () => {
  const { settings, showToast } = useApp();
  const [requests, setRequests] = useState<CustomDesignRequest[]>(() =>
    CustomDesignService.getRequests()
  );

  const [selectedReq, setSelectedReq] = useState<CustomDesignRequest | null>(null);

  // Quotation fields
  const [quotedUnitPrice, setQuotedUnitPrice] = useState<number>(750);
  const [setupFee, setSetupFee] = useState<number>(200);
  const [shippingFee, setShippingFee] = useState<number>(200);
  const [productionDays, setProductionDays] = useState<number>(3);
  const [validDays, setValidDays] = useState<number>(7);
  const [quotationNotes, setQuotationNotes] = useState('');

  const handleOpenDetail = (req: CustomDesignRequest) => {
    setSelectedReq(req);
    if (req.quotation) {
      setQuotedUnitPrice(req.quotation.quotedPricePerUnit);
      setSetupFee(req.quotation.setupFee);
      setShippingFee(req.quotation.shippingFee);
      setProductionDays(req.quotation.estimatedProductionDays);
      setQuotationNotes(req.quotation.notes || '');
    } else {
      setQuotedUnitPrice(req.estimatedQuantity >= 50 ? 250 : 750);
      setSetupFee(req.estimatedQuantity >= 50 ? 500 : 200);
      setShippingFee(200);
      setProductionDays(3);
      setQuotationNotes('');
    }
  };

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    const grandTotalQuoted =
      quotedUnitPrice * selectedReq.estimatedQuantity + setupFee + shippingFee;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + validDays);

    const updated = CustomDesignService.provideQuotation(selectedReq.id, {
      quotedPricePerUnit: quotedUnitPrice,
      setupFee,
      shippingFee,
      grandTotalQuoted,
      estimatedProductionDays: productionDays,
      validUntil: expiryDate.toISOString().slice(0, 10),
      notes: quotationNotes.trim() || undefined,
      adminQuotedAt: new Date().toISOString(),
    });

    if (updated) {
      setRequests(CustomDesignService.getRequests());
      setSelectedReq(null);
      showToast(`Formal quotation issued for ${selectedReq.requestId}!`, 'success');
    }
  };

  const handleUpdateStatus = (id: string, st: CustomDesignStatus) => {
    CustomDesignService.updateStatus(id, st);
    setRequests(CustomDesignService.getRequests());
    if (selectedReq) {
      setSelectedReq(CustomDesignService.getRequestById(id) || null);
    }
    showToast(`Status updated to ${st}`, 'info');
  };

  const handleConvertToOrder = (req: CustomDesignRequest) => {
    if (!req.quotation) {
      showToast('Please issue a quotation first.', 'error');
      return;
    }

    const orderRes = OrderService.createOrder({
      customer: {
        fullName: req.customerName,
        phone: req.customerPhone,
        email: req.customerEmail,
        province: 'Pakistan',
        city: req.city,
        deliveryAddress: `As per custom brief for ${req.organizationName || req.customerName}`,
        orderNotes: req.designBrief,
      },
      items: [
        {
          id: `item-${Date.now()}`,
          productId: 'custom-quoted-notebook',
          productName: `Custom ${req.notebookType} (${req.size}, ${req.pageCount}p)`,
          productSku: `CDR-${req.requestId}`,
          unitPrice: req.quotation.quotedPricePerUnit,
          quantity: req.estimatedQuantity,
          coverImageThumbnail: req.referenceImages[0] || '',
          isCustomized: true,
          snapshotPriceBreakdown: {
            basePrice: req.quotation.quotedPricePerUnit,
            optionsSurcharge: 0,
            customPrintingFee: req.quotation.setupFee,
            unitTotal: req.quotation.quotedPricePerUnit,
          },
        },
      ],
      subtotal: req.quotation.quotedPricePerUnit * req.estimatedQuantity,
      shippingFee: req.quotation.shippingFee,
      discountAmount: 0,
      grandTotal: req.quotation.grandTotalQuoted,
      paymentMethod: 'Cash on Delivery',
      orderSource: 'manual-quotation',
      isBulkOrder: req.estimatedQuantity >= 25,
    });

    if (orderRes.success && orderRes.order) {
      CustomDesignService.updateStatus(
        req.id,
        'Converted to Order',
        `Converted to official order #${orderRes.order.orderNumber}`
      );
      setRequests(CustomDesignService.getRequests());
      setSelectedReq(null);
      showToast(`Design request converted to Order #${orderRes.order.orderNumber}!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          Workflow B: Custom Design Requests & Quotations
        </h1>
        <p className="text-xs text-slate-500">
          Review customer design briefs, artwork attachments, provide formal quotations, and convert to production orders.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-neutral-900 rounded-xl border text-xs text-slate-500">
          No custom design requests received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-white dark:bg-[#18201b] rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3 shadow-xs text-xs"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {req.requestId}
                </span>
                <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                  {req.status}
                </span>
              </div>

              <div>
                <strong className="text-slate-900 dark:text-white text-sm block">
                  {req.customerName} {req.organizationName ? `(${req.organizationName})` : ''}
                </strong>
                <span className="text-slate-500 font-mono">
                  {req.customerPhone} · {req.city}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-neutral-900 rounded space-y-1 text-[11px]">
                <div>
                  <strong>Format:</strong> {req.size} · {req.pageCount} Pages · {req.binding}
                </div>
                <div>
                  <strong>Quantity:</strong> {req.estimatedQuantity} units
                </div>
                <div>
                  <strong>Ruling & Finish:</strong> {req.ruling} · {req.coverFinish}
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 line-clamp-2 italic text-[11px]">
                "{req.designBrief}"
              </p>

              {req.quotation && (
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded flex justify-between items-center text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
                  <span>Quoted: Rs. {req.quotation.grandTotalQuoted}</span>
                  <span>Valid until: {req.quotation.validUntil}</span>
                </div>
              )}

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleOpenDetail(req)}
                  className="px-3 py-1 bg-[#1b3022] text-white rounded text-xs font-semibold hover:bg-[#284934]"
                >
                  Review & Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL & QUOTE MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#18201b] rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto border shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono font-bold text-amber-700 text-sm">
                  {selectedReq.requestId} · {selectedReq.customerName}
                </span>
                <span className="text-slate-400 block text-[11px]">
                  Submitted on {new Date(selectedReq.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedReq(null)} className="p-1">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Design Brief details */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider block">Customer Design Brief</span>
              <p className="p-3 bg-slate-50 dark:bg-neutral-900 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedReq.designBrief}
              </p>
            </div>

            {/* Uploaded Reference Images */}
            {selectedReq.referenceImages.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider block">Uploaded Reference Artwork</span>
                <div className="flex flex-wrap gap-2">
                  {selectedReq.referenceImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Ref"
                      className="w-20 h-20 object-cover rounded border"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Status change buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
              <span className="font-bold">Change Status:</span>
              {(['Under Review', 'Revision Requested', 'Approved', 'Rejected'] as CustomDesignStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedReq.id, st)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium"
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            {/* Issue Formal Quotation Form */}
            <form onSubmit={handleSendQuotation} className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Issue / Update Formal Quotation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price per Notebook (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={quotedUnitPrice}
                    onChange={(e) => setQuotedUnitPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Design & Setup Fee (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={setupFee}
                    onChange={(e) => setSetupFee(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Shipping Fee (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={shippingFee}
                    onChange={(e) => setShippingFee(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Est. Production Days</label>
                  <input
                    type="number"
                    min={1}
                    value={productionDays}
                    onChange={(e) => setProductionDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Quote Valid For (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={validDays}
                    onChange={(e) => setValidDays(parseInt(e.target.value) || 7)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Grand Total Quoted</label>
                  <div className="py-2 font-mono font-bold text-sm text-[#1b3022]">
                    Rs. {quotedUnitPrice * selectedReq.estimatedQuantity + setupFee + shippingFee}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Quotation Notes / Terms</label>
                <input
                  type="text"
                  value={quotationNotes}
                  onChange={(e) => setQuotationNotes(e.target.value)}
                  placeholder="e.g. Includes custom die-cast gold foil block and 80 GSM paper..."
                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border rounded"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1b3022] text-white rounded font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Quotation</span>
                </button>

                {selectedReq.quotation && (
                  <button
                    type="button"
                    onClick={() => handleConvertToOrder(selectedReq)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Convert to Confirmed Order</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
