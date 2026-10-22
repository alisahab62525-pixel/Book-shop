# Beyond Notebooks — Custom Notebook Printing & Stationery Platform (Pakistan)

A dedicated, mobile-first e-commerce and shop management system designed specifically for the Pakistani customized notebook, school copies, accounting registers, and personalized stationery market.

---

## 📖 Key Features & Architecture

### 1. Dedicated Notebook Catalog & Taxonomy
- **School Copies:** Urdu broad line, English four-line, and Math square grid exercise copies.
- **Accounting & Office Registers:** Heavyweight hardbound, marbled covers, and hand-stitched spines for Pakistani business ledgers.
- **Personalized & Foil-Stamped Journals:** Custom titles, Urdu calligraphy in Nastaliq, and hot gold foil effects.
- **Wire-O Spiral Notebooks:** Lay-flat twin-loop spiral bound notebooks.
- **Institutional Bulk Orders:** Wholesale tiered pricing for schools, colleges, and corporate gifts.

### 2. Dual Customization Workflows
- **Workflow A (Instant Customization Studio):**
  - Choose size (A4, A5, A6, B5), page count (60, 100, 160, 200, 300), binding style, paper grade (70 GSM, 80 GSM Ivory, 100 GSM Bleed-Proof), and cover finishes.
  - Live 3D Cover Mockup with front, back, and inner ruling previews.
  - Image/monogram upload with scale, position, and gold foil stamping controls.
  - Real-time dynamic price calculation based on configurable surcharges and bulk discounts.
- **Workflow B (Artisanal Custom Design Request):**
  - Customer provides design brief, uploads reference artwork, and submits an inquiry.
  - Generates a unique Request ID (e.g., `CDR-9081`).
  - Shop administrator reviews reference images in the Admin portal, issues a formal quotation with expiry and production timeline.
  - Quotation can be approved and converted into an official order.

### 3. Pakistani Localized Payment & Shipping
- **Cash on Delivery (COD):** Available across Pakistan.
- **Manual Advance Payment:** Official payment instructions for **Meezan Bank Ltd**, **JazzCash**, **EasyPaisa**, and **SadaPay** with transaction ID logging and payment screenshot upload. Status remains `"Awaiting Verification"` until verified by shop admin.
- **Nationwide Delivery:** Flat and city-specific delivery rates (Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Sialkot, etc.). Free delivery for orders above the configurable threshold (default Rs. 2,500).
- **Courier Tracking:** Admin can assign courier names (TCS, Leopard, Trax, PostEx) and consignment tracking numbers.

### 4. Direct WhatsApp Integration
- Pre-formatted `wa.me` links for quick ordering, quote inquiries, and customer support with exact notebook specifications pre-filled.

### 5. English & Urdu Bilingual Interface
- Seamless one-click toggle between English and Urdu (اردو) with right-to-left (RTL) support and Nastaliq typography.

### 6. Comprehensive Shop Administration Portal
- Protected local demo dashboard with default PIN `1234`.
- **Product Management:** Full CRUD, image URLs, categories, customizability flags, and pricing.
- **Order Management:** Status progression (Pending, Confirmed, Printing, Shipped, Delivered), receipt printing, and CSV export.
- **Design Requests:** Formal quotation engine and order conversion.
- **Inventory Control:** Stock-in, stock-out, low-stock alerts, and movement logs.
- **Finance & Suppliers:** Mill suppliers, raw paper expenses, and estimated net profit reports.
- **Settings:** Configurable shop branding, WhatsApp number, bank details, city rates, and pricing formulas.
- **Backup & Restore:** Full JSON snapshot export and schema-validated restore.

---

## 💾 Storage Architecture & Local-First Limitations

To avoid blowing browser `localStorage` quotas (typically ~5MB) with user-uploaded high-resolution artwork and photos:
- **LocalStorage:** Stores application metadata, products, categories, cart, orders, settings, and movements.
- **IndexedDB (`BeyondNotebooksDB`):** Stores heavy binary data (uploaded photos, customer receipts, artwork previews).

### ⚠️ Local-First Prototype Limitations
1. **Device-Specific Storage:** Records live in the current browser. Two distinct devices or incognito windows do not share live state.
2. **Local Payment Verification:** Manual payment records represent client-submitted claims and require shop verification.
3. **Admin Authentication:** Client-side PIN protection is designed for prototype evaluation and does not replace secure server-side session authentication.

---

## 🚀 Future Production Backend Migration Roadmap

To transition this local-first architecture to a multi-tenant cloud application:
1. **API Layer:** Replace `src/services/` LocalStorage calls with REST or GraphQL endpoints backed by Node.js/Express.
2. **Database:** Deploy PostgreSQL via Cloud SQL or Firestore for shared real-time persistence.
3. **Cloud Storage:** Route customer image uploads directly to Google Cloud Storage or S3 with pre-signed URLs.
4. **Authentication:** Implement Firebase Authentication or OAuth for role-based admin and customer profiles.
5. **Couriers & Payments:** Connect live courier APIs (TCS, Trax, PostEx) and payment gateways (PayFast, Safepay, JazzCash Merchant API).
