import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('business_id')
    const productId = searchParams.get('product_id')

    let query = supabaseAdmin
      .from('qr_scans')
      .select(`
        *,
        businesses(name),
        products(name, base_price)
      `)
      .order('scanned_at', { ascending: false })

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data: qrCodes, error } = await query

    if (error) {
      console.error('Error fetching QR codes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch QR codes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ qrCodes })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}