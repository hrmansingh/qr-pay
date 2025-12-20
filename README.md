# QRPay - Payment Analytics Dashboard

A beautiful and professional QR Payment Analytics Platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📊 **Comprehensive Dashboard** - Real-time analytics and KPI tracking
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Clean, professional interface with smooth animations
- 📈 **Interactive Charts** - Sales trends and product performance visualization
- 🏪 **Business Management** - Multi-business account management
- 📦 **Product Analytics** - QR code generation and conversion tracking
- 🎯 **Performance Metrics** - Conversion rates, revenue tracking, and more

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
qr-pay/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── utils.ts
│   ├── BusinessesManagement.tsx
│   ├── Dashboard.tsx
│   ├── DashboardLayout.tsx
│   └── ProductsAnalytics.tsx
└── package.json
```

## Dashboard Features

### Overview Tab
- **KPI Cards**: Total Sales, Revenue, QR Scans, Conversion Rate
- **Sales Chart**: 7-day sales performance trend
- **Product Chart**: Top-selling products by revenue

### Products Tab
- **Product Grid**: Visual product cards with key metrics
- **Search & Filter**: Find products quickly
- **QR Code Generation**: Generate QR codes for products
- **Performance Metrics**: Scans, purchases, conversion rates

### Businesses Tab
- **Business Cards**: Visual business overview
- **Status Tracking**: Active/inactive business status
- **Revenue Metrics**: Sales and revenue per business
- **Quick Actions**: View analytics and manage businesses

## Customization

### Colors
The app uses a professional color scheme with CSS custom properties. You can customize colors in `app/globals.css`:

```css
:root {
  --primary: #4f46e5;        /* Indigo primary color */
  --secondary: #f1f5f9;      /* Light gray secondary */
  --accent: #f1f5f9;         /* Accent color */
  /* ... more color variables */
}
```

### Components
All UI components are built with Radix UI primitives and can be easily customized. They're located in the `components/ui/` directory.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is private and proprietary.

---

Built with ❤️ using Next.js and modern web technologies.