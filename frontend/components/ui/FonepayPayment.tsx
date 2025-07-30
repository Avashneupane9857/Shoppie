'use client';
import { useEffect, useState } from 'react';

interface FonepayConfig {
  papInfo: string;
  oprKey: string;
  insKey: string;
  bundleUrl: string;
  baseUrl: string;
  webhookUrl: string;
}

interface PaymentRequest {
  amount: number;
  merchantTxnId: string;
  merchantOrderId: string;
  merchantUserId: string;
  successUrl: string;
  failureUrl: string;
  cancelUrl: string;
  remarks?: string;
}

interface FonepayResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default function FonepayPayment() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Test credentials
  const config: FonepayConfig = {
    papInfo: process.env.NEXT_PUBLIC_PAP_INFO || "",
    oprKey: process.env.NEXT_PUBLIC_OPR_KEY || "",
    insKey: process.env.NEXT_PUBLIC_INS_KEY || "",
    bundleUrl: process.env.NEXT_PUBLIC_BUNDLE_URL || "https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://getpay-uat.machbank.com/ecom-gateway/v1/secure-merchant/transactions",
    webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL || "https://shoppie-mu.vercel.app/api/webhooks/fonepay"
  };

  // Load Fonepay SDK
  useEffect(() => {
    const loadFonepaySDK = async () => {
      try {
        // Check if script is already loaded
        if (window.Fonepay) {
          setIsLoaded(true);
          return;
        }

        // Load the script dynamically
        const script = document.createElement('script');
        script.src = config.bundleUrl;
        script.async = true;
        
        script.onload = () => {
          console.log('Fonepay SDK loaded successfully');
          setIsLoaded(true);
        };

        script.onerror = () => {
          console.error('Failed to load Fonepay SDK');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Fonepay SDK:', error);
      }
    };

    loadFonepaySDK();
  }, []);

  // Initialize Fonepay
  const initializeFonepay = async (): Promise<FonepayResponse> => {
    if (!isLoaded) {
      return { success: false, message: 'Fonepay SDK not loaded' };
    }

    try {
      // Initialize with your credentials
      const initResult = await window.Fonepay.init({
        papInfo: config.papInfo,
        oprKey: config.oprKey,
        insKey: config.insKey,
        environment: 'UAT'
        // webhookUrl: config.webhookUrl // Removed for testing
      });

      setIsInitialized(true);
      return { success: true, message: 'Fonepay initialized successfully', data: initResult };
    } catch (error) {
      console.error('Error initializing Fonepay:', error);
      return { success: false, message: 'Failed to initialize Fonepay' };
    }
  };

  // Create payment request
  const createPayment = async (paymentData: PaymentRequest): Promise<FonepayResponse> => {
    if (!isInitialized) {
      const initResult = await initializeFonepay();
      if (!initResult.success) {
        return initResult;
      }
    }

    try {
      const paymentRequest = {
        amount: paymentData.amount,
        merchantTxnId: paymentData.merchantTxnId,
        merchantOrderId: paymentData.merchantOrderId,
        merchantUserId: paymentData.merchantUserId,
        successUrl: paymentData.successUrl,
        failureUrl: paymentData.failureUrl,
        cancelUrl: paymentData.cancelUrl,
        remarks: paymentData.remarks || 'Payment for order',
        webhookUrl: config.webhookUrl
      };

      const result = await window.Fonepay.createPayment(paymentRequest);
      return { success: true, message: 'Payment created successfully', data: result };
    } catch (error) {
      console.error('Error creating payment:', error);
      return { success: false, message: 'Failed to create payment' };
    }
  };

  // Handle payment response
  const handlePaymentResponse = (response: any) => {
    console.log('Payment response:', response);
    
    if (response.success) {
      // Payment successful
      console.log('Payment successful:', response.data);
      // Handle success (redirect, update order status, etc.)
    } else {
      // Payment failed
      console.log('Payment failed:', response.message);
      // Handle failure
    }
  };

  // Verify payment status
  const verifyPaymentStatus = async (transactionId: string): Promise<FonepayResponse> => {
    try {
      const response = await fetch(`/api/payment/verify?transactionId=${transactionId}`);
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: 'Payment verified', data };
      } else {
        return { success: false, message: data.error || 'Failed to verify payment' };
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { success: false, message: 'Failed to verify payment' };
    }
  };

  return {
    isLoaded,
    isInitialized,
    initializeFonepay,
    createPayment,
    handlePaymentResponse,
    verifyPaymentStatus
  };
}

// Extend Window interface for Fonepay
declare global {
  interface Window {
    Fonepay: {
      init: (config: any) => Promise<any>;
      createPayment: (paymentData: any) => Promise<any>;
      verifyPayment?: (transactionId: string) => Promise<any>;
    };
  }
} 