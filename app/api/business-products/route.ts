import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { AssignProductRequest } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('business_id')

    let query = supabaseAdmin
      .from('business_products')
      .select(`
        *,
        businesses(name),
        products(name, base_price)
      `)
      .order('created_at', { ascending: false })

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    const { data: businessProducts, error } = await query

    if (error) {
      console.error('Error fetching business products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch business products' },
        { status: 500 }
      )
    }

    return NextResponse.json({ businessProducts })
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
    const body: AssignProductRequest = await request.json()
    
    if (!body.business_id || !body.product_id) {
      return NextResponse.json(
        { error: 'business_id and product_id are required' },
        { status: 400 }
      )
    }

    if (body.price_override !== undefined && body.price_override < 0) {
      return NextResponse.json(
        { error: 'Price override must be a positive number' },
        { status: 400 }
      )
    }

    // Check if business exists
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('id', body.business_id)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Check if product exists
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', body.product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if assignment already exists
    const { data: existing } = await supabaseAdmin
      .from('business_products')
      .select('id')
      .eq('business_id', body.business_id)
      .eq('product_id', body.product_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Product already assigned to this business' },
        { status: 409 }
      )
    }

    const { data: businessProduct, error } = await supabaseAdmin
      .from('business_products')
      .insert([{
        business_id: body.business_id,
        product_id: body.product_id,
        price_override: body.price_override
      }])
      .select(`
        *,
        businesses(name),
        products(name, base_price)
      `)
      .single()

    if (error) {
      console.error('Error assigning product to business:', error)
      return NextResponse.json(
        { error: 'Failed to assign product to business' },
        { status: 500 }
      )
    }

    return NextResponse.json({ businessProduct }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}