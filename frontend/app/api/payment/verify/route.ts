export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')
    const orderId = searchParams.get('orderId')
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }
    
    // Verify payment with Fonepay
    const verificationResult = await verifyPaymentWithFonepay(transactionId, orderId)
    
    if (verificationResult.success) {
      return NextResponse.json({
        success: true,
        data: verificationResult.data
      })
    } else {
      return NextResponse.json(
        { error: verificationResult.message },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function verifyPaymentWithFonepay(
  transactionId: string,
  orderId?: string | null
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // In production, make API call to Fonepay to verify payment
    // Example:
    /*
    const response = await fetch('https://getpay-uat.machbank.com/ecom-gateway/v1/secure-merchant/transactions/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FONEPAY_API_KEY}`
      },
      body: JSON.stringify({
        transactionId: transactionId,
        merchantOrderId: orderId
      })
    })
    
    const data = await response.json()
    */
    
    // Mock verification for now
    const mockVerification = {
      transactionId: transactionId,
      status: 'SUCCESS',
      amount: 245.00,
      merchantOrderId: orderId || 'ORD-001',
      timestamp: new Date().toISOString()
    }
    
    // Check if payment is successful
    if (mockVerification.status === 'SUCCESS') {
      // Update order status in database
      await updateOrderStatus(orderId || 'ORD-001', 'paid', transactionId, mockVerification.amount)
      
      return {
        success: true,
        message: 'Payment verified successfully',
        data: mockVerification
      }
    } else {
      return {
        success: false,
        message: 'Payment verification failed'
      }
    }
    
  } catch (error) {
    console.error('Error verifying payment with Fonepay:', error)
    return {
      success: false,
      message: 'Failed to verify payment'
    }
  }
}

async function updateOrderStatus(
  orderId: string,
  status: string,
  transactionId: string,
  amount: number
): Promise<void> {
  try {
    // In production, update your database here
    console.log(`Updating order ${orderId} to status: ${status}`)
    
    // Example database update:
    /*
    await db.orders.update({
      where: { id: orderId },
      data: {
        status: status,
        transactionId: transactionId,
        paidAmount: amount,
        paidAt: new Date(),
        updatedAt: new Date()
      }
    })
    */
    
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
} 