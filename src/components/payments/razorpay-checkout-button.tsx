'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScript } from '@/hooks/use-script';

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
}

interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    reason: string;
  };
}

interface RazorpayCheckoutButtonProps {
  token: string;
}

export function RazorpayCheckoutButton({ token }: RazorpayCheckoutButtonProps) {
  const [error, setError] = useState<string | null>(null);
  
  // Load Razorpay script
  const razorpayLoaded = useScript('https://checkout.razorpay.com/v1/checkout.js');

  const checkout = useMutation({
    mutationFn: async () => {
      setError(null);

      // Create Razorpay order
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json() as {
        orderId?: string;
        amount?: number;
        currency?: string;
        invoice?: {
          id: string;
          number: string;
          organizationName: string;
          clientName: string;
          clientEmail: string | null;
        };
        error?: string;
      };

      if (!response.ok || !data.orderId) {
        throw new Error(data.error ?? 'Could not create payment order.');
      }

      return data;
    },
    onSuccess: (data) => {
      if (!razorpayLoaded || !window.Razorpay) {
        setError('Payment gateway is loading. Please try again in a moment.');
        return;
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        setError('Payment gateway configuration error.');
        return;
      }

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: data.invoice!.organizationName,
        description: `Payment for Invoice #${data.invoice!.number}`,
        order_id: data.orderId,
        prefill: {
          name: data.invoice!.clientName,
          email: data.invoice!.clientEmail || undefined,
        },
        theme: {
          color: '#3b82f6',
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // Verify payment
          try {
            const verifyResponse = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                invoiceId: data.invoice!.id,
              }),
            });

            if (verifyResponse.ok) {
              // Redirect to success page
              window.location.href = `/pay/${token}?payment=success`;
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setError('Payment was cancelled.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return (
    <>
      <Button
        className="mt-5 w-full"
        size="lg"
        onClick={() => checkout.mutate()}
        disabled={checkout.isPending || !razorpayLoaded}
        variant="default"
      >
        <IndianRupee className="size-4" />
        {checkout.isPending
          ? 'Opening payment gateway…'
          : !razorpayLoaded
          ? 'Loading payment gateway…'
          : 'Pay with UPI / Cards / NetBanking'}
      </Button>
      {(error || checkout.error) && (
        <p role="alert" className="mt-3 text-center text-sm text-red-600">
          {error || checkout.error?.message}
        </p>
      )}
    </>
  );
}
