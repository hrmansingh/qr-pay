import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateQRCode, generateQRCodeBuffer } from '@/lib/qr-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_id, product_id, format = 'json' } = body
    
    if (!business_id || !product_id) {
      return NextResponse.json(
        { error: 'business_id and product_id are required' },
        { status: 400 }
      )
    }

    // Get business product details with price
    const { data: businessProduct, error: bpError } = await supabaseAdmin
      .from('business_products')
      .select(`
        *,
        businesses(name),
        products(name, base_price)
      `)
      .eq('business_id', business_id)
      .eq('product_id', product_id)
      .single()

    if (bpError || !businessProduct) {
      return NextResponse.json(
        { error: 'Product not assigned to this business' },
        { status: 404 }
      )
    }

    // Calculate final price (use override if available, otherwise base price)
    const finalPrice = businessProduct.price_override || businessProduct.products.base_price
    
    const merchantUPI = process.env.MERCHANT_UPI_ID!
    const merchantName = process.env.MERCHANT_NAME!

    if (!merchantUPI || !merchantName) {
      return NextResponse.json(
        { error: 'Merchant UPI configuration missing' },
        { status: 500 }
      )
    }

    const qrData = {
      productId: product_id,
      businessId: business_id,
      amount: finalPrice,
      merchantUPI,
      merchantName
    }

    // Check if QR code already exists
    let { data: existingQR } = await supabaseAdmin
      .from('qr_scans')
      .select('*')
      .eq('business_id', business_id)
      .eq('product_id', product_id)
      .single()

    let qrCodeDataURL: string

    if (existingQR && existingQR.qr_data) {
      qrCodeDataURL = existingQR.qr_data
    } else {
      // Generate new QR code
      qrCodeDataURL = await generateQRCode(qrData)
      
      // Store QR code metadata
      const { error: insertError } = await supabaseAdmin
        .from('qr_scans')
        .upsert([{
          business_id,
          product_id,
          qr_data: qrCodeDataURL
        }])

      if (insertError) {
        console.error('Error storing QR code:', insertError)
        // Continue anyway, QR code was generated successfully
      }
    }

    if (format === 'image') {
      // Return QR code as PNG image
      const qrBuffer = await generateQRCodeBuffer(qrData)
      
      return new NextResponse(new Uint8Array(qrBuffer), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="qr-${business_id}-${product_id}.png"`
        }
      })
    }

    // Return QR code data as JSON
    return NextResponse.json({
      qr_code: qrCodeDataURL,
      business_id,
      product_id,
      amount: finalPrice,
      business_name: businessProduct.businesses.name,
      product_name: businessProduct.products.name,
      merchant_upi: merchantUPI
    })

  } catch (error) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}