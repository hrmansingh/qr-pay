# QR Pay - Razorpay UPI QR Analytics System

A Next.js backend system for managing physical QR-based UPI payments using Razorpay. This system enables small businesses to sell products via physical QR codes that customers can scan with any UPI app (Google Pay, PhonePe, Paytm).

## Features

- **Business & Product Management**: Create and manage businesses and products
- **QR Code Generation**: Generate UPI QR codes for product-business combinations
- **Payment Processing**: Handle Razorpay webhook events for payment tracking
- **Analytics Dashboard**: Comprehensive analytics for revenue, products, and businesses
- **Supabase Integration**: PostgreSQL database with real-time capabilities

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Payment Gateway**: Razorpay
- **QR Generation**: qrcode library
- **Authentication**: Supabase Auth
- **TypeScript**: Full type safety

## Database Schema

The system uses the following Supabase tables:
- `businesses` - Business information
- `products` - Product catalog
- `business_products` - Product assignments with price overrides
- `qr_scans` - Generated QR codes
- `payments` - Payment records from Razorpay
- `orders` - Order management
- `order_items` - Order line items
- `profiles` - User profiles

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# UPI Configuration
MERCHANT_UPI_ID=your_merchant_upi_id@bank
MERCHANT_NAME=Your Business Name

# Application Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Razorpay Setup

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the dashboard
3. Set up a webhook endpoint: `https://yourdomain.com/api/webhooks/razorpay`
4. Configure webhook events: `payment.captured`, `payment.failed`

### 4. Run Development Server

```bash
npm run dev
```

## API Endpoints

### Business Management
- `GET /api/businesses` - List all businesses
- `POST /api/businesses` - Create a new business
- `GET /api/businesses/[id]` - Get business details
- `PUT /api/businesses/[id]` - Update business
- `DELETE /api/businesses/[id]` - Delete business

### Product Management
- `GET /api/products` - List all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Business-Product Assignment
- `GET /api/business-products` - List product assignments
- `POST /api/business-products` - Assign product to business
- `PUT /api/business-products/[id]` - Update price override
- `DELETE /api/business-products/[id]` - Remove assignment

### QR Code Generation
- `POST /api/qr-codes/generate` - Generate QR code for product-business
- `GET /api/qr-codes` - List generated QR codes

### Payment Tracking
- `GET /api/payments` - List payments with filters
- `GET /api/payments/[id]` - Get payment details

### Analytics
- `GET /api/analytics/overview` - Complete analytics overview
- `GET /api/analytics/revenue` - Revenue analytics by period
- `GET /api/analytics/products` - Product performance analytics
- `GET /api/analytics/businesses` - Business performance analytics

### Webhook
- `POST /api/webhooks/razorpay` - Razorpay webhook handler

## Usage Examples

### 1. Create a Business
```bash
curl -X POST http://localhost:3000/api/businesses \
  -H "Content-Type: application/json" \
  -d '{"name": "Coffee Shop", "owner_id": "user-123"}'
```

### 2. Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Cappuccino", "base_price": 150}'
```

### 3. Assign Product to Business
```bash
curl -X POST http://localhost:3000/api/business-products \
  -H "Content-Type: application/json" \
  -d '{"business_id": "biz-123", "product_id": "prod-456", "price_override": 180}'
```

### 4. Generate QR Code
```bash
curl -X POST http://localhost:3000/api/qr-codes/generate \
  -H "Content-Type: application/json" \
  -d '{"business_id": "biz-123", "product_id": "prod-456"}'
```

### 5. Get Analytics
```bash
curl "http://localhost:3000/api/analytics/overview?start_date=2024-01-01&end_date=2024-12-31"
```

## QR Code Flow

1. **Generate QR**: Business generates QR code for a specific product
2. **Customer Scan**: Customer scans QR with any UPI app
3. **UPI Payment**: Customer completes payment through their UPI app
4. **Webhook**: Razorpay sends webhook to your system
5. **Record Payment**: System records payment and creates order
6. **Analytics**: Payment data is available in analytics APIs

## Security Features

- Webhook signature verification
- Server-side price validation
- Role-based access control
- Secure environment variable handling
- SQL injection protection via Supabase

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details