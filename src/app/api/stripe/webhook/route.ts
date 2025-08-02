// src/app/api/stripe/webhook/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {headers} from 'next/headers';
import type Stripe from 'stripe';
import {stripe} from '@/lib/stripe-client';

// NOTE: This is a placeholder for your user service.
// In a real application, you would import a function to update the user's pro status in your database.
const grantProAccess = async (customerId: string, userId: string) => {
  console.log(`Granting pro access to userId: ${userId} with customerId: ${customerId}`);
  // Example: await db.users.update({ where: { id: userId }, data: { isPro: true, stripeCustomerId: customerId } });
};

// Disable the default body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: NodeJS.ReadableStream) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const buf = await buffer(req.body as unknown as NodeJS.ReadableStream);
  const sig = headers().get('stripe-signature') as string;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret is not set.');
    return NextResponse.json({error: 'Webhook secret not configured'}, {status: 500});
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({error: `Webhook Error: ${err.message}`}, {status: 400});
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Payment successful for session: ${session.id}`);

      const { userId } = session.metadata || {};
      const customerId = session.customer as string;

      if (!userId || !customerId) {
        console.error("Missing userId or customerId in checkout session metadata");
        return NextResponse.json({ error: "Missing user information in session." }, { status: 400 });
      }

      // Grant pro access to the user
      await grantProAccess(customerId, userId);
      
      break;
    // Add other event types to handle here (e.g., subscription updates, cancellations)
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const subscriptionDeleted = event.data.object as Stripe.Subscription;
      console.log(`Subscription cancelled: ${subscriptionDeleted.id}`);
      // Here you would revoke Pro access from the user associated with subscriptionDeleted.customer
      break;
    case 'customer.subscription.updated':
      // Handle subscription updates
      const subscriptionUpdated = event.data.object as Stripe.Subscription;
      console.log(`Subscription updated: ${subscriptionUpdated.id}`);
      // Handle changes in subscription status, e.g., if a payment fails.
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({received: true});
}
