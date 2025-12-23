import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withErrorHandling, parseDateRange } from '@/lib/middleware/api-middleware'

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { startDate, endDate } = parseDateRange(request)

  // Get all businesses owned by this profile
  const { data: businesses, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('owner_id', params.id)

  if (businessError) {
    console.error('Error fetching profile businesses:', businessError)
    return NextResponse.json(
      { error: 'Failed to fetch profile businesses' },
      { status: 500 }
    )
  }

  const businessIds = businesses.map(b => b.id)

  if (businessIds.length === 0) {
    return NextResponse.json({
      analytics: {
        total_revenue: 0,
        total_payments: 0,
        total_businesses: 0,
        total_products: 0,
        success_rate: 0,
        revenue_by_business: [],
        revenue_by_product: [],
        revenue_over_time: []
      }
    })
  }

  // Build payment query for all user's businesses
  let paymentQuery = supabaseAdmin
    .from('payments')
    .select(`
      amount,
      status,
      created_at,
      business_id,
      product_id,
      businesses(name),
      products(name)
    `)
    .in('business_id', businessIds)

  if (startDate) paymentQuery = paymentQuery.gte('created_at', startDate)
  if (endDate) paymentQuery = paymentQuery.lte('created_at', endDate)

  const { data: payments, error: paymentError } = await paymentQuery

  if (paymentError) {
    console.error('Error fetching payments:', paymentError)
    return NextResponse.json(
      { error: 'Failed to fetch payment data' },
      { status: 500 }
    )
  }

  // Get total product count across all businesses
  const { data: businessProducts, error: productError } = await supabaseAdmin
    .from('business_products')
    .select('id')
    .in('business_id', businessIds)

  if (productError) {
    console.error('Error fetching business products:', productError)
    return NextResponse.json(
      { error: 'Failed to fetch product data' },
      { status: 500 }
    )
  }

  // Calculate analytics
  const successfulPayments = payments.filter(p => p.status === 'captured')
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0)

  // Revenue by business
  const businessMap = new Map()
  successfulPayments.forEach(payment => {
    const key = payment.business_id
    if (!businessMap.has(key)) {
      businessMap.set(key, {
        business_id: payment.business_id,
        business_name: Array.isArray(payment.businesses) ? payment.businesses[0]?.name : (payment.businesses as any)?.name || 'Unknown',
        revenue: 0,
        payment_count: 0
      })
    }
    const business = businessMap.get(key)
    business.revenue += payment.amount
    business.payment_count += 1
  })

  // Revenue by product
  const productMap = new Map()
  successfulPayments.forEach(payment => {
    const key = payment.product_id
    if (!productMap.has(key)) {
      productMap.set(key, {
        product_id: payment.product_id,
        product_name: Array.isArray(payment.products) ? payment.products[0]?.name : (payment.products as any)?.name || 'Unknown',
        revenue: 0,
        payment_count: 0
      })
    }
    const product = productMap.get(key)
    product.revenue += payment.amount
    product.payment_count += 1
  })

  // Revenue over time (daily)
  const dailyMap = new Map()
  successfulPayments.forEach(payment => {
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

  const analytics = {
    total_revenue: totalRevenue,
    total_payments: payments.length,
    successful_payments: successfulPayments.length,
    failed_payments: payments.filter(p => p.status === 'failed').length,
    total_businesses: businesses.length,
    total_products: businessProducts.length,
    success_rate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0,
    average_transaction_value: successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0,
    revenue_by_business: Array.from(businessMap.values()).sort((a, b) => b.revenue - a.revenue),
    revenue_by_product: Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue),
    revenue_over_time: Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  }

  return NextResponse.json({ analytics })
})