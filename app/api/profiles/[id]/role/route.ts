import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withErrorHandling } from '@/lib/middleware/api-middleware'

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await request.json()
  const { role, promoted_by } = body
  
  if (!role || !['admin', 'business_owner', 'user'].includes(role)) {
    return NextResponse.json(
      { error: 'Invalid role. Must be admin, business_owner, or user' },
      { status: 400 }
    )
  }

  // Get current profile to check existing role
  const { data: currentProfile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('role, name')
    .eq('id', params.id)
    .single()

  if (fetchError) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    )
  }

  if (currentProfile.role === role) {
    return NextResponse.json(
      { error: `Profile already has role: ${role}` },
      { status: 400 }
    )
  }

  // Update the role
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile role:', error)
    return NextResponse.json(
      { error: 'Failed to update profile role' },
      { status: 500 }
    )
  }

  // Log the role change (you could create an audit log table for this)
  console.log(`Profile role changed: ${currentProfile.name} (${params.id}) from ${currentProfile.role} to ${role}${promoted_by ? ` by ${promoted_by}` : ''}`)

  return NextResponse.json({ 
    profile,
    message: `Profile role updated from ${currentProfile.role} to ${role}`
  })
})