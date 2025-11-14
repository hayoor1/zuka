declare module 'paystack-api' {
  interface PaystackTransaction {
    initialize(params: {
      email: string;
      amount: number;
      reference?: string;
      currency?: string;
      channels?: string[];
      metadata?: Record<string, any>;
      callback_url?: string;
    }): Promise<{
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    }>;

    verify(reference: string): Promise<{
      status: boolean;
      message: string;
      data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        message: string | null;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: Record<string, any>;
      };
    }>;
  }

  interface PaystackAPI {
    transaction: PaystackTransaction;
  }

  function Paystack(secretKey: string): PaystackAPI;
  export default Paystack;
}




