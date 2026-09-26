# SastaBazar — Affiliate Storefront & Admin Ecosystem

> A production-grade, Flipkart-inspired multi-merchant affiliate aggregator web platform and partner administration console, powered by React 19, Tailwind CSS v4, and Firebase Realtime Database.

---

## 🏗 System Architecture

The project consists of two completely decoupled applications sharing a single Firebase project:

1. **Public Storefront (`/`)**:
   - High-conversion, mobile-first Flipkart-grade e-commerce UI.
   - Non-blocking, fire-and-forget outbound affiliate click tracking.
   - Support for any affiliate merchant (Amazon, Flipkart, Myntra, Meesho, Ajio, boAt, custom).
   - Target deployment: `sastabazar.pages.dev` (Cloudflare Pages).

2. **Admin Panel (`/admin`)**:
   - Modern, dense slate dashboard built mobile-first.
   - Full CRUD over Products, Categories, Banners, and Site Settings.
   - Outbound click stream analytics and CSV export tools.
   - Strict Firebase security rules gating all write permissions.
   - Target deployment: `sastabazar-admin.pages.dev` (Cloudflare Pages).

---

## ⚡ Workflow Strategy (Local Device vs Codespaces)

To ensure zero strain on mobile/embedded local storage and CPU:
- **Local Device (Editing):** Code, components, styles, and configs are written directly here. No heavy `node_modules` or CPU-intensive builds are run locally.
- **GitHub Codespaces (Execution & Build):** Open the repo in GitHub Codespaces to run `npm install`, start dev servers, and run production builds on high-speed cloud infrastructure.

---

## 🚀 Running in GitHub Codespaces (1-Click)

1. Open this repository on GitHub.
2. Click **Code** → **Codespaces** → **Create codespace on main**.
3. The included `.devcontainer/devcontainer.json` will automatically configure Node.js 20 and install all dependencies.
4. Run the apps:
   - **Start Storefront (Port 5173):**
     ```bash
     npm run dev
     ```
   - **Start Admin Panel (Port 5174):**
     ```bash
     npm run admin:dev
     ```

---

## 🔥 Firebase Setup & Environment Variables

Copy `.env.example` to `.env` in the root directory (for storefront) and in `admin/.env` (for admin panel):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Realtime Database Security Rules
Copy the contents of `firebase/database.rules.json` into the Firebase Console -> Realtime Database -> Rules tab.

### Seed Catalog Data
Import `firebase/seed-data.json` directly into the Firebase Realtime Database console to instantly seed realistic products, categories, banners, and settings.

*Note: If no Firebase credentials are provided, both apps automatically run in zero-config Demo Mode using the bundled seed data.*

---

## ☁️ Cloudflare Pages Deployment

### 1. Storefront (`sastabazar.pages.dev`)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/`

### 2. Admin Console (`sastabazar-admin.pages.dev`)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `admin`

Both apps include `_redirects` for single-page application (SPA) client-side routing.

---

## 📜 Documentation & PRD References
- Public Storefront PRD: [`PRD/Affiliate-store.md`](file:///storage/emulated/0/JS-projects/affiliate-store/PRD/Affiliate-store.md)
- Admin Panel PRD: [`PRD/Affiliate-store-Admin.md`](file:///storage/emulated/0/JS-projects/affiliate-store/PRD/Affiliate-store-Admin.md)
- Complete Implementation Plan: [implementation_plan.md](file:///root/.gemini/antigravity-cli/brain/f8d4971b-0ed6-4f7a-97b8-f37563ebb12e/implementation_plan.md)
