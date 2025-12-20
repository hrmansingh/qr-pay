import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const businessId = searchParams.get('business_id')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('payments')
      .select(`
        amount,
        product_id,
        business_id,
        created_at,
        products(name, base_price),
        businesses(name)
      `)
      .eq('status', 'captured')

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)
    if (businessId) query = query.eq('business_id', businessId)

    const { data: payments, error } = await query

    if (error) {
      console.error('Error fetching product analytics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product analytics' },
        { status: 500 }
      )
    }

    // Aggregate by product
    const productMap = new Map()
    
    payments.forEach(payment => {
      const key = payment.product_id
      if (!productMap.has(key)) {
        productMap.set(key, {
          product_id: payment.product_id,
          product_name: payment.products?.name || 'Unknown Product',
          base_price: payment.products?.base_price || 0,
          total_revenue: 0,
          total_sales: 0,
          average_price: 0,
          businesses: new Set()
        })
      }
      
      const product = productMap.get(key)
      product.total_revenue += payment.amount
      product.total_sales += 1
      product.businesses.add(payment.businesses?.name || 'Unknown Business')
    })

    // Convert to array and calculate averages
    const productAnalytics = Array.from(productMap.values()).map(product => ({
      ...product,
      average_price: product.total_revenue / product.total_sales,
      business_count: product.businesses.size,
      businesses: Array.from(product.businesses)
    }))

    // Sort by revenue and limit results
    productAnalytics.sort((a, b) => b.total_revenue - a.total_revenue)
    const limitedResults = productAnalytics.slice(0, limit)

    return NextResponse.json({ 
      product_analytics: limitedResults,
      total_products: productAnalytics.length,
      summary: {
        total_revenue: productAnalytics.reduce((sum, p) => sum + p.total_revenue, 0),
        total_sales: productAnalytics.reduce((sum, p) => sum + p.total_sales, 0),
        average_revenue_per_product: productAnalytics.reduce((sum, p) => sum + p.total_revenue, 0) / productAnalytics.length || 0
      }
    })
  } catch (error) {
    console.error('Product analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to generate product analytics' },
      { status: 500 }
    )
  }
}