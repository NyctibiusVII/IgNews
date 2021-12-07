import { NextApiRequest, NextApiResponse } from 'next'

import { saveSubscription } from './_lib/manageSubscription'
import { stripe }           from '../../services/stripe'
import { Readable }         from 'stream'
import Stripe from 'stripe'

async function buffer(readable: Readable) {
    const chunks = []

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        )
    }

    return Buffer.concat(chunks)
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export const config = { api: { bodyParser: false } }

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature'] ?? 'Error: "secret" variable => undefined'

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET ?? 'Error: STRIPE_WEBHOOK_SECRET => undefined')
        } catch (err) { return res.status(400).send(`Webhook error: ${err}`) }

        const { type } = event

        if (relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        )

                        break
                    case 'checkout.session.completed':
                        interface CheckoutSession extends Stripe.Checkout.Session {
                            subscription: string
                            customer: string
                        }
                        const checkoutSession = event.data.object as CheckoutSession // Fiz gambiarra para o typescript não dar pau. Era para ser 'Stripe.Checkout.Session' em vez de 'CheckoutSession'.

                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        )

                        break
                    default: throw new Error('Unhandled event.')
                }
            } catch (err) { return res.json({ error: 'Webhook handler failed' }) }
        }

        res.json({ received: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}