# Razorpay Setup Guide

This guide will help you set up Razorpay for the QR Pay system.

## 1. Create Razorpay Account

1. Go to [razorpay.com](https://razorpay.com) and sign up
2. Complete the KYC process
3. Navigate to the Dashboard

## 2. Get API Keys

1. Go to **Settings** → **API Keys**
2. Generate API keys for your account
3. Copy the **Key ID** and **Key Secret**
4. Add them to your `.env.local` file:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
   ```

## 3. Configure Webhooks

### Step 1: Create Webhook Endpoint
1. Go to **Settings** → **Webhooks**
2. Click **Create New Webhook**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Select the following events:
   - `payment.captured`
   - `payment.failed`

### Step 2: Get Webhook Secret
1. After creating the webhook, copy the **Webhook Secret**
2. Add it to your `.env.local` file:
   ```env
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx
   ```

## 4. UPI Configuration

### Set Up Merchant UPI ID
1. In your Razorpay dashboard, go to **Settings** → **Payment Methods**
2. Enable **UPI** payment method
3. Configure your merchant UPI ID (usually provided by your bank)
4. Add it to your `.env.local` file:
   ```env
   MERCHANT_UPI_ID=yourmerchant@bankname
   MERCHANT_NAME=Your Business Name
   ```

## 5. Test Mode vs Live Mode

### Test Mode (Development)
- Use test API keys (start with `rzp_test_`)
- Payments are simulated
- No real money is transferred
- Use test UPI IDs for testing

### Live Mode (Production)
- Use live API keys (start with `rzp_live_`)
- Real payments are processed
- Requires completed KYC
- Use actual merchant UPI ID

## 6. Testing the Integration

### Test Payment Flow
1. Generate a QR code using the API
2. Use a UPI testing app or Razorpay's test interface
3. Make a test payment
4. Verify webhook is received and payment is recorded

### Test Webhook Locally
For local development, use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the ngrok URL for webhook configuration
# Example: https://abc123.ngrok.io/api/webhooks/razorpay
```

## 7. Security Best Practices

### Environment Variables
- Never commit API keys to version control
- Use different keys for test and production
- Rotate keys periodically

### Webhook Security
- Always verify webhook signatures
- Use HTTPS for webhook URLs
- Implement rate limiting
- Log webhook events for debugging

### UPI Security
- Validate transaction amounts server-side
- Verify business-product associations
- Implement duplicate payment detection
- Monitor for suspicious activity

## 8. Common Issues and Solutions

### Webhook Not Receiving Events
1. Check webhook URL is accessible
2. Verify SSL certificate is valid
3. Ensure webhook events are selected
4. Check server logs for errors

### Payment Verification Fails
1. Verify webhook secret is correct
2. Check signature verification logic
3. Ensure request body is read as string
4. Validate timestamp to prevent replay attacks

### UPI Payments Not Working
1. Verify merchant UPI ID is active
2. Check UPI payment method is enabled
3. Ensure transaction note format is correct
4. Validate amount limits

## 9. Monitoring and Analytics

### Razorpay Dashboard
- Monitor payment success rates
- Track settlement status
- View transaction details
- Download payment reports

### Application Analytics
- Use the built-in analytics APIs
- Monitor webhook delivery success
- Track QR code generation and usage
- Analyze business and product performance

## 10. Support and Documentation

### Razorpay Resources
- [API Documentation](https://razorpay.com/docs/)
- [Webhook Guide](https://razorpay.com/docs/webhooks/)
- [UPI Documentation](https://razorpay.com/docs/payments/payment-methods/upi/)
- [Support Portal](https://razorpay.com/support/)

### Integration Testing
- Use Razorpay's test cards and UPI IDs
- Test different payment scenarios
- Verify webhook delivery and processing
- Test error handling and edge cases