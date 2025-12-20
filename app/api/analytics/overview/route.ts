import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const businessId = searchParams.get('business_id')

    // Build base query
    let baseQuery = supabaseAdmin
      .from('payments')
      .select('*')
      .eq('status', 'captured')

    if (startDate) {
      baseQuery = baseQuery.gte('created_at', startDate)
    }
    if (endDate) {
      baseQuery = baseQuery.lte('created_at', endDate)
    }
    if (businessId) {
      baseQuery = baseQuery.eq('business_id', businessId)
    }

    // Get total revenue and payment count
    const { data: payments, error: paymentsError } = await baseQuery

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError)
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      )
    }

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalPayments = payments.length

    // Get revenue by business
    const revenueByBusiness = await getRevenueByBusiness(startDate, endDate, businessId)
    
    // Get revenue by product
    const revenueByProduct = await getRevenueByProduct(startDate, endDate, businessId)
    
    // Get revenue over time (daily)
    const revenueOverTime = await getRevenueOverTime(startDate, endDate, businessId)
    
    // Get top products
    const topProducts = revenueByProduct
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    const analytics = {
      total_revenue: totalRevenue,
      total_payments: totalPayments,
      revenue_by_business: revenueByBusiness,
      revenue_by_product: revenueByProduct,
      revenue_over_time: revenueOverTime,
      top_products: topProducts
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
}

async function getRevenueByBusiness(startDate?: string | null, endDate?: string | null, businessId?: string | null) {
  let query = supabaseAdmin
    .from('payments')
    .select(`
      amount,
      business_id,
      businesses(name)
    `)
    .eq('status', 'captured')

  if (startDate) query = query.gte('created_at', startDate)
  if (endDate) query = query.lte('created_at', endDate)
  if (businessId) query = query.eq('business_id', businessId)

  const { data: payments } = await query

  if (!payments) return []

  const businessMap = new Map()
  
  payments.forEach(payment => {
    const key = payment.business_id
    if (!businessMap.has(key)) {
      businessMap.set(key, {
        business_id: payment.business_id,
        business_name: payment.businesses?.name || 'Unknown',
        revenue: 0,
        payment_count: 0
      })
    }
    
    const business = businessMap.get(key)
    business.revenue += payment.amount
    business.payment_count += 1
  })

  return Array.from(businessMap.values())
}

async function getRevenueByProduct(startDate?: string | null, endDate?: string | null, businessId?: string | null) {
  let query = supabaseAdmin
    .from('payments')
    .select(`
      amount,
      product_id,
      products(name)
    `)
    .eq('status', 'captured')

  if (startDate) query = query.gte('created_at', startDate)
  if (endDate) query = query.lte('created_at', endDate)
  if (businessId) query = query.eq('business_id', businessId)

  const { data: payments } = await query

  if (!payments) return []

  const productMap = new Map()
  
  payments.forEach(payment => {
    const key = payment.product_id
    if (!productMap.has(key)) {
      productMap.set(key, {
        product_id: payment.product_id,
        product_name: payment.products?.name || 'Unknown',
        revenue: 0,
        payment_count: 0
      })
    }
    
    const product = productMap.get(key)
    product.revenue += payment.amount
    product.payment_count += 1
  })

  return Array.from(productMap.values())
}

async function getRevenueOverTime(startDate?: string | null, endDate?: string | null, businessId?: string | null) {
  let query = supabaseAdmin
    .from('payments')
    .select('amount, created_at')
    .eq('status', 'captured')

  if (startDate) query = query.gte('created_at', startDate)
  if (endDate) query = query.lte('created_at', endDate)
  if (businessId) query = query.eq('business_id', businessId)

  const { data: payments } = await query

  if (!payments) return []

  const dailyMap = new Map()
  
  payments.forEach(payment => {
    const date = new Date(payment.created_at).toISOString().split('T')[0]
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        revenue: 0,
        payment_count: 0
      })
    }
    
    const day = dailyMap.get(date)
    day.revenue += payment.amount
    day.payment_count += 1
  })

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}