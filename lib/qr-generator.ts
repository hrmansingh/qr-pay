import QRCode from 'qrcode'
import { generateUPIIntent } from './razorpay'

export interface QRCodeData {
  productId: string
  businessId: string
  amount: number
  merchantUPI: string
  merchantName: string
}

export async function generateQRCode(data: QRCodeData): Promise<string> {
  const transactionNote = `${data.productId}|${data.businessId}`
  
  const upiIntent = generateUPIIntent(
    data.merchantUPI,
    data.amount,
    transactionNote,
    data.merchantName
  )
  
  try {
    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(upiIntent, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    })
    
    return qrCodeDataURL
  } catch (error) {
    console.error('QR Code generation failed:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRCodeBuffer(data: QRCodeData): Promise<Buffer> {
  const transactionNote = `${data.productId}|${data.businessId}`
  
  const upiIntent = generateUPIIntent(
    data.merchantUPI,
    data.amount,
    transactionNote,
    data.merchantName
  )
  
  try {
    const qrCodeBuffer = await QRCode.toBuffer(upiIntent, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    })
    
    return qrCodeBuffer
  } catch (error) {
    console.error('QR Code buffer generation failed:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}