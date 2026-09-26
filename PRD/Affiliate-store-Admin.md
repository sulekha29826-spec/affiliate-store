# Product Requirements Document
## SastaBazar — Admin Panel

**Version:** 1.0
**Date:** September 24, 2026
**Stack:** React JS (frontend) · Firebase Realtime Database + Firebase Authentication (backend) · Cloudflare Pages (hosting)

---

## 0. Architecture Decision: Two Separate Apps

This PRD covers **only the admin panel** as its own standalone React app, entirely separate from the public storefront (which has its own PRD: `PRD-Website.md`).

**Reasoning:**
- Admin code (product forms, analytics, user management) never ships to public visitors — nothing to inspect in the storefront's bundle
- Independent deploy cycles — admin changes never risk breaking the live storefront
- Cleaner security boundary — this app is the only one with write access to the catalog
- Both apps share the **same Firebase project** — this app just uses more of it (full CRUD + Auth)

Deployed as its own Cloudflare Pages project: `sastabazar-admin.pages.dev`, later moved to a subdomain like `admin.sastabazar.com` once the real domain is bought. Add `robots.txt: Disallow: /` and a `noindex` meta tag to this app — it should never appear in search results. This is a hygiene measure, not the real security boundary; the real boundary is Firebase Auth + rules below.

---

## 1. Executive Summary

The admin panel is where the site owner (and optionally sub-admins) manage every piece of content that the public storefront displays: products, categories, homepage banners, and site settings — plus visibility into which products are getting clicked. No code changes or redeploys needed for day-to-day catalog updates.

---

## 2. Goals

- Add/edit/deactivate a product in under a minute, from a phone
- **Platform-agnostic:** the product form must let the admin attach an affiliate link from *any* platform — Amazon, Flipkart, Myntra, Meesho, Ajio, or anything else — not a hardcoded list. `platform` is a free-text/select-with-custom-option field, purely for the storefront's badge display; the actual commission source is whatever `affiliateLink` points to
- Role-based access — a regular Editor can't create other admins or change site-wide settings
- Give the owner enough click-analytics visibility to know which products are actually earning commission

---

## 3. User Roles

| Role | Access |
|---|---|
| **Editor (Admin)** | Manage products, categories, banners; view analytics |
| **Super Admin** | Everything Editor can do + manage other admin accounts, site settings |

Roles are stored server-side in `/admins/{uid}/role` — never trust a client-side role flag alone (see Section 6.1).

---

## 4. Tech Stack & Architecture

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | React 18 + Vite | Same base stack as the storefront, different app |
| Styling | Tailwind CSS | Functional/dense — admin UI doesn't need Flipkart theming, a clean neutral UI (grays + one accent color) is fine and faster to build |
| Routing | React Router v6, all routes behind an auth guard | Nothing in this app should render without a valid admin session |
| State | React Context for auth session; local state per form/table | No need for global state beyond "who's logged in" |
| Data access | Firebase SDK v9+ modular, **full read/write** on all nodes | This app is the only writer in the whole system |
| Auth | **Firebase Authentication**, email/password | Admins are added manually by a Super Admin (Section 5), not self-signup |
| Image handling | Firebase Storage *or* paste an external image URL (ImgBB/Cloudinary) | Storage needs the Blaze (pay-as-you-go) plan for production rules; external URLs keep this fully on the free Spark tier |
| Hosting | **Cloudflare Pages** (separate project from the storefront) | Free tier, auto SSL/CDN |

---

## 5. Features

- **Login** — Firebase Auth email/password; on success, look up `/admins/{uid}` — if it doesn't exist, deny access even though Firebase Auth succeeded (an authenticated user isn't necessarily an authorized admin)
- **Dashboard** — total products, total clicks (all-time + last 7 days), top 5 clicked products, recently added products
- **Product management** — table view (search/filter/sort by status, category, platform), Add/Edit form (title, description, images, price, original price, category, **platform** — dropdown with common options (Amazon, Flipkart, Myntra, Meesho, Ajio) plus a free-text "Other" option so any affiliate program can be used, affiliate link, status: active/inactive/expired, tags), bulk CSV import/export, **soft-delete only** (status flag, never hard-delete — preserves click history tied to that product)
- **Category management** — CRUD, image, display order (drag-to-reorder)
- **Banner/Slider management** — CRUD, image, link target, active toggle, display order
- **Click analytics** — per-product click count + simple time-series chart, exportable as CSV
- **Admin user management** *(Super Admin only)* — add admin by email (they must already have a Firebase Auth account, or send them an invite to create one), assign role, revoke access by deleting their `/admins/{uid}` node
- **Settings** *(Super Admin only)* — site name, logo, social links, affiliate disclosure text, contact email

---

## 6. Firebase Realtime Database Schema (source of truth — owned by this app)

```json
{
  "products": {
    "productId1": {
      "title": "Sony WH-1000XM5 Headphones",
      "slug": "sony-wh-1000xm5",
      "description": "...",
      "images": ["https://...", "https://..."],
      "price": 24999,
      "originalPrice": 34999,
      "discountPercent": 29,
      "categoryId": "electronics",
      "subCategory": "headphones",
      "platform": "amazon",
      "affiliateLink": "https://amzn.to/xxxxx",
      "tags": ["trending", "bestseller"],
      "status": "active",
      "clickCount": 128,
      "createdAt": 1758700000000,
      "updatedAt": 1758700000000
    }
  },
  "categories": {
    "categoryId1": { "name": "Electronics", "slug": "electronics", "image": "https://...", "order": 1 }
  },
  "banners": {
    "bannerId1": { "image": "https://...", "link": "/category/electronics", "order": 1, "active": true }
  },
  "clicks": {
    "productId1": { "clickId1": { "timestamp": 1758700000000 } }
  },
  "admins": {
    "uid_xxx": { "email": "admin@example.com", "role": "superadmin", "createdAt": 1758700000000 }
  },
  "settings": {
    "siteName": "SastaBazar",
    "logo": "https://...",
    "affiliateDisclosure": "This site contains affiliate links...",
    "socialLinks": { "instagram": "", "twitter": "" }
  }
}
```

### 6.1 Security Rules

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).exists()"
    },
    "categories": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).exists()"
    },
    "banners": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).exists()"
    },
    "clicks": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": true
    },
    "admins": {
      ".read": "auth != null",
      ".write": "root.child('admins').child(auth.uid).child('role').val() === 'superadmin'"
    },
    "settings": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).child('role').val() === 'superadmin'"
    }
  }
}
```

`products`/`categories`/`banners`/`settings` have `.read: true` because the **public storefront app** (unauthenticated) needs to read them — that's expected and fine. `clicks` is world-writable (any anonymous visitor triggers one) but only admin-readable; a visitor could spam click nodes, which is an acceptable MVP risk, revisit with Firebase App Check if abuse shows up in the analytics.

---

## 7. Folder Structure

```
src/
  assets/
  components/
    common/
      Button/Button.jsx
      Table/Table.jsx
      Modal/Modal.jsx
      Loader/Loader.jsx
      FormField/FormField.jsx
    layout/
      AdminSidebar/AdminSidebar.jsx
      AdminHeader/AdminHeader.jsx
  features/
    auth/
      AdminLogin.jsx
    dashboard/
      AdminDashboard.jsx
    products/
      ProductTable.jsx
      ProductForm.jsx
      BulkImport.jsx
    categories/
      CategoryManager.jsx
    banners/
      BannerManager.jsx
    analytics/
      AnalyticsPage.jsx
    adminUsers/
      AdminUserManager.jsx
    settings/
      SettingsPage.jsx
  services/
    firebase.js
    productService.js
    categoryService.js
    bannerService.js
    clickService.js
    authService.js
    adminService.js
  context/
    AuthContext.jsx
  hooks/
    useAuth.js
  routes/
    AppRoutes.jsx
    ProtectedRoute.jsx
  utils/
    formatCurrency.js
    slugify.js
    csvExport.js
  App.jsx
  main.jsx
```

---

## 8. Non-Functional Requirements

- **Security:** every write gated by Firebase rules (Section 6.1), never by client-side role checks alone — the client-side role read is for UI/UX only (hiding buttons), not the actual permission boundary
- **Auditability:** `createdAt`/`updatedAt` on every record; consider adding `updatedBy: uid` in Phase 2 for accountability with multiple admins
- **Discoverability:** `noindex` + `robots.txt` disallow (Section 0) — this app should be effectively invisible to search engines
- **Usability:** built mobile-first since the primary user manages this from a phone, same as the storefront

---

## 9. Phased Roadmap

**Phase 1 (MVP):** Admin login · Product/Category CRUD · Banner CRUD · basic Dashboard
**Phase 2:** Click analytics with charts + CSV export · bulk CSV import · Admin user management
**Phase 3:** Coupon codes module · `updatedBy` audit trail · multi-admin role refinement (e.g. category-scoped editors)

---

## 10. Out of Scope

- Anything the public storefront renders (owned by `PRD-Website.md`)
- Payment processing, order management (no orders exist in this model)
- Customer account management (customer auth, if it ships in Phase 2, lives in the storefront app, not here)
