import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { CreateProductRequest } from '@/lib/types'

export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products })
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
    const body: CreateProductRequest = await request.json()
    
    if (!body.name || body.base_price === undefined) {
      return NextResponse.json(
        { error: 'Name and base_price are required' },
        { status: 400 }
      )
    }

    if (body.base_price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([{
        name: body.name,
        base_price: body.base_price,
        currency: body.currency || 'INR'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}