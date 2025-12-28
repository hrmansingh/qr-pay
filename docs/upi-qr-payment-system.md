# UPI QR Payment System

## Overview

The UPI QR Payment System allows businesses to generate QR codes for their products that customers can scan with any UPI app to make payments directly to the merchant's UPI ID.

## How It Works

### 1. QR Code Generation
- Navigate to the Products Analytics section
- Click "Generate QR" for any product
- Set the payment amount (defaults to product base price)
- Click "Generate UPI QR Code" to create the QR code
- Download the QR code for printing or sharing

### 2. Payment Process
- Customer scans the QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
- The UPI app automatically fills in:
  - Merchant UPI ID: `mohit354147.rzp@rxairtel`
  - Merchant Name: `MOHIT`
  - Payment Amount: As set when generating the QR code
  - Transaction Note: Contains product ID and business ID for tracking

### 3. Payment Tracking
- When payment is completed, Razorpay sends a webhook notification
- The system automatically records the payment in the database
- Creates order and order item records for analytics
- Updates business analytics and revenue tracking

## Configuration

### Environment Variables
```env
# Merchant UPI Configuration
MERCHANT_UPI_ID=mohit354147.rzp@rxairtel
MERCHANT_NAME=MOHIT

# Public configuration for client-side QR generation
NEXT_PUBLIC_MERCHANT_UPI_ID=mohit354147.rzp@rxairtel
NEXT_PUBLIC_MERCHANT_NAME=MOHIT

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_RtxzgEOXsQqfSG
RAZORPAY_KEY_SECRET=4PoMU3ZNYaaxXsVYX5XcIuxp
RAZORPAY_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

## API Endpoints

### Generate QR Code
```
POST /api/qr-codes/generate
{
  "business_id": "business-uuid",
  "product_id": "product-uuid",
  "amount": 100.50  // Optional: custom amount
}
```

### Payment Webhook
```
POST /api/webhooks/razorpay
```
Handles payment captured and failed events from Razorpay.

## Features

- **Dynamic Amount**: Set custom payment amounts when generating QR codes
- **UPI Compatibility**: Works with all UPI apps (Google Pay, PhonePe, Paytm, etc.)
- **Automatic Tracking**: Payments are automatically recorded and tracked
- **Analytics**: View payment analytics and conversion rates
- **Download QR Codes**: Download QR codes as PNG images for printing

## Security

- Webhook signature verification ensures payment authenticity
- Transaction notes include product and business IDs for proper attribution
- All payments are processed through Razorpay's secure infrastructure

## Testing

Use Razorpay test mode credentials for development and testing. In production, replace with live credentials and update the merchant UPI ID to your actual UPI ID.