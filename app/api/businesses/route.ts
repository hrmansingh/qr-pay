import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateBusinessRequest } from '@/lib/types'

export async function GET() {
  try {
    const { data: businesses, error } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching businesses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ businesses })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBusinessRequest = await request.json()
    
    if (!body.name || !body.owner_id) {
      return NextResponse.json(
        { error: 'Name and owner_id are required' },
        { status: 400 }
      )
    }

    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .insert([{
        name: body.name,
        owner_id: body.owner_id
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating business:', error)
      return NextResponse.json(
        { error: 'Failed to create business' },
        { status: 500 }
      )
    }

    return NextResponse.json({ business }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}