import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Truck, RotateCcw, ShieldCheck, FileText } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-600" />
          <span>Shipping & Delivery Policy</span>
        </h1>
        <p className="text-slate-500 mt-1">Reliable nationwide fulfillment across Pakistan</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">1. Delivery Zones & Couriers</h3>
        <p>
          We deliver to all cities, tehsils, and remote regions across Pakistan via established courier partners including TCS, Trax Logistics, Leopard Courier, PostEx, and Pakistan Post.
        </p>

        <h3 className="font-bold text-slate-800 dark:text-white text-sm">2. Delivery Charges</h3>
        <p>
          Delivery charges are calculated transparently at checkout based on your destination city. Standard flat rates start from Rs. 180 for Lahore, Rs. 200–220 for major metropolitan centers (Karachi, Islamabad, Rawalpindi, Faisalabad, Multan), and Rs. 260–290 for other districts and remote towns across Pakistan.
        </p>

        <h3 className="font-bold text-slate-800 dark:text-white text-sm">3. Production & Delivery Timelines</h3>
        <p>
          Ready-made notebooks are dispatched within 24 hours. Custom personalized notebooks requiring artwork printing and foil stamping require 1 to 2 business days of craftsmanship prior to courier pickup. Transit time is typically 2–3 business days.
        </p>
      </div>
    </div>
  );
};

export const ReturnsPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-600" />
          <span>Returns & Custom Order Policy</span>
        </h1>
        <p className="text-slate-500 mt-1">Our commitment to quality stationery</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">1. Personalized & Custom Notebooks</h3>
        <p>
          Because personalized notebooks are manufactured with the customer's unique name, logo, or photos, they cannot be restocked or returned for change of mind.
        </p>

        <h3 className="font-bold text-slate-800 dark:text-white text-sm">2. Manufacturing Defects & Transit Damage</h3>
        <p>
          If your notebook arrives with a printing defect, damaged spine, or incorrect spelling due to our error, we will promptly re-print and dispatch a replacement free of charge. Please notify us on WhatsApp with unboxing photos within 48 hours of delivery.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>Privacy & Customer Data Policy</span>
        </h1>
        <p className="text-slate-500 mt-1">How your information is handled</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">1. Customer Privacy</h3>
        <p>
          Customer contact details and addresses are used exclusively for parcel delivery and order confirmation. We do not sell or share customer lists with third-party advertisers.
        </p>

        <h3 className="font-bold text-slate-800 dark:text-white text-sm">2. Uploaded Photos & Artwork</h3>
        <p>
          Personal photos and school monograms uploaded for notebook cover customization are used strictly for printing your requested units and are never used in marketing without prior written permission.
        </p>

        <h3 className="font-bold text-slate-800 dark:text-white text-sm">3. Local-First Application Storage Notice</h3>
        <p>
          In this local prototype version, order records and customer sessions are stored directly in your local browser storage (LocalStorage & IndexedDB).
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { settings } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>Terms & Conditions</span>
        </h1>
        <p className="text-slate-500 mt-1">General terms governing purchases on {settings.shopName}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">1. Acceptance of Terms</h3>
        <p>
          By placing an order via our online store or WhatsApp channel, you agree to these terms, pricing, and production specifications.
        </p>

        <h3 className="font-bold text-slate-800 dark:text-white text-sm">2. Visual Mockups vs. Production Print</h3>
        <p>
          The 3D canvas customizer generates a visual representation of cover art and layout. Actual production print may have minor RGB-to-CMYK color space shifts, bleed trims, and foil stamping texture intrinsic to artisanal bookbinding.
        </p>
      </div>
    </div>
  );
};
