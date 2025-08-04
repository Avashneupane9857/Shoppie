'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FpayPaymentButtonProps {
  cartItems: any[];
  totalAmount: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const BUNDLE_URL = '/bundle.js';

const getOrderInformationHtml = (cartItems: any[], totalAmount: number) => {
  let html = `<div>
    <h3>Order Information</h3>
    <div class="item" style="margin-bottom: 20px;">`;
  
  cartItems.forEach((cartItem) => {
    const productName = cartItem?.name;
    const productPrice = cartItem?.price.toFixed(2);
    const productImageUrl = cartItem?.image;

    html += `<div class="item" style="margin-bottom: 20px; display: flex; align-items: center;">
      <img style="max-width: 50px; margin-right: 10px;" src="${productImageUrl}" alt="${productName}">
      <p>${productName}&nbsp;</p>
      <span>Rs ${productPrice}</span>
    </div>`;
  });

  html += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #ddd; margin-top: 20px; border-radius: 5px;" class="total">
    <label>Total:</label>
    <span>Rs ${totalAmount.toFixed(2)}</span>
  </div>
</div>`;

  return html;
};

export default function FpayPaymentButton({ cartItems, totalAmount, onSuccess, onError }: FpayPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Load the bundle.js script if not already loaded
    if (!window.GetPay) {
      const script = document.createElement('script');
      script.src = BUNDLE_URL;
      script.async = true;
      script.onload = () => {
        setSdkLoaded(true);
      };
      script.onerror = () => {
        toast.error('Failed to load GetPay SDK');
      };
      document.head.appendChild(script);
    } else {
      setSdkLoaded(true);
    }
  }, []);

  const initializeGetPay = () => {
    if (!sdkLoaded || !window.GetPay) {
      toast.error('GetPay SDK not loaded. Please wait and try again.');
      return;
    }

    setIsLoading(true);
    
    const orderInformationHtml = getOrderInformationHtml(cartItems, totalAmount);

    const options = {
      userInfo: {
        name: "John Doe",
        email: "john@gmail.com",
        state: "Bagmati",
        country: "Nepal",
        zipcode: "44600",
        city: "Kathmandu",
        address: "Chabahil",
      },
      clientRequestId: "CLIENT123",
      papInfo: process.env.NEXT_PUBLIC_PAP_INFO || '',
      oprKey: process.env.NEXT_PUBLIC_OPR_KEY || '',
      insKey: process.env.NEXT_PUBLIC_INS_KEY || '',
      websiteDomain:'https://shoppie-mu.vercel.app/',
      price: totalAmount,
      businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'OneStop Shopping - Pokhara',
      imageUrl: process.env.NEXT_PUBLIC_LOGO_URL || '',
      currency: "NPR",
      prefill: {
        name: true,
        email: true,
        state: true,
        city: true,
        address: true,
        zipcode: true,
        country: true
      },
      disableFields: {
        address: true,
        state: true,
      },
      callbackUrl: {
        successUrl: process.env.NEXT_PUBLIC_SUCCESS_URL || '',
        failUrl: process.env.NEXT_PUBLIC_FAIL_URL || '',
      },
      themeColor: "#5662FF",
      orderInformationUI: orderInformationHtml,
      onSuccess: (options: any) => {
        setIsLoading(false);
        toast.success('Payment successful!');
        if (onSuccess) onSuccess(options);
        window.location.href = "/payment/success";
      },
      onError: (error: any) => {
        setIsLoading(false);
        console.log("GetPay Error details:", error);
        
        // Handle specific error types
        if (error?.error?.includes('CORS') || error?.message?.includes('fetch')) {
          toast.error('CORS Error: Please contact Fpay support to whitelist your domain for production');
        } else if (error?.error?.includes('crypto') || error?.message?.includes('words')) {
          toast.error('SDK Error: GetPay SDK crypto functions not available. Please contact Fpay support.');
        } else {
          toast.error(error?.error || error?.message || 'Payment failed');
        }
        
        if (onError) onError(error);
      },
    };

    try {
      console.log('Initializing GetPay with options:', options);
      const getPay = new window.GetPay(options);
      getPay.initialize();
    } catch (error) {
      setIsLoading(false);
      console.error('GetPay initialization error:', error);
      toast.error('Failed to initialize GetPay SDK');
    }
  };



  return (
    <div className="w-full">
      <div id="checkout" className="hidden"></div>
      <button 
        id="checkout-btn" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={initializeGetPay}
        disabled={isLoading || !cartItems?.length}
      >
        {isLoading ? 'Processing...' : 'Pay with Fpay'}
      </button>
      
      {!sdkLoaded && cartItems?.length > 0 && (
        <p className="text-sm text-gray-500 mt-2">Loading payment system...</p>
      )}
    </div>
  );
}

// Add TypeScript declaration for the GetPay global object
declare global {
  interface Window {
    GetPay: any;
  }
} 