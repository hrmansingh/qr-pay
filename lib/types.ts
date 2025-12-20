export interface Business {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  base_price: number
  created_at: string
}

export interface BusinessProduct {
  id: string
  business_id: string
  product_id: string
  price_override?: number
  created_at: string
}

export interface QRScan {
  id: string
  business_id: string
  product_id: string
  qr_data: string
  scanned_at: string
}

export interface Payment {
  id: string
  razorpay_payment_id: string
  business_id: string
  product_id: string
  amount: number
  currency: string
  status: string
  upi_transaction_id?: string
  provider_reference_id?: string
  created_at: string
}

export interface Order {
  id: string
  business_id: string
  status: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  price_at_time: number
  quantity: number
}

export interface Profile {
  id: string
  name: string
  role: 'admin' | 'business_owner' | 'user'
  created_at: string
  businesses?: Business[]
}

export interface CreateProfileRequest {
  id: string
  name: string
  role?: 'admin' | 'business_owner' | 'user'
}

export interface UpdateProfileRequest {
  name?: string
  role?: 'admin' | 'business_owner' | 'user'
}

export interface ProfileStats {
  total_businesses: number
  total_products: number
  total_revenue: number
  total_payments: number
  successful_payments: number
  failed_payments: number
  success_rate: number
  average_transaction_value: number
}

export interface ProfileAnalytics extends ProfileStats {
  revenue_by_business: Array<{
    business_id: string
    business_name: string
    revenue: number
    payment_count: number
  }>
  revenue_by_product: Array<{
    product_id: string
    product_name: string
    revenue: number
    payment_count: number
  }>
  revenue_over_time: Array<{
    date: string
    revenue: number
    payment_count: number
  }>
}

export interface CreateBusinessRequest {
  name: string
  owner_id: string
}

export interface CreateProductRequest {
  name: string
  base_price: number
}

export interface AssignProductRequest {
  business_id: string
  product_id: string
  price_override?: number
}

export interface AnalyticsResponse {
  total_revenue: number
  total_payments: number
  revenue_by_business: Array<{
    business_id: string
    business_name: string
    revenue: number
    payment_count: number
  }>
  revenue_by_product: Array<{
    product_id: string
    product_name: string
    revenue: number
    payment_count: number
  }>
  revenue_over_time: Array<{
    date: string
    revenue: number
    payment_count: number
  }>
  top_products: Array<{
    product_id: string
    product_name: string
    revenue: number
    payment_count: number
  }>
}