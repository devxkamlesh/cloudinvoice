'use client';

import { useState } from 'react';
import { CheckoutButton } from './checkout-button';
import { RazorpayCheckoutButton } from './razorpay-checkout-button';
import { Button } from '@/components/ui/button';
import { CreditCard, IndianRupee } from 'lucide-react';

interface PaymentOptionsProps {
  token: string;
  currency: string;
}

export function PaymentOptions({ token, currency }: PaymentOptionsProps) {
  // For INR currency, default to Razorpay; for other currencies, default to Stripe
  const defaultGateway = currency === 'INR' ? 'razorpay' : 'stripe';
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'razorpay'>(defaultGateway);

  return (
    <div className="mt-5 space-y-4">
      {/* Gateway Selection Tabs */}
      <div className="flex gap-2 rounded-lg border bg-muted p-1">
        <Button
          variant={selectedGateway === 'razorpay' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setSelectedGateway('razorpay')}
        >
          <IndianRupee className="size-4" />
          UPI / Cards / NetBanking
        </Button>
        <Button
          variant={selectedGateway === 'stripe' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setSelectedGateway('stripe')}
        >
          <CreditCard className="size-4" />
          International Cards
        </Button>
      </div>

      {/* Payment Gateway Components */}
      {selectedGateway === 'razorpay' ? (
        <div>
          <RazorpayCheckoutButton token={token} />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Powered by Razorpay • Supports UPI, Credit/Debit Cards, NetBanking, Wallets
          </p>
        </div>
      ) : (
        <div>
          <CheckoutButton token={token} />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Powered by Stripe • Secure international card payments
          </p>
        </div>
      )}
    </div>
  );
}
