'use client';

import { useState } from 'react';
import { CheckoutButton } from './checkout-button';
import { RazorpayCheckoutButton } from './razorpay-checkout-button';
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
    <div className="space-y-6">
      {/* Gateway Selection Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSelectedGateway('razorpay')}
          className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
            selectedGateway === 'razorpay'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2.5 ${
                selectedGateway === 'razorpay'
                  ? 'bg-primary/10'
                  : 'bg-slate-100 group-hover:bg-slate-200'
              }`}
            >
              <IndianRupee
                className={`size-5 ${
                  selectedGateway === 'razorpay' ? 'text-primary' : 'text-slate-600'
                }`}
              />
            </div>
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  selectedGateway === 'razorpay' ? 'text-primary' : 'text-slate-900'
                }`}
              >
                Indian Payments
              </p>
              <p className="text-xs text-muted-foreground">UPI, Cards, NetBanking</p>
            </div>
          </div>
          {selectedGateway === 'razorpay' && (
            <div className="absolute bottom-2 right-2">
              <div className="rounded-full bg-primary p-1">
                <svg
                  className="size-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </button>

        <button
          onClick={() => setSelectedGateway('stripe')}
          className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
            selectedGateway === 'stripe'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2.5 ${
                selectedGateway === 'stripe'
                  ? 'bg-primary/10'
                  : 'bg-slate-100 group-hover:bg-slate-200'
              }`}
            >
              <CreditCard
                className={`size-5 ${
                  selectedGateway === 'stripe' ? 'text-primary' : 'text-slate-600'
                }`}
              />
            </div>
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  selectedGateway === 'stripe' ? 'text-primary' : 'text-slate-900'
                }`}
              >
                International
              </p>
              <p className="text-xs text-muted-foreground">Credit/Debit Cards</p>
            </div>
          </div>
          {selectedGateway === 'stripe' && (
            <div className="absolute bottom-2 right-2">
              <div className="rounded-full bg-primary p-1">
                <svg
                  className="size-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Payment Gateway Components */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {selectedGateway === 'razorpay' ? (
          <div>
            <RazorpayCheckoutButton token={token} />
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Secured by Razorpay</span>
            </div>
          </div>
        ) : (
          <div>
            <CheckoutButton token={token} />
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Secured by Stripe</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
