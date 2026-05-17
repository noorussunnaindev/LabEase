import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (booking, tests, user) => {
  const lineItems = tests.map(test => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: test.testName,
        description: test.description,
      },
      unit_amount: Math.round(test.price * 100), // Stripe expects amount in cents
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?booking_id=${booking.id}`,
    customer_email: user.email,
    metadata: {
      bookingId: booking.id,
      userId: user.id,
    },
  });

  return session;
};

export const retrieveSession = async (sessionId) => {
  return stripe.checkout.sessions.retrieve(sessionId);
};

export const constructWebhookEvent = (body, signature) => {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};
