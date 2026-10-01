# TechShop ⚡

[Visit the live page](https://megan-git9.github.io/TechShop.ge-E-commerce--Project/)

A modern **e-commerce shop built with React** — front-end only, no backend required.
It covers home appliances, mobile devices and small appliances, with a full cart →
checkout flow, a discounts page, Google sign-in and Georgian / English switching.

## Stack

| Concern | Choice |
| --- | --- |
| UI | React 18 (JavaScript, JSX) |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`, no config file needed) |
| Routing | React Router 6 (`HashRouter` — works on GitHub Pages) |
| State | React Context + `localStorage` |
| Lint | ESLint 9 (flat config) |
| Auth | Google Identity Services (optional) with offline demo fallback |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint
```

## Google sign-in

The app works with **no configuration at all** — without a client ID the Google button
falls back to a local demo account.

To use real Google sign-in (still 100% front-end, no server):

1. Open [Google Cloud Console](https://console.cloud.google.com/) → create/select a project.
2. Configure the **OAuth consent screen**.
3. Create a credential: **OAuth client ID → Web application**.
4. Add `http://localhost:5173` to **Authorized JavaScript origins**.
5. Copy `.env.example` to `.env` and set the ID:

```env
VITE_GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com
```

The returned ID token is a JWT that already contains `name`, `email` and `picture`, so
`src/lib/googleAuth.js` decodes it on the client and `src/context/AuthContext.jsx` keeps
the session in `localStorage`. A production deployment should verify the token on a
server before trusting it.

## Features

- **Home** — hero banner, promo cards, discount marquee, category showcase tabs
  (home appliances / small appliances / smartphones / audio), full catalog with filters.
- **Catalog** — live search (Georgian **and** English, including category words),
  category / brand / price-range / discounted-only filters, sorting by price or rating.
- **Product detail** — specs table, description, quantity, live delivery-price estimate,
  similar products, recently viewed.
- **Cart** — add to cart, quantity stepper, remove, subtotal / delivery / total.
- **Checkout** — delivery form with validation, bank-card demo and online installments
  (BOG, TBC, Credo), order confirmation page with an order reference.
- **Discounts page** — only items that actually have an `oldPrice`.
- **Buy Now** on every card jumps straight to the cart/checkout.
- **About** — TechShop story, features and live catalog statistics.
- **i18n** — Georgian ⇄ English switcher in the navbar; the choice is persisted.
- **Extras** — toast notifications, live-chat widget (Megi), policy modals
  (terms / warranty / return), responsive layout, hash routing, 404 page.

## Delivery pricing

Delivery is charged per kilogram, using the heavier of the real weight and the
volumetric weight (`w × h × d / 6000`), with a ₾5 minimum — see `src/lib/pricing.js`.
The summary in the cart and at checkout shows total weight and delivery cost, and the
same formula is used for the per-product estimate on the product page.

## Project structure

```
src/
  components/     Navbar, Footer, ProductCard, FilterSidebar, ChatWidget, ...
  context/        I18n, Cart, Catalog, Auth, Toast, Ui providers
  data/           products.js (catalog), translations.js (ka/en), policies.js
  hooks/          useFilteredProducts.js, useRecentlyViewed.js
  lib/            pricing.js, storage.js, googleAuth.js
  pages/          Home, Discounts, ProductDetail, Cart, Checkout,
                  OrderConfirmed, About, Login, NotFound
legacy/           the original vanilla HTML/CSS/JS version, kept for reference
```

## Deploying to GitHub Pages

`.github/workflows/pages.yml` builds the app and publishes `dist/` to GitHub Pages.
`base: './'` plus `HashRouter` keeps every route working on a project sub-path.