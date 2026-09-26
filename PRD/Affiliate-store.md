# Product Requirements Document
## SastaBazar — Public Website

**Version:** 1.0
**Date:** September 24, 2026
**Stack:** React JS (frontend) · Firebase Realtime Database (read) + Firebase Realtime Database (click-write) · Cloudflare Pages (hosting)

---

## 0. Architecture Decision: Two Separate Apps

This PRD covers **only the public storefront** as a standalone React app, separate from the admin panel (which has its own PRD: `PRD-Admin-Panel.md`).

**Reasoning:**
- Public site ships zero admin code/routes → smaller bundle, faster load, nothing for a visitor to poke at
- Independent deploy cycles — pushing an admin fix never risks the live storefront
- Cleaner security boundary — even if someone finds the admin app's URL, it's a completely separate build with no shared client code
- Both apps read/write the **same Firebase project**, just with different SDK usage (public app: mostly reads + click-writes; admin app: full CRUD)

Deployed as its own Cloudflare Pages project: `sastabazar.pages.dev`, later moved to the real custom domain (`sastabazar.com` or `sastabazar.in`, whichever is available) once bought via Cloudflare Registrar.

---

## 1. Executive Summary

The public storefront displays a curated catalog of affiliate products (sourced from Amazon, Flipkart, etc.), each with a "Buy Now" CTA that redirects the visitor to the merchant's affiliate link. No cart, no checkout, no payment happens on this site — commission is earned when the merchant's affiliate program tracks and pays for the completed purchase on their end. This app only needs to display data and log the outbound click.

---

## 2. Goals

- **Strict requirement:** fully responsive across mobile/tablet/desktop, and must look and feel like a real, polished e-commerce shop (Flipkart-grade — see Section 6) — not a blog or a barebones landing page. This is the trust/conversion layer, so visual credibility is non-negotiable
- **Platform-agnostic products:** any single product can carry an affiliate link from *any* platform — Amazon, Flipkart, Myntra, Meesho, Ajio, or any other merchant with an affiliate program. The site is not locked to one platform; each product just needs a `platform` label (for the badge) and its own `affiliateLink`. Commission is earned per-click-through, from whichever merchant that product points to
- Every product page must load fast and rank well in search (SEO matters here — see Section 6)
- Every "Buy Now" click logged before redirect, without slowing the redirect down

---

## 3. User Roles

| Role | Access |
|---|---|
| **Visitor** | Browse, search, filter products; click through to affiliate links |
| **Registered Customer** *(Phase 2)* | Wishlist/save-for-later, price-drop alerts — via Firebase Auth (Google/email sign-in) |

This app never handles admin/editor roles — that's entirely in the separate admin app.

---

## 4. Tech Stack & Architecture

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server |
| Styling | Tailwind CSS | Fastest path to a clean Flipkart-like look |
| Routing | React Router v6 | Standard for CSR React |
| State | React Context + `useReducer` (auth/wishlist only); local state elsewhere | App is read-heavy, doesn't need Redux |
| Data access | Firebase SDK v9+ modular, **read-only** on `products`/`categories`/`banners`/`settings`, **write-only** on `clicks` | Matches the security rules in the admin PRD — this app never needs write access to catalog data |
| Auth | Firebase Authentication (optional — only if wishlist/Phase 2 ships) | Not needed for Phase 1 browsing at all |
| Hosting | **Cloudflare Pages** | Free tier, auto SSL/CDN, connects to GitHub for auto-deploy on push |

**SEO note (read this before building):** Realtime DB + pure client-side React means Google sees an empty shell until JS executes and data loads — a real risk for a site whose whole value is organic search traffic. Mitigations in order of effort:
1. `react-snap` or `vite-plugin-ssg` to pre-render static HTML for product/category routes at build time
2. Per-page `<title>`/meta tags via `react-helmet-async` regardless of #1
3. If organic traffic becomes central, migrate this app (not the admin app) to Next.js later for real SSR

Phase 1 ships CSR + prerendering; full SSR is a Phase 3 item, not a Phase 1 blocker.

---

## 5. Features

**Pages:**
- **Home** — hero/promo banner carousel (data from admin), trending deals row, category grid, "most clicked this week" row
- **Category page** — grid of products, sort (price, discount %, newest), filters (platform, price range, sub-category), pagination
- **Product detail** — image gallery, title, current price + original price + discount %, description/key features, platform badge (Amazon/Flipkart/etc.), sticky "Buy Now →" CTA, related products
- **Search** — debounced live search with suggestions
- **Wishlist** *(Phase 2, requires login)*
- **Static pages** — About, Contact, Affiliate Disclosure (legally required — Amazon Associates and FTC guidelines mandate this), Privacy Policy, Terms

**Buy Now flow:**
```
click → push entry to /clicks/{productId}/{pushId} (fire-and-forget, non-blocking)
      → increment /products/{productId}/clickCount
      → redirect (new tab) to /products/{productId}/affiliateLink
```
The write to `clicks` must never block or delay the redirect — fire it and navigate immediately.

---

## 6. Design System (Flipkart-inspired)

| Token | Value | Notes |
|---|---|---|
| Header/Primary | `#2874F0` (Flipkart Blue) | Sticky header background |
| Accent | `#FFE500` (Flipkart Yellow) | Small highlights, badges |
| CTA — Buy Now | `#FB641B` (orange) | Primary purchase-intent button |
| CTA — secondary | `#FF9F00` (amber/orange) | Wishlist / secondary action |
| Discount/rating tag | `#388E3C` (green) | "X% off" badge, star-rating chip |
| Price (current) | `#212121`, bold | Original price smaller, gray, strikethrough |
| Background | `#FFFFFF` / `#F1F3F6` | White cards on light gray page background |
| Border | `#E0E0E0`, 1px | Thin card borders |
| Radius | 2–4px | Sharp, dense grid feel — not soft/rounded |
| Typography | Roboto (Google Fonts) or system sans-serif | Matches Flipkart's dense, functional UI feel |
| Spacing | Tight — 4/8/16/24px grid | More products per screen |
| Product card | White bg, thin border, image top, 2-line title clamp, price + strikethrough + "X% off", star rating chip, "Buy Now" CTA | 2 cols mobile, 4–5 desktop |
| Header | Blue sticky bar, white logo, full-width search bar, cart/wishlist icon right | Category nav as horizontal scroll on mobile |

Hex values are close public approximations, not pixel-verified — fine for "Flipkart-inspired"; sample flipkart.com directly if exact brand-match matters.

---

## 7. Firebase Data This App Touches

Full schema and write rules are owned by the admin panel's PRD — this app only needs to know the shape of what it reads, plus the one node it writes to.

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
      "platform": "amazon",
      "affiliateLink": "https://amzn.to/xxxxx",
      "status": "active",
      "clickCount": 128
    }
  },
  "categories": { "categoryId1": { "name": "Electronics", "slug": "electronics", "image": "https://...", "order": 1 } },
  "banners": { "bannerId1": { "image": "https://...", "link": "/category/electronics", "order": 1, "active": true } },
  "settings": { "siteName": "SastaBazar", "logo": "https://...", "affiliateDisclosure": "..." },
  "clicks": { "productId1": { "clickId1": { "timestamp": 1758700000000 } } }
}
```

Filter `products` client-side (or via query) to only show `status: "active"` items — expired/inactive products stay in the DB but never render.

---

## 8. Folder Structure

```
src/
  assets/
  components/
    common/
      Button/Button.jsx
      Card/Card.jsx
      Modal/Modal.jsx
      Loader/Loader.jsx
      SearchBar/SearchBar.jsx
      Badge/Badge.jsx
    layout/
      Header/Header.jsx
      Footer/Footer.jsx
  features/
    home/
      components/HeroBanner.jsx, TrendingRow.jsx, CategoryGrid.jsx
      HomePage.jsx
    products/
      components/ProductCard.jsx, ProductGallery.jsx, ProductFilters.jsx
      hooks/useProducts.js, useProductDetail.js
      ProductListPage.jsx
      ProductDetailPage.jsx
    categories/
      CategoryPage.jsx
    search/
      SearchPage.jsx
    wishlist/
      WishlistPage.jsx
    static/
      AboutPage.jsx, ContactPage.jsx, DisclosurePage.jsx, PrivacyPage.jsx, TermsPage.jsx
  services/
    firebase.js
    productService.js
    categoryService.js
    bannerService.js
    clickService.js
  context/
    AuthContext.jsx      (Phase 2 only)
    WishlistContext.jsx  (Phase 2 only)
  hooks/
    useDebounce.js
  routes/
    AppRoutes.jsx
  utils/
    formatCurrency.js
    slugify.js
    trackClick.js
  App.jsx
  main.jsx
```

---

## 9. Non-Functional Requirements

- **Performance:** lazy-load images (`loading="lazy"`), route-based code splitting, debounce search input
- **SEO:** prerendered routes for products/categories (Section 4), unique meta tags per page
- **Responsiveness:** mobile-first breakpoints — this audience skews heavily mobile
- **Legal:** visible affiliate disclosure on every product page and in the footer
- **Reliability:** if the `clicks` write fails, the redirect must still happen — never gate the user's purchase path on analytics succeeding

---

## 10. Phased Roadmap

**Phase 1 (MVP):** Home, Category, Product Detail pages · Buy-Now redirect + click logging · Flipkart-style responsive UI · static legal pages
**Phase 2:** Search + filters · Customer login + wishlist · price-drop alerts
**Phase 3:** Pre-rendering/SSR migration if SEO traffic demands it · PWA support

---

## 11. Out of Scope

- Any product/category/banner editing (lives entirely in the admin app)
- Cart/checkout/payment processing
- User-referral/commission system (this is a redirect-to-merchant model, not MLM-style referrals)
