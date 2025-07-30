'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RefreshCw, Home, HelpCircle, Phone } from 'lucide-react'

export default function PaymentFailure() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')
  const errorCode = searchParams.get('errorCode')
  const errorMessage = searchParams.get('errorMessage')

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
          status: 'failed',
          items: [
            { name: 'Gradient Graphic T-shirt', quantity: 1, price: 145.00 },
            { name: 'H1 Gamepad', quantity: 1, price: 100.00 }
          ],
          errorCode: errorCode || 'PAYMENT_FAILED',
          errorMessage: errorMessage || 'Payment was not completed successfully'
        }
        
        setOrderDetails(mockOrderDetails)
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, errorCode, errorMessage])

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
        {/* Failure Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Payment Failed</h1>
          <p className="text-gray-600">We couldn&apos;t process your payment. Please try again or contact support.</p>
        </div>

        {/* Error Details Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Error Details</h2>
          
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
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Failed
              </span>
            </div>
            
            <div className="flex justify-between items-start py-2 border-b border-gray-100">
              <span className="text-gray-600">Error Code:</span>
              <span className="font-medium text-red-600">{orderDetails?.errorCode}</span>
            </div>
            
            <div className="py-2">
              <span className="text-gray-600 block mb-2">Error Message:</span>
              <p className="text-red-600 bg-red-50 p-3 rounded-lg">
                {orderDetails?.errorMessage}
              </p>
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
        <div className="max-w-2xl mx-auto space-y-4">
          <Link
            href={`/check-out?orderId=${orderDetails?.orderId}`}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E73C17] text-white rounded-lg hover:bg-[#d63615] transition-colors font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
            Try Payment Again
          </Link>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </Link>
            
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </div>

        {/* Support Information */}
        <div className="max-w-2xl mx-auto mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-black mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Check your internet connection and try again</p>
            <p>• Ensure your payment method has sufficient funds</p>
            <p>• Contact our support team if the problem persists</p>
            <div className="flex items-center gap-2 mt-3">
              <Phone className="w-4 h-4 text-[#E73C17]" />
              <span>Support: +977-1-4XXXXXX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 