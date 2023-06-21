import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1NLXmnSIWm6aDu22Oq9yVcfD',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://aiject.tech/?success=true`,
      cancel_url: `https://aiject.tech/?canceled=true`,
    });
    return NextResponse.json({ id: session.id });
    // NextResponse.redirec(session.url, {headers: {'Location': session.url}});
  } catch (err) {
      NextResponse.json({ error: { message: err.message } });
  }
}
