import { NextRequest, NextResponse } from 'next/server';

const FPAY_API_BASE = 'https://getpay-uat.machbank.com/ecom-gateway/v1/secure-merchant/transactions';
const FPAY_PAP_INFO = 'eyJpbnN0aXR1dGlvbklkIjoiMDAwIiwibWlkIjoiMTUwMTU1NTU2MDAxMDAxIiwidGlkIjoiMTUwMTAwMTIifQ==';
const FPAY_OPR_KEY = '4fa4c6b9-3f91-43e5-9b4f-319f68187ba5';
const FPAY_INS_KEY = '';
const FPAY_TID = '15010012';
const FPAY_CURRENCY = 'NPR';

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId, userId } = await request.json();
    if (!amount || !orderId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Authenticate (multipart/form-data, papInfo, oprKey, insKey, tid)
    const authForm = new FormData();
    authForm.append('papInfo', FPAY_PAP_INFO);
    authForm.append('oprKey', FPAY_OPR_KEY);
    authForm.append('insKey', FPAY_INS_KEY);
    authForm.append('tid', FPAY_TID);

    const authRes = await fetch(`${FPAY_API_BASE}/auth`, {
      method: 'POST',
      body: authForm
    });
    const authData = await authRes.json();
    if (!authData.status || !authData.auth) {
      console.error('Fpay authData:', authData);
      return NextResponse.json({ error: 'Fpay auth failed', details: authData }, { status: 500 });
    }

    // 2. Generate Order (multipart/form-data)
    const orderForm = new FormData();
    orderForm.append('papInfo', FPAY_PAP_INFO);
    orderForm.append('auth', authData.auth);
    orderForm.append('amount', amount.toString());
    orderForm.append('currency', FPAY_CURRENCY);
    orderForm.append('orderid', orderId);
    orderForm.append('redirect_url', 'https://shoppie-mu.vercel.app/payment/success');

    const orderRes = await fetch(`${FPAY_API_BASE}/generate_orders`, {
      method: 'POST',
      body: orderForm
    });
    const orderData = await orderRes.json();
    if (!orderData.status || !orderData.p_url) {
      console.error('Fpay orderData:', orderData);
      return NextResponse.json({ error: 'Fpay order creation failed', details: orderData }, { status: 500 });
    }

    return NextResponse.json({ p_url: orderData.p_url });
  } catch (error) {
    console.error('Fpay create-order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 