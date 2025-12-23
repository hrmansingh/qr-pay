import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling, validateRequiredFields } from '@/lib/middleware/api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select(`
      *,
      businesses(
        id,
        name,
        created_at
      )
    `)
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ profile })
})

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await request.json()
  
  if (body.name) {
    validateRequiredFields(body, ['name'])
  }
  
  if (body.role && !['admin', 'business_owner', 'user'].includes(body.role)) {
    return NextResponse.json(
      { error: 'Invalid role. Must be admin, business_owner, or user' },
      { status: 400 }
    )
  }

  const updateData: any = {}
  if (body.name) updateData.name = body.name
  if (body.role) updateData.role = body.role

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }

  return NextResponse.json({ profile })
})

export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  // Check if profile has associated businesses
  const { data: businesses, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('owner_id', params.id)

  if (businessError) {
    console.error('Error checking businesses:', businessError)
    return NextResponse.json(
      { error: 'Failed to check profile dependencies' },
      { status: 500 }
    )
  }

  if (businesses && businesses.length > 0) {
    return NextResponse.json(
      { 
        error: 'Cannot delete profile with associated businesses',
        businesses_count: businesses.length
      },
      { status: 409 }
    )
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', params.id)

  if (error) {
    console.error('Error deleting profile:', error)
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Profile deleted successfully' })
})