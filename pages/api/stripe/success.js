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
  const stripe_session = await stripe.checkout.sessions.retrieve(
    req.body.session_id
  )

  await prisma.user.update({
    data: {
      isSubscriber: true,
			stripeSubscriptionId: stripe_session.subscription,
    },
    where: {
      id: stripe_session.client_reference_id,
    },
  })

  res.end()
}