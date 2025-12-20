import { supabaseAdmin } from '@/lib/supabase'
import { Business, Product, BusinessProduct } from '@/lib/types'

export class BusinessService {
  static async getBusinessWithProducts(businessId: string) {
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError) {
      throw new Error(`Failed to fetch business: ${businessError.message}`)
    }

    const { data: businessProducts, error: productsError } = await supabaseAdmin
      .from('business_products')
      .select(`
        *,
        products(*)
      `)
      .eq('business_id', businessId)

    if (productsError) {
      throw new Error(`Failed to fetch business products: ${productsError.message}`)
    }

    return {
      ...business,
      products: businessProducts
    }
  }

  static async getProductPrice(businessId: string, productId: string): Promise<number> {
    const { data: businessProduct, error: bpError } = await supabaseAdmin
      .from('business_products')
      .select(`
        price_override,
        products(base_price)
      `)
      .eq('business_id', businessId)
      .eq('product_id', productId)
      .single()

    if (bpError) {
      throw new Error(`Product not assigned to business: ${bpError.message}`)
    }

    return businessProduct.price_override || businessProduct.products.base_price
  }

  static async validateBusinessProduct(businessId: string, productId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('business_products')
      .select('id')
      .eq('business_id', businessId)
      .eq('product_id', productId)
      .single()

    return !error && !!data
  }

  static async getBusinessesByOwner(ownerId: string) {
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch businesses: ${error.message}`)
    }

    return data
  }

  static async getBusinessStats(businessId: string, startDate?: string, endDate?: string) {
    // Get payment stats
    let paymentQuery = supabaseAdmin
      .from('payments')
      .select('amount, status, created_at')
      .eq('business_id', businessId)

    if (startDate) paymentQuery = paymentQuery.gte('created_at', startDate)
    if (endDate) paymentQuery = paymentQuery.lte('created_at', endDate)

    const { data: payments, error: paymentError } = await paymentQuery

    if (paymentError) {
      throw new Error(`Failed to fetch payment stats: ${paymentError.message}`)
    }

    // Get product count
    const { data: products, error: productError } = await supabaseAdmin
      .from('business_products')
      .select('id')
      .eq('business_id', businessId)

    if (productError) {
      throw new Error(`Failed to fetch product count: ${productError.message}`)
    }

    const successfulPayments = payments.filter(p => p.status === 'captured')
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0)

    return {
      total_products: products.length,
      total_payments: payments.length,
      successful_payments: successfulPayments.length,
      failed_payments: payments.filter(p => p.status === 'failed').length,
      total_revenue: totalRevenue,
      average_transaction_value: successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0,
      success_rate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0
    }
  }
}