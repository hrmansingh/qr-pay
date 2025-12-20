import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('payments')
      .select(`
        amount,
        business_id,
        product_id,
        created_at,
        businesses(name, owner_id),
        products(name)
      `)
      .eq('status', 'captured')

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data: payments, error } = await query

    if (error) {
      console.error('Error fetching business analytics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch business analytics' },
        { status: 500 }
      )
    }

    // Aggregate by business
    const businessMap = new Map()
    
    payments.forEach(payment => {
      const key = payment.business_id
      if (!businessMap.has(key)) {
        businessMap.set(key, {
          business_id: payment.business_id,
          business_name: payment.businesses?.name || 'Unknown Business',
          owner_id: payment.businesses?.owner_id,
          total_revenue: 0,
          total_sales: 0,
          unique_products: new Set(),
          products: new Map(),
          first_sale: payment.created_at,
          last_sale: payment.created_at
        })
      }
      
      const business = businessMap.get(key)
      business.total_revenue += payment.amount
      business.total_sales += 1
      business.unique_products.add(payment.product_id)
      
      // Track per-product sales within business
      const productKey = payment.product_id
      if (!business.products.has(productKey)) {
        business.products.set(productKey, {
          product_id: payment.product_id,
          product_name: payment.products?.name || 'Unknown Product',
          revenue: 0,
          sales: 0
        })
      }
      
      const productData = business.products.get(productKey)
      productData.revenue += payment.amount
      productData.sales += 1
      
      // Update date range
      if (payment.created_at < business.first_sale) {
        business.first_sale = payment.created_at
      }
      if (payment.created_at > business.last_sale) {
        business.last_sale = payment.created_at
      }
    })

    // Convert to array and calculate metrics
    const businessAnalytics = Array.from(businessMap.values()).map(business => {
      const topProducts = Array.from(business.products.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      return {
        business_id: business.business_id,
        business_name: business.business_name,
        owner_id: business.owner_id,
        total_revenue: business.total_revenue,
        total_sales: business.total_sales,
        unique_products_count: business.unique_products.size,
        average_sale_value: business.total_revenue / business.total_sales,
        top_products: topProducts,
        first_sale: business.first_sale,
        last_sale: business.last_sale,
        days_active: Math.ceil((new Date(business.last_sale).getTime() - new Date(business.first_sale).getTime()) / (1000 * 60 * 60 * 24)) + 1
      }
    })

    // Sort by revenue and limit results
    businessAnalytics.sort((a, b) => b.total_revenue - a.total_revenue)
    const limitedResults = businessAnalytics.slice(0, limit)

    return NextResponse.json({ 
      business_analytics: limitedResults,
      total_businesses: businessAnalytics.length,
      summary: {
        total_revenue: businessAnalytics.reduce((sum, b) => sum + b.total_revenue, 0),
        total_sales: businessAnalytics.reduce((sum, b) => sum + b.total_sales, 0),
        average_revenue_per_business: businessAnalytics.reduce((sum, b) => sum + b.total_revenue, 0) / businessAnalytics.length || 0,
        average_products_per_business: businessAnalytics.reduce((sum, b) => sum + b.unique_products_count, 0) / businessAnalytics.length || 0
      }
    })
  } catch (error) {
    console.error('Business analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to generate business analytics' },
      { status: 500 }
    )
  }
}