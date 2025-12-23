import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyWebhookSignature } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    
    if (!signature) {
      console.error('Missing Razorpay signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    
    console.log('Razorpay webhook event:', event.event)

    if (event.event === 'payment.captured') {
      await handlePaymentCaptured(event.payload.payment.entity)
    } else if (event.event === 'payment.failed') {
      await handlePaymentFailed(event.payload.payment.entity)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    console.log('Processing captured payment:', payment.id)
    
    // Extract product and business IDs from transaction note
    const transactionNote = payment.notes?.transaction_note || payment.description || ''
    const [productId, businessId] = transactionNote.split('|')
    
    if (!productId || !businessId) {
      console.error('Invalid transaction note format:', transactionNote)
      return
    }

    // Verify business and product exist
    const { data: businessProduct, error: bpError } = await supabaseAdmin
      .from('business_products')
      .select('*')
      .eq('business_id', businessId)
      .eq('product_id', productId)
      .single()

    if (bpError || !businessProduct) {
      console.error('Business product not found:', businessId, productId)
      return
    }

    // Store payment record
    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([{
        razorpay_payment_id: payment.id,
        business_id: businessId,
        product_id: productId,
        amount: payment.amount / 100, // Convert from paise to rupees
        currency: payment.currency,
        status: 'captured',
        upi_transaction_id: payment.acquirer_data?.upi_transaction_id,
        provider_reference_id: payment.acquirer_data?.rrn
      }])
      .select()
      .single()

    if (paymentError) {
      console.error('Error storing payment:', paymentError)
      return
    }

    console.log('Payment stored successfully:', paymentRecord.id)

    // Create order record
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        business_id: businessId,
        status: 'completed'
      }])
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return
    }

    // Create order item
    const { error: orderItemError } = await supabaseAdmin
      .from('order_items')
      .insert([{
        order_id: order.id,
        product_id: productId,
        price_at_time: payment.amount / 100,
        quantity: 1
      }])

    if (orderItemError) {
      console.error('Error creating order item:', orderItemError)
    }

  } catch (error) {
    console.error('Error processing captured payment:', error)
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    console.log('Processing failed payment:', payment.id)
    
    const transactionNote = payment.notes?.transaction_note || payment.description || ''
    const [productId, businessId] = transactionNote.split('|')
    
    if (!productId || !businessId) {
      console.error('Invalid transaction note format:', transactionNote)
      return
    }

    // Store failed payment record for analytics
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([{
        razorpay_payment_id: payment.id,
        business_id: businessId,
        product_id: productId,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: 'failed'
      }])

    if (paymentError) {
      console.error('Error storing failed payment:', paymentError)
    }

  } catch (error) {
    console.error('Error processing failed payment:', error)
  }
}