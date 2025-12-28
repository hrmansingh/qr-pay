import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    if (body.price_override !== undefined && body.price_override < 0) {
      return NextResponse.json(
        { error: 'Price override must be a positive number' },
        { status: 400 }
      )
    }

    const { data: businessProduct, error } = await supabaseAdmin
      .from('business_products')
      .update({ price_override: body.price_override })
      .eq('id', id)
      .select(`
        *,
        businesses(name),
        products(name, base_price)
      `)
      .single()

    if (error) {
      console.error('Error updating business product:', error)
      return NextResponse.json(
        { error: 'Failed to update business product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ businessProduct })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabaseAdmin
      .from('business_products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing product from business:', error)
      return NextResponse.json(
        { error: 'Failed to remove product from business' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Product removed from business successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}