import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1NIzDGSIWm6aDu22vikio9nP',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/?success=true`,
      cancel_url: `http://localhost:3000/?canceled=true`,
    });
    return NextResponse.json({ id: session.id });
    // NextResponse.redirec(session.url, {headers: {'Location': session.url}});
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
}
