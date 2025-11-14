import Paystack from 'paystack-api';

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY || '');

export interface PaymentInitParams {
  email: string;
  amount: number; // in Naira (₦)
  orderId: number;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}

export async function initiatePayment({
  email,
  amount,
  orderId,
  metadata,
}: PaymentInitParams): Promise<PaymentResponse> {
  try {
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Convert to kobo
      reference: `ZUKA-${orderId}-${Date.now()}`,
      currency: 'NGN',
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      metadata: {
        orderId,
        ...metadata,
      },
      callback_url: `${process.env.NEXT_PUBLIC_URL}/orders/${orderId}/verify`,
    });

    return {
      success: true,
      authorizationUrl: response.data.authorization_url,
      reference: response.data.reference,
    };
  } catch (error: any) {
    console.error('Payment initialization failed:', error);
    return {
      success: false,
      error: error.message || 'Payment initialization failed',
    };
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await paystack.transaction.verify(reference);
    
    return {
      success: response.data.status === 'success',
      data: {
        amount: response.data.amount / 100, // Convert from kobo
        reference: response.data.reference,
        paidAt: response.data.paid_at,
        channel: response.data.channel,
        metadata: response.data.metadata,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Verification failed',
    };
  }
}

export async function getTransactionFee(amount: number): Promise<number> {
  // Paystack charges 1.5% + ₦100
  const feePercent = amount * 0.015;
  const totalFee = feePercent + 100;
  
  // Cap at ₦2,000
  return Math.min(totalFee, 2000);
}

export { Paystack };
