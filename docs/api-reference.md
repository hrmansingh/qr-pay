# QR Pay API Reference

Complete API reference for the QR Pay Razorpay UPI QR Analytics System.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints require proper authentication. Use JWT tokens or Supabase auth tokens in the Authorization header.

---

## Profiles

### `GET /profiles`
List all profiles with optional filtering.

**Query Parameters:**
- `role`: Filter by role (admin, business_owner, user)
- `limit`: Results per page (default: 50, max: 100)
- `offset`: Pagination offset (default: 0)

### `POST /profiles`
Create a new profile.

**Body:**
```json
{
  "id": "uuid-from-auth-system",
  "name": "User Name",
  "role": "business_owner"
}
```

### `GET /profiles/{id}`
Get profile details with associated businesses.

### `PUT /profiles/{id}`
Update profile information.

**Body:**
```json
{
  "name": "Updated Name",
  "role": "admin"
}
```

### `DELETE /profiles/{id}`
Delete a profile (only if no associated businesses).

### `GET /profiles/{id}/stats`
Get profile statistics.

**Query Parameters:**
- `start_date`: Filter start date (YYYY-MM-DD)
- `end_date`: Filter end date (YYYY-MM-DD)

### `GET /profiles/{id}/businesses`
Get all businesses owned by profile.

**Query Parameters:**
- `include_stats`: Include business statistics (true/false)

### `GET /profiles/{id}/analytics`
Get comprehensive analytics for profile.

**Query Parameters:**
- `start_date`: Filter start date
- `end_date`: Filter end date

### `PUT /profiles/{id}/role`
Update profile role.

**Body:**
```json
{
  "role": "admin",
  "promoted_by": "admin-user-id"
}
```

---

## Businesses

### `GET /businesses`
List all businesses.

### `POST /businesses`
Create a new business.

**Body:**
```json
{
  "name": "Business Name",
  "owner_id": "profile-uuid"
}
```

### `GET /businesses/{id}`
Get business details.

### `PUT /businesses/{id}`
Update business information.

**Body:**
```json
{
  "name": "Updated Business Name"
}
```

### `DELETE /businesses/{id}`
Delete a business.

---

## Products

### `GET /products`
List all products.

### `POST /products`
Create a new product.

**Body:**
```json
{
  "name": "Product Name",
  "base_price": 150.00
}
```

### `GET /products/{id}`
Get product details.

### `PUT /products/{id}`
Update product information.

**Body:**
```json
{
  "name": "Updated Product Name",
  "base_price": 180.00
}
```

### `DELETE /products/{id}`
Delete a product.

---

## Business Products

### `GET /business-products`
List product assignments.

**Query Parameters:**
- `business_id`: Filter by business

### `POST /business-products`
Assign product to business.

**Body:**
```json
{
  "business_id": "business-uuid",
  "product_id": "product-uuid",
  "price_override": 200.00
}
```

### `PUT /business-products/{id}`
Update price override.

**Body:**
```json
{
  "price_override": 220.00
}
```

### `DELETE /business-products/{id}`
Remove product from business.

---

## QR Codes

### `POST /qr-codes/generate`
Generate QR code for product-business combination.

**Body:**
```json
{
  "business_id": "business-uuid",
  "product_id": "product-uuid",
  "format": "json"
}
```

**Format Options:**
- `json`: Returns QR code as base64 data URL (default)
- `image`: Returns QR code as PNG image

**Response (JSON format):**
```json
{
  "qr_code": "data:image/png;base64,...",
  "business_id": "uuid",
  "product_id": "uuid",
  "amount": 180.00,
  "business_name": "Coffee Shop",
  "product_name": "Cappuccino",
  "merchant_upi": "merchant@bank"
}
```

### `GET /qr-codes`
List generated QR codes.

**Query Parameters:**
- `business_id`: Filter by business
- `product_id`: Filter by product

---

## Payments

### `GET /payments`
List payments with filtering.

**Query Parameters:**
- `business_id`: Filter by business
- `product_id`: Filter by product
- `status`: Filter by status (captured, failed, pending)
- `start_date`: Filter start date
- `end_date`: Filter end date
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset

### `GET /payments/{id}`
Get payment details.

---

## Orders

### `GET /orders`
List orders with filtering.

**Query Parameters:**
- `business_id`: Filter by business
- `status`: Filter by status (pending, completed, cancelled)
- `start_date`: Filter start date
- `end_date`: Filter end date
- `limit`: Results per page
- `offset`: Pagination offset

---

## Analytics

### `GET /analytics/overview`
Get comprehensive analytics overview.

**Query Parameters:**
- `start_date`: Filter start date
- `end_date`: Filter end date
- `business_id`: Filter by specific business

**Response:**
```json
{
  "analytics": {
    "total_revenue": 50000.00,
    "total_payments": 200,
    "revenue_by_business": [...],
    "revenue_by_product": [...],
    "revenue_over_time": [...],
    "top_products": [...]
  }
}
```

### `GET /analytics/revenue`
Get revenue analytics by period.

**Query Parameters:**
- `period`: Aggregation period (daily, weekly, monthly)
- `start_date`: Filter start date
- `end_date`: Filter end date
- `business_id`: Filter by business

### `GET /analytics/products`
Get product performance analytics.

**Query Parameters:**
- `start_date`: Filter start date
- `end_date`: Filter end date
- `business_id`: Filter by business
- `limit`: Number of products (default: 50)

### `GET /analytics/businesses`
Get business performance analytics.

**Query Parameters:**
- `start_date`: Filter start date
- `end_date`: Filter end date
- `limit`: Number of businesses (default: 50)

---

## Webhooks

### `POST /webhooks/razorpay`
Razorpay webhook endpoint for payment events.

**Headers:**
- `x-razorpay-signature`: Webhook signature for verification

**Events Handled:**
- `payment.captured`: Payment successfully captured
- `payment.failed`: Payment failed

**Note:** This endpoint is called by Razorpay, not by your application.

---

## Admin Endpoints

### `GET /admin/profiles`
List all profiles with advanced filtering (admin only).

**Query Parameters:**
- `role`: Filter by role
- `search`: Search by name
- `include_stats`: Include statistics
- `limit`: Results per page
- `offset`: Pagination offset

### `POST /admin/profiles/bulk`
Perform bulk operations on profiles (admin only).

**Body:**
```json
{
  "action": "update_role",
  "profile_ids": ["uuid1", "uuid2"],
  "data": {
    "role": "business_owner"
  }
}
```

**Available Actions:**
- `update_role`: Update role for multiple profiles
- `delete`: Delete multiple profiles

---

## Error Responses

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Default: 100 requests per minute per IP
- Webhook endpoint: No rate limiting
- Admin endpoints: 50 requests per minute

---

## Pagination

All list endpoints support pagination:

**Request:**
```
GET /api/businesses?limit=20&offset=40
```

**Response:**
```json
{
  "businesses": [...],
  "pagination": {
    "limit": 20,
    "offset": 40,
    "total": 100,
    "has_more": true
  }
}
```

---

## Date Filtering

Date parameters should be in ISO 8601 format (YYYY-MM-DD):

```
GET /api/payments?start_date=2024-01-01&end_date=2024-12-31
```

---

## Testing

Use the provided test script to verify all endpoints:

```bash
node scripts/test-api.js
```

---

## Support

For issues or questions:
- Check the documentation in `/docs`
- Review the Razorpay setup guide
- Check server logs for detailed error messages