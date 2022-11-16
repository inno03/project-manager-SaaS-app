import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }

  const session = await getSession({ req })
  if (!session) return res.status(401).json({ message: 'Not logged in' })
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })

  if (!user) return res.status(401).json({ message: 'User not found' })

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const stripe_session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
		subscription_data: {
      trial_period_days: 7
	  },
    success_url:
      process.env.BASE_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: process.env.BASE_URL + '/cancelled',
    client_reference_id: session.user.id,
  })

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  res.end(
    JSON.stringify({
      status: 'success',
      sessionId: stripe_session.id,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    })
  )
}