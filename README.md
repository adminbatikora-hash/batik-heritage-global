# 🏮 Batikora

A world-class premium Indonesian Batik eCommerce platform for international customers. Built with Next.js 15, featuring glassmorphism UI, luxury design aesthetics, and full-stack capabilities.

![Batikora](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4) ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)

## ✨ Features

### Frontend
- 🎨 **Glassmorphism UI** - Premium glass-card effects with backdrop blur
- 🎭 **Framer Motion Animations** - Smooth page transitions and scroll animations
- 🌐 **Multi-Currency Support** - USD, EUR, GBP, AUD, SGD, JPY
- 📱 **Fully Responsive** - Optimized for Desktop, Tablet, and Mobile
- 🔍 **Advanced Search & Filters** - Category, price, color, size, material
- 💛 **Wishlist System** - Persistent client-side wishlist
- 🛒 **Shopping Cart** - Full cart with coupon support
- 🏷️ **SEO Optimized** - Dynamic metadata, sitemap, robots.txt, structured data

### Backend
- 🔐 **NextAuth Authentication** - JWT-based with role access control
- 💳 **PayPal Integration** - Sandbox and production support
- 📦 **Order Management** - Full lifecycle tracking
- 🗄️ **Prisma ORM** - Type-safe database operations
- 🛡️ **Security** - CSRF protection, rate limiting, input validation
- 📊 **Admin Dashboard** - Revenue tracking, order management, product CRUD

### Pages
- Home (Hero, Featured Products, Categories, Testimonials, Newsletter)
- Collections (Grid/List view, advanced filtering and sorting)
- Product Detail (Gallery, size/color selection, shipping calculator, reviews)
- Shopping Cart (Quantity management, coupon codes)
- Checkout (4-step flow with PayPal)
- Blog (Categories, featured posts)
- About (Heritage story, artisan values)
- Contact (Form, company info)
- Account (Profile, orders, wishlist, addresses, settings)
- Auth (Login, register, forgot password)
- Admin Dashboard (Revenue, orders, products, customers, coupons)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd batik-heritage-global

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | JWT signing secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Application URL (http://localhost:3000 for dev) |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID |

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── collections/       # Product collections
│   ├── contact/           # Contact page
│   ├── products/          # Product detail pages
│   └── wishlist/          # Wishlist page
├── components/            # React components
│   ├── admin/            # Admin panel components
│   ├── blog/             # Blog components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── collections/      # Collection grid
│   ├── contact/          # Contact form
│   ├── home/             # Homepage sections
│   ├── layout/           # Navbar, Footer
│   ├── products/         # Product detail
│   ├── providers/        # Context providers
│   └── wishlist/         # Wishlist view
├── lib/                   # Utilities & config
│   ├── auth.ts           # NextAuth configuration
│   ├── constants.ts      # App constants
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
├── store/                 # Zustand state stores
│   ├── useCartStore.ts
│   ├── useCurrencyStore.ts
│   └── useWishlistStore.ts
└── middleware.ts          # Route protection
```

## 🎨 Design System

### Color Palette
- **Primary:** `#0F172A` (Deep Navy)
- **Secondary:** `#B8860B` (Dark Goldenrod)
- **Accent:** `#D4AF37` (Metallic Gold)
- **Background:** `#F8F9FA` (Light Gray)
- **Foreground:** `#111827` (Dark Charcoal)

### Typography
- **Display:** Playfair Display (Serif)
- **Body:** Inter (Sans-serif)
- **Mono:** JetBrains Mono (Monospace)

### Components
- Glass Cards (backdrop-blur, semi-transparent backgrounds)
- Gold Gradient Buttons
- Rounded corners (1rem standard)
- Luxury box shadows
- Floating animations

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Set all environment variables
- [ ] Run database migrations (`npx prisma migrate deploy`)
- [ ] Configure PayPal production credentials
- [ ] Set up Cloudinary for image storage
- [ ] Enable Google Analytics
- [ ] Configure custom domain + SSL
- [ ] Set up email service (newsletter, order confirmations)
- [ ] Configure CDN for static assets
- [ ] Test all payment flows
- [ ] Run Lighthouse audit (target: 95+)

## 🛡️ Security

- JWT-based authentication with NextAuth
- Role-based access control (Admin, Manager, Customer)
- Protected admin routes via middleware
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- CSRF protection
- Input validation on all API routes
- Parameterized database queries via Prisma

## 📈 Performance

- Server Components for initial page loads
- Client-side state with Zustand (minimal re-renders)
- Image optimization with Next.js Image component
- Lazy loading for below-fold content
- Static page generation where possible
- CDN-ready architecture

## 🌍 International Support

- **Countries:** US, Canada, UK, Germany, France, Australia, Singapore, Japan
- **Currencies:** USD, EUR, GBP, AUD, SGD, JPY
- **Shipping:** DHL, FedEx, UPS, EMS
- **Shipping Zones:** North America, Europe, Asia, Australia

## 📄 License

© 2024 Batikora. All rights reserved.
