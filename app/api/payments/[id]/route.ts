import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select(`
        *,
        businesses(name, owner_id),
        products(name, base_price)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching payment:', error)
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}