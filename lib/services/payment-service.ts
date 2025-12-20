import { supabaseAdmin } from '@/lib/supabase'
import { Payment } from '@/lib/types'

export class PaymentService {
  static async getPaymentsByBusiness(businessId: string, startDate?: string, endDate?: string) {
    let query = supabaseAdmin
      .from('payments')
      .select(`
        *,
        products(name, base_price),
        businesses(name)
      `)
      .eq('business_id', businessId)
      .eq('status', 'captured')
      .order('created_at', { ascending: false })

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }

    return data
  }

  static async getPaymentsByProduct(productId: string, startDate?: string, endDate?: string) {
    let query = supabaseAdmin
      .from('payments')
      .select(`
        *,
        products(name, base_price),
        businesses(name)
      `)
      .eq('product_id', productId)
      .eq('status', 'captured')
      .order('created_at', { ascending: false })

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }

    return data
  }

  static async getPaymentById(paymentId: string) {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select(`
        *,
        products(name, base_price),
        businesses(name)
      `)
      .eq('id', paymentId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch payment: ${error.message}`)
    }

    return data
  }

  static async getTotalRevenue(businessId?: string, startDate?: string, endDate?: string) {
    let query = supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('status', 'captured')

    if (businessId) query = query.eq('business_id', businessId)
    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to calculate revenue: ${error.message}`)
    }

    return data.reduce((sum, payment) => sum + payment.amount, 0)
  }

  static async getPaymentStats(businessId?: string, startDate?: string, endDate?: string) {
    let query = supabaseAdmin
      .from('payments')
      .select('amount, status')

    if (businessId) query = query.eq('business_id', businessId)
    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch payment stats: ${error.message}`)
    }

    const stats = {
      total_payments: data.length,
      successful_payments: data.filter(p => p.status === 'captured').length,
      failed_payments: data.filter(p => p.status === 'failed').length,
      total_revenue: data.filter(p => p.status === 'captured').reduce((sum, p) => sum + p.amount, 0),
      success_rate: 0
    }

    stats.success_rate = stats.total_payments > 0 ? (stats.successful_payments / stats.total_payments) * 100 : 0

    return stats
  }
}