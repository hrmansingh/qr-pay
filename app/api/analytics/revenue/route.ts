import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily' // daily, weekly, monthly
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const businessId = searchParams.get('business_id')

    let query = supabaseAdmin
      .from('payments')
      .select('amount, created_at, business_id')
      .eq('status', 'captured')

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)
    if (businessId) query = query.eq('business_id', businessId)

    const { data: payments, error } = await query

    if (error) {
      console.error('Error fetching revenue data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch revenue data' },
        { status: 500 }
      )
    }

    const revenueData = aggregateRevenue(payments, period)

    return NextResponse.json({ 
      revenue_data: revenueData,
      period,
      total_revenue: payments.reduce((sum, p) => sum + p.amount, 0),
      total_transactions: payments.length
    })
  } catch (error) {
    console.error('Revenue analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to generate revenue analytics' },
      { status: 500 }
    )
  }
}

function aggregateRevenue(payments: any[], period: string) {
  const aggregated = new Map()

  payments.forEach(payment => {
    let key: string
    const date = new Date(payment.created_at)

    switch (period) {
      case 'weekly':
        // Get start of week (Monday)
        const startOfWeek = new Date(date)
        startOfWeek.setDate(date.getDate() - date.getDay() + 1)
        key = startOfWeek.toISOString().split('T')[0]
        break
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'daily':
      default:
        key = date.toISOString().split('T')[0]
        break
    }

    if (!aggregated.has(key)) {
      aggregated.set(key, {
        period: key,
        revenue: 0,
        transaction_count: 0,
        date: key
      })
    }

    const entry = aggregated.get(key)
    entry.revenue += payment.amount
    entry.transaction_count += 1
  })

  return Array.from(aggregated.values()).sort((a, b) => a.date.localeCompare(b.date))
}