import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withErrorHandling, parsePaginationParams } from '@/lib/middleware/api-middleware'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  const search = searchParams.get('search')
  const includeStats = searchParams.get('include_stats') === 'true'
  const { limit, offset } = parsePaginationParams(request)

  let query = supabaseAdmin
    .from('profiles')
    .select(`
      *,
      businesses(id, name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (role) {
    query = query.eq('role', role)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data: profiles, error, count } = await query

  if (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }

  let profilesWithStats = profiles

  if (includeStats) {
    // Add statistics for each profile
    profilesWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const businessIds = profile.businesses?.map((b: any) => b.id) || []
        
        if (businessIds.length === 0) {
          return {
            ...profile,
            stats: {
              total_businesses: 0,
              total_products: 0,
              total_revenue: 0,
              total_payments: 0,
              success_rate: 0
            }
          }
        }

        // Get payment stats
        const { data: payments } = await supabaseAdmin
          .from('payments')
          .select('amount, status')
          .in('business_id', businessIds)

        // Get product count
        const { data: products } = await supabaseAdmin
          .from('business_products')
          .select('id')
          .in('business_id', businessIds)

        const successfulPayments = payments?.filter(p => p.status === 'captured') || []
        const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0)

        return {
          ...profile,
          stats: {
            total_businesses: businessIds.length,
            total_products: products?.length || 0,
            total_revenue: totalRevenue,
            total_payments: payments?.length || 0,
            successful_payments: successfulPayments.length,
            success_rate: payments?.length ? (successfulPayments.length / payments.length) * 100 : 0
          }
        }
      })
    )
  }

  // Get role summary
  const { data: roleSummary } = await supabaseAdmin
    .from('profiles')
    .select('role')

  const roleStats = roleSummary?.reduce((acc: any, profile: any) => {
    acc[profile.role] = (acc[profile.role] || 0) + 1
    return acc
  }, {}) || {}

  return NextResponse.json({
    profiles: profilesWithStats,
    pagination: {
      limit,
      offset,
      total: count || 0,
      has_more: (count || 0) > offset + limit
    },
    summary: {
      total_profiles: count || 0,
      role_distribution: roleStats,
      filters_applied: {
        role,
        search,
        include_stats: includeStats
      }
    }
  })
})