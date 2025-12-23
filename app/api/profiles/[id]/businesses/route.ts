import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withErrorHandling } from '@/lib/middleware/api-middleware'

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(request.url)
  const includeStats = searchParams.get('include_stats') === 'true'

  let query = supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('owner_id', params.id)
    .order('created_at', { ascending: false })

  const { data: businesses, error } = await query

  if (error) {
    console.error('Error fetching profile businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }

  if (!includeStats) {
    return NextResponse.json({ businesses })
  }

  // Include business statistics
  const businessesWithStats = await Promise.all(
    businesses.map(async (business) => {
      // Get payment stats
      const { data: payments } = await supabaseAdmin
        .from('payments')
        .select('amount, status')
        .eq('business_id', business.id)

      // Get product count
      const { data: products } = await supabaseAdmin
        .from('business_products')
        .select('id')
        .eq('business_id', business.id)

      const successfulPayments = payments?.filter(p => p.status === 'captured') || []
      const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0)

      return {
        ...business,
        stats: {
          total_products: products?.length || 0,
          total_payments: payments?.length || 0,
          successful_payments: successfulPayments.length,
          total_revenue: totalRevenue,
          success_rate: payments?.length ? (successfulPayments.length / payments.length) * 100 : 0
        }
      }
    })
  )

  return NextResponse.json({ businesses: businessesWithStats })
})