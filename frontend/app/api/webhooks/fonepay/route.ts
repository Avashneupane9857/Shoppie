import { NextRequest, NextResponse } from 'next/server'

interface FonepayWebhookData {
  merchantTxnId: string
  merchantOrderId: string
  amount: number
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED'
  transactionId?: string
  errorCode?: string
  errorMessage?: string
  signature?: string
  timestamp?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: FonepayWebhookData = await request.json()
    
    console.log('Fonepay webhook received:', body)
    
    // Verify webhook signature (important for security)
    const isValidSignature = await verifyWebhookSignature(request, body)
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    // Process the webhook based on status
    switch (body.status) {
      case 'SUCCESS':
        await handleSuccessfulPayment(body)
        break
      case 'FAILED':
        await handleFailedPayment(body)
        break
      case 'CANCELLED':
        await handleCancelledPayment(body)
        break
      default:
        console.warn('Unknown payment status:', body.status)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error processing Fonepay webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests (sometimes used for webhook verification)
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')
  
  if (challenge) {
    // Echo back the challenge for webhook verification
    return NextResponse.json({ challenge })
  }
  
  return NextResponse.json({ status: 'webhook endpoint active' })
}

// Verify webhook signature
async function verifyWebhookSignature(
  request: NextRequest,
  body: FonepayWebhookData
): Promise<boolean> {
  try {
    // In production, implement proper signature verification
    // Example:
    /*
    const signature = request.headers.get('x-fonepay-signature')
    const payload = JSON.stringify(body)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.FONEPAY_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex')
    
    return signature === expectedSignature
    */
    
    // For now, return true (implement proper verification in production)
    return true
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

// Handle successful payment
async function handleSuccessfulPayment(data: FonepayWebhookData) {
  try {
    console.log(`Processing successful payment for order: ${data.merchantOrderId}`)
    
    // Update order status to paid
    await updateOrderStatus(data.merchantOrderId, 'paid', data.transactionId, data.amount)
    
    // Send confirmation email
    await sendPaymentConfirmationEmail(data.merchantOrderId, data.amount)
    
    // Update inventory (if needed)
    await updateInventory(data.merchantOrderId)
    
    // Log the successful transaction
    console.log(`Payment successful - Order: ${data.merchantOrderId}, Transaction: ${data.transactionId}`)
    
  } catch (error) {
    console.error('Error handling successful payment:', error)
  }
}

// Handle failed payment
async function handleFailedPayment(data: FonepayWebhookData) {
  try {
    console.log(`Processing failed payment for order: ${data.merchantOrderId}`)
    
    // Update order status to payment_failed
    await updateOrderStatus(data.merchantOrderId, 'payment_failed')
    
    // Send failure notification email
    await sendPaymentFailureEmail(data.merchantOrderId, data.errorMessage)
    
    // Log the failed transaction
    console.log(`Payment failed - Order: ${data.merchantOrderId}, Error: ${data.errorMessage}`)
    
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
}

// Handle cancelled payment
async function handleCancelledPayment(data: FonepayWebhookData) {
  try {
    console.log(`Processing cancelled payment for order: ${data.merchantOrderId}`)
    
    // Update order status to cancelled
    await updateOrderStatus(data.merchantOrderId, 'cancelled')
    
    // Send cancellation notification email
    await sendPaymentCancellationEmail(data.merchantOrderId)
    
    // Log the cancelled transaction
    console.log(`Payment cancelled - Order: ${data.merchantOrderId}`)
    
  } catch (error) {
    console.error('Error handling cancelled payment:', error)
  }
}

// Update order status in database
async function updateOrderStatus(
  orderId: string,
  status: string,
  transactionId?: string,
  amount?: number
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
        paidAt: status === 'paid' ? new Date() : null,
        updatedAt: new Date()
      }
    })
    */
    
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

// Send payment confirmation email
async function sendPaymentConfirmationEmail(orderId: string, amount: number): Promise<void> {
  try {
    console.log(`Sending payment confirmation email for order: ${orderId}`)
    
    // In production, send email using your email service
    /*
    await emailService.send({
      to: userEmail,
      subject: 'Payment Confirmation - Order #' + orderId,
      template: 'payment-success',
      data: { orderId, amount, etc. }
    })
    */
    
  } catch (error) {
    console.error('Error sending confirmation email:', error)
  }
}

// Send payment failure email
async function sendPaymentFailureEmail(orderId: string, errorMessage?: string): Promise<void> {
  try {
    console.log(`Sending payment failure email for order: ${orderId}`)
    
    // In production, send email using your email service
    /*
    await emailService.send({
      to: userEmail,
      subject: 'Payment Failed - Order #' + orderId,
      template: 'payment-failure',
      data: { orderId, errorMessage, etc. }
    })
    */
    
  } catch (error) {
    console.error('Error sending failure email:', error)
  }
}

// Send payment cancellation email
async function sendPaymentCancellationEmail(orderId: string): Promise<void> {
  try {
    console.log(`Sending payment cancellation email for order: ${orderId}`)
    
    // In production, send email using your email service
    /*
    await emailService.send({
      to: userEmail,
      subject: 'Payment Cancelled - Order #' + orderId,
      template: 'payment-cancellation',
      data: { orderId, etc. }
    })
    */
    
  } catch (error) {
    console.error('Error sending cancellation email:', error)
  }
}

// Update inventory (if needed)
async function updateInventory(orderId: string): Promise<void> {
  try {
    console.log(`Updating inventory for order: ${orderId}`)
    
    // In production, update your inventory here
    /*
    const order = await db.orders.findUnique({
      where: { id: orderId },
      include: { items: true }
    })
    
    for (const item of order.items) {
      await db.products.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }
    */
    
  } catch (error) {
    console.error('Error updating inventory:', error)
  }
} 