# Currency Support - Indian Rupee (INR)

The QRPay application uses Indian Rupee (₹) as the fixed currency for all product pricing.

## Features

- **Fixed INR currency**: All products are priced in Indian Rupees (₹)
- **Rupee symbol display**: Prices are displayed with the ₹ symbol
- **Input field with currency indicator**: Price input field shows ₹ symbol for clarity

## Usage

### Creating Products with INR Pricing

1. Click "Add Product" in the Products section
2. Enter product name
3. Enter the price in Indian Rupees (the ₹ symbol is shown in the input field)
4. Click "Create Product"

### Price Display

- All product prices are automatically formatted with the ₹ symbol
- The products table shows prices in Indian Rupees
- Revenue calculations are in INR

## Database Schema

The `products` table includes a `currency` column defaulting to 'INR':

```sql
ALTER TABLE products 
ADD COLUMN currency TEXT DEFAULT 'INR' NOT NULL;
```

## API Changes

The product creation API automatically sets currency to 'INR':

```typescript
interface CreateProductRequest {
  name: string
  base_price: number
  currency: string  // Always set to 'INR'
}
```

## Migration

If you have an existing database, run the migration script:

```sql
-- Run scripts/add-currency-column.sql
```

This will add the currency column with INR as the default for all products.