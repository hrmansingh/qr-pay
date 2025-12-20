import Razorpay from 'razorpay'
import crypto from 'crypto'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

export function generateUPIIntent(
  merchantUPI: string,
  amount: number,
  transactionNote: string,
  merchantName: string
): string {
  const upiParams = new URLSearchParams({
    pa: merchantUPI,
    pn: merchantName,
    am: amount.toString(),
    cu: 'INR',
    tn: transactionNote,
  })
  
  return `upi://pay?${upiParams.toString()}`
}