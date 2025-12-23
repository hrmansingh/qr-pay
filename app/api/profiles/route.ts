import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling, validateRequiredFields } from '@/lib/middleware/api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (role) {
    query = query.eq('role', role)
  }

  const { data: profiles, error, count } = await query

  if (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }

  return NextResponse.json({ 
    profiles,
    pagination: {
      limit,
      offset,
      total: count || 0,
      has_more: (count || 0) > offset + limit
    }
  })
})

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  validateRequiredFields(body, ['id', 'name'])
  
  if (body.role && !['admin', 'business_owner', 'user'].includes(body.role)) {
    return NextResponse.json(
      { error: 'Invalid role. Must be admin, business_owner, or user' },
      { status: 400 }
    )
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .insert([{
      id: body.id,
      name: body.name,
      role: body.role || 'user'
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }

  return NextResponse.json({ profile }, { status: 201 })
})