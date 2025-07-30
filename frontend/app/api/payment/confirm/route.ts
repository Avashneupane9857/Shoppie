import { NextRequest, NextResponse } from 'next/server'

interface FonepayResponse {
  merchantTxnId: string
  merchantOrderId: string
  amount: number
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED'
  transactionId?: string
  errorCode?: string
  errorMessage?: string
  signature?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: FonepayResponse = await request.json()
    
    console.log('Fonepay payment confirmation received:', body)
    
    // Verify the payment response
    const isValidPayment = await verifyFonepayPayment(body)
    
    if (!isValidPayment) {
      return NextResponse.json(
        { error: 'Invalid payment response' },
        { status: 400 }
      )
    }
    
    // Update order status based on payment result
    const orderUpdateResult = await updateOrderStatus(
      body.merchantOrderId,
      body.status,
      body.transactionId,
      body.amount
    )
    
    if (!orderUpdateResult.success) {
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }
    
    // Send confirmation email if payment successful
    if (body.status === 'SUCCESS') {
      await sendPaymentConfirmationEmail(body.merchantOrderId)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      orderId: body.merchantOrderId,
      status: body.status
    })
    
  } catch (error) {
    console.error('Error processing payment confirmation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Verify Fonepay payment response
async function verifyFonepayPayment(paymentData: FonepayResponse): Promise<boolean> {
  try {
    // In production, you should verify the signature
    // const isValidSignature = verifySignature(paymentData)
    // if (!isValidSignature) return false
    
    // For now, we'll do basic validation
    if (!paymentData.merchantTxnId || !paymentData.merchantOrderId || !paymentData.amount) {
      return false
    }
    
    // You can add more validation here
    // - Check if the amount matches your order
    // - Verify the transaction hasn't been processed before
    // - Validate against your database
    
    return true
  } catch (error) {
    console.error('Error verifying payment:', error)
    return false
  }
}

// Update order status in database
async function updateOrderStatus(
  orderId: string,
  status: string,
  transactionId?: string,
  amount?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // In production, update your database here
    // Example with a hypothetical database call:
    /*
    const result = await db.orders.update({
      where: { id: orderId },
      data: {
        status: status === 'SUCCESS' ? 'paid' : 'payment_failed',
        transactionId: transactionId,
        paidAmount: amount,
        paidAt: status === 'SUCCESS' ? new Date() : null
      }
    })
    */
    
    console.log(`Updating order ${orderId} to status: ${status}`)
    
    // Mock successful update
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Database update failed' }
  }
}

// Send payment confirmation email
async function sendPaymentConfirmationEmail(orderId: string): Promise<void> {
  try {
    // In production, send email using your email service
    // Example with a hypothetical email service:
    /*
    await emailService.send({
      to: userEmail,
      subject: 'Payment Confirmation',
      template: 'payment-success',
      data: { orderId, amount, etc. }
    })
    */
    
    console.log(`Sending payment confirmation email for order: ${orderId}`)
  } catch (error) {
    console.error('Error sending confirmation email:', error)
  }
} 