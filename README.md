# VELOX — Premium Sportswear E-commerce

A premium sportswear e-commerce experience focused on clothing, footwear, and accessories.

Built from scratch with **React, Vite, TypeScript, and Supabase**, with a focus on modern UI, smooth interactions, responsive design, and a complete shopping experience.

## ✨ Features

* Premium responsive storefront
* Product catalog with variants
* Product detail pages
* Search and filtering
* Shopping cart with persistent state
* Authentication
* Simulated checkout flow
* Order management
* Admin dashboard
  * Create, edit, and remove products
  * Manage stock and product variants
  * Upload product images
* Supabase Row Level Security
* GSAP animations and ScrollTrigger effects
* Responsive mobile-first design

## 🛠️ Stack

* **React 18 + Vite + TypeScript**
* **React Router v6** — routing and protected routes
* **Supabase** — Postgres, Auth, Storage, and Row Level Security
* **TanStack React Query** — data fetching, caching, and loading/error states
* **Zustand** — global UI state
* **Context API** — authentication and persistent cart
* **GSAP + ScrollTrigger** — animations, parallax, and microinteractions
* **CSS Modules** — component styling
* **CSS Design System** — centralized design tokens

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Khuli0/velox.git
cd velox
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then add your Supabase project credentials.

### 4. Set up the database

Follow the instructions in:

```text
supabase/README.md
```

### 5. Start the development server

```bash
npm run dev
```

## 📜 Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # linting
```

## 📁 Project Structure

```text
src/
├── animations/      # GSAP configuration and animation utilities
├── components/      # reusable components organized by domain
├── contexts/        # AuthContext and CartContext
├── data/            # static navigation and application constants
├── hooks/           # React Query hooks
├── layouts/         # MainLayout, AccountLayout, AdminLayout
├── lib/             # Supabase client and utilities
├── pages/           # application pages
├── router/          # route configuration and protected routes
├── services/        # Supabase data access layer
├── styles/          # design tokens, reset, global styles, fonts
└── types/           # TypeScript types

supabase/
├── migrations/      # database schema and RLS policies
├── seed.sql         # demo data
└── README.md        # database setup guide
```

## 🧪 Project Scope

### Simulated Checkout

The checkout flow demonstrates the complete shopping experience:

**Information → Address → Shipping → Payment → Confirmation**

No real payment is processed. Orders are stored in Supabase for demonstration purposes.

### Admin Dashboard

Available at:

```text
/admin
```

The dashboard allows authorized administrators to:

* Create products
* Edit products
* Remove products
* Manage stock
* Manage product variants
* Upload product images

Access is restricted to users with:

```text
role = 'admin'
```

on their profile.

See `supabase/README.md` for database and admin setup instructions.

### Reviews

A `reviews` table and its Row Level Security policies are already included in the database schema.

The review interface is reserved for a future version.

### Hero Campaign

The homepage includes a video hero campaign:

```text
public/videos/hero-campaign.mp4
```

The video was optimized for web delivery using H.264, `faststart`, and no audio.

A fallback image is provided for cases where the video cannot be used:

```text
public/images/hero-fallback.jpg
public/images/hero-fallback.webp
```

The fallback image is preloaded and prioritized to improve the initial visual load.

## 🔐 Environment Variables

Environment variables are required for Supabase integration.

Create a `.env` file locally using `.env.example` as a reference.

**Never commit your `.env` file to the repository.**

## 📱 Responsive Design

VELOX was designed with a mobile-first approach and adapted for larger screens, focusing on:

* Responsive layouts
* Touch-friendly interactions
* Mobile navigation
* Adaptive product grids
* Optimized media
* Smooth animations

## 🎯 Purpose

VELOX is a portfolio project created to demonstrate practical experience with modern frontend development, e-commerce architecture, Supabase integration, state management, authentication, responsive UI, and animation.

## 📌 Status

**In development**

The project is actively being refined and may receive new features, visual improvements, and optimizations.

## 📄 License

This project is licensed under the MIT License — feel free to use it as a learning reference. See the `LICENSE` file for details, or replace this section with "All rights reserved" if you'd rather keep the code private.

---

Built with React, TypeScript, Supabase, and a lot of attention to detail.