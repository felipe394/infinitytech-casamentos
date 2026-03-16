import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// Initialize with Public Key and Locale
const publicKey = (import.meta as any).env.VITE_MERCADO_PAGO_PUBLIC_KEY || '';
initMercadoPago(publicKey, { locale: 'pt-BR' });

interface PaymentBrickProps {
  amount: number;
  description: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export function PaymentBrick({ amount, description, onSuccess, onFailure }: PaymentBrickProps) {
  
  const initialization = {
    amount: amount,
  };

  const customization = {
    paymentMethods: {
      maxInstallments: 12,
      minInstallments: 1,
      creditCard: 'all' as any,
    },
    visual: {
      style: {
        theme: 'default' as any,
      },
    },
  } as any;

  const onSubmit = async ({ formData }: any) => {
    try {
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
      const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ formData, description }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar pagamento');
      }

      // Check payment status from Mercado Pago response
      if (result.status === 'approved') {
        console.log('Payment approved:', result);
        onSuccess();
      } else if (result.status === 'in_process' || result.status === 'pending') {
        console.log('Payment pending:', result.status);
        onSuccess();
      } else {
        console.warn('Payment not approved:', result.status, result.status_detail);
        onFailure();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onFailure();
    }
  };

  const onError = async (error: any) => {
    console.error('Mercado Pago Brick Error:', error);
    onFailure();
  };

  return (
    <div id="payment-brick-container" className="w-full">
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onError={onError}
      />
    </div>
  );
}
