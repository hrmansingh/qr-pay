import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withErrorHandling, parseDateRange } from '@/lib/middleware/api-middleware'

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { startDate, endDate } = parseDateRange(request)

  // Verify profile exists
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, name, role')
    .eq('id', params.id)
    .single()

  if (profileError) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    )
  }

  // Get all businesses owned by this profile
  const { data: businesses, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name, created_at')
    .eq('owner_id', params.id)

  if (businessError) {
    console.error('Error fetching businesses:', businessError)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }

  const businessIds = businesses.map(b => b.id)

  // Initialize stats
  let stats = {
    profile: {
      id: profile.id,
      name: profile.name,
      role: profile.role
    },
    total_businesses: businesses.length,
    total_products: 0,
    total_revenue: 0,
    total_payments: 0,
    successful_payments: 0,
    failed_payments: 0,
    success_rate: 0,
    average_transaction_value: 0,
    recent_businesses: businesses.slice(0, 5),
    date_range: {
      start_date: startDate,
      end_date: endDate
    }
  }

  if (businessIds.length === 0) {
    return NextResponse.json({ stats })
  }

  // Get product count across all businesses
  const { data: businessProducts, error: productError } = await supabaseAdmin
    .from('business_products')
    .select('id')
    .in('business_id', businessIds)

  if (productError) {
    console.error('Error fetching products:', productError)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }

  stats.total_products = businessProducts.length

  // Get payment stats
  let paymentQuery = supabaseAdmin
    .from('payments')
    .select('amount, status, created_at')
    .in('business_id', businessIds)

  if (startDate) paymentQuery = paymentQuery.gte('created_at', startDate)
  if (endDate) paymentQuery = paymentQuery.lte('created_at', endDate)

  const { data: payments, error: paymentError } = await paymentQuery

  if (paymentError) {
    console.error('Error fetching payments:', paymentError)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }

  const successfulPayments = payments.filter(p => p.status === 'captured')
  const failedPayments = payments.filter(p => p.status === 'failed')
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0)

  stats.total_payments = payments.length
  stats.successful_payments = successfulPayments.length
  stats.failed_payments = failedPayments.length
  stats.total_revenue = totalRevenue
  stats.success_rate = payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0
  stats.average_transaction_value = successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0

  return NextResponse.json({ stats })
})