'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { X, RefreshCw, Home, ShoppingBag } from 'lucide-react'

function PaymentCancelContent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    // Simulate fetching order details from backend
    const fetchOrderDetails = async () => {
      try {
        // In real implementation, make API call to your backend
        // const response = await fetch(`/api/orders/${orderId}`)
        // const data = await response.json()
        
        // Mock data for now
        const mockOrderDetails = {
          orderId: orderId || 'ORD-001',
          amount: '245.00',
          status: 'cancelled',
          items: [
            { name: 'Gradient Graphic T-shirt', quantity: 1, price: 145.00 },
            { name: 'H1 Gamepad', quantity: 1, price: 100.00 }
          ]
        }
        
        setOrderDetails(mockOrderDetails)
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#E73C17] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cancellation Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">You cancelled the payment process. Your order is still pending.</p>
        </div>

        {/* Order Details Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderDetails?.orderId}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">Rs. {orderDetails?.amount}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Pending Payment
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6">
            <h3 className="font-medium text-black mb-3">Order Items:</h3>
            <div className="space-y-2">
              {orderDetails?.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                  <span className="font-medium">Rs. {item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <Link 
            href="/check-out"
            className="flex-1 bg-[#E73C17] hover:bg-[#d63615] text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Complete Payment
          </Link>
          
          <Link 
            href="/"
            className="flex-1 bg-white hover:bg-gray-50 text-[#E73C17] py-3 px-6 rounded-lg font-semibold transition-colors border border-[#E73C17] flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto mt-8 text-center text-sm text-gray-500">
          <p>Your order is saved and ready for payment completion.</p>
          <p className="mt-1">You can complete the payment anytime from your orders page.</p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentCancel() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#E73C17] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  )
} 