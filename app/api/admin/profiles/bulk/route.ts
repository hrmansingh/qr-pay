import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withErrorHandling, validateRequiredFields } from '@/lib/middleware/api-middleware'

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  const { action, profile_ids, data } = body
  
  validateRequiredFields(body, ['action', 'profile_ids'])
  
  if (!Array.isArray(profile_ids) || profile_ids.length === 0) {
    return NextResponse.json(
      { error: 'profile_ids must be a non-empty array' },
      { status: 400 }
    )
  }

  const validActions = ['update_role', 'delete', 'activate', 'deactivate']
  if (!validActions.includes(action)) {
    return NextResponse.json(
      { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
      { status: 400 }
    )
  }

  const results = {
    success: [],
    failed: [],
    total: profile_ids.length
  }

  try {
    switch (action) {
      case 'update_role':
        if (!data?.role || !['admin', 'business_owner', 'user'].includes(data.role)) {
          return NextResponse.json(
            { error: 'Valid role is required for update_role action' },
            { status: 400 }
          )
        }

        for (const profileId of profile_ids) {
          try {
            const { data: profile, error } = await supabaseAdmin
              .from('profiles')
              .update({ role: data.role })
              .eq('id', profileId)
              .select('id, name, role')
              .single()

            if (error) throw error

            results.success.push({
              profile_id: profileId,
              profile: profile,
              message: `Role updated to ${data.role}`
            })
          } catch (error: any) {
            results.failed.push({
              profile_id: profileId,
              error: error.message
            })
          }
        }
        break

      case 'delete':
        for (const profileId of profile_ids) {
          try {
            // Check for associated businesses
            const { data: businesses } = await supabaseAdmin
              .from('businesses')
              .select('id')
              .eq('owner_id', profileId)

            if (businesses && businesses.length > 0) {
              throw new Error(`Profile has ${businesses.length} associated businesses`)
            }

            const { error } = await supabaseAdmin
              .from('profiles')
              .delete()
              .eq('id', profileId)

            if (error) throw error

            results.success.push({
              profile_id: profileId,
              message: 'Profile deleted successfully'
            })
          } catch (error: any) {
            results.failed.push({
              profile_id: profileId,
              error: error.message
            })
          }
        }
        break

      default:
        return NextResponse.json(
          { error: `Action ${action} not implemented yet` },
          { status: 501 }
        )
    }

    return NextResponse.json({
      message: `Bulk ${action} completed`,
      results,
      summary: {
        total: results.total,
        successful: results.success.length,
        failed: results.failed.length,
        success_rate: (results.success.length / results.total) * 100
      }
    })

  } catch (error: any) {
    console.error('Bulk operation error:', error)
    return NextResponse.json(
      { error: 'Bulk operation failed', details: error.message },
      { status: 500 }
    )
  }
})