import { useState } from 'react';
import FonepayPayment from './FonepayPayment';

interface PaymentButtonProps {
  amount: number;
  orderId: string;
  userId: string;
  onSuccess?: (data: any) => void;
  onFailure?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({
  amount,
  orderId,
  userId,
  onSuccess,
  onFailure,
  onCancel,
  className = '',
  children
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fonepay = FonepayPayment();

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate unique transaction ID
      const merchantTxnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentData = {
        amount: amount,
        merchantTxnId: merchantTxnId,
        merchantOrderId: orderId,
        merchantUserId: userId,
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
        failureUrl: `${window.location.origin}/payment/failure?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/payment/cancel?orderId=${orderId}`,
        remarks: `Payment for order ${orderId}`
      };

      const result = await fonepay.createPayment(paymentData);

      if (result.success) {
        console.log('Payment initiated successfully:', result.data);
        // The SDK will handle the redirect to Fonepay
        onSuccess?.(result.data);
      } else {
        setError(result.message);
        onFailure?.(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onFailure?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isLoading || !fonepay.isLoaded}
        className={`px-6 py-3 bg-[#E73C17] text-white rounded-lg hover:bg-[#d63615] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          children || `Pay Rs. ${amount.toFixed(2)}`
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {!fonepay.isLoaded && (
        <div className="mt-2 text-yellow-600 text-sm">
          Loading payment gateway...
        </div>
      )}
    </div>
  );
} 