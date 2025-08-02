// src/lib/stripe.ts
'use server';

import { stripe } from './stripe-client';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

export async function createStripeCheckoutSession(userId: string, userEmail: string) {
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  
  if (!priceId) {
    throw new Error('STRIPE_PRO_PRICE_ID is not set in the environment variables.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    success_url: `${APP_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/billing`,
  });

  return { sessionId: session.id, url: session.url };
}

export async function createStripePortalSession(customerId: string) {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/billing`,
  });

  return { url: portalSession.url };
}
