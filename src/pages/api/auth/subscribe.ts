import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const session = await getSession({ req })
        
        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
        })

       const stripeChekoutSession = await stripe.checkout.sessions.create({
           customer: stripeCustomer.id,
           payment_method_types: ['card'],
           billing_address_collection: 'required',
           line_items: [
               { price: 'price_1KYTWHJQyUEpy2My6zN8HRSX', quantity: 1}
           ],
           mode: 'subscription',
           allow_promotion_codes:true,
           success_url: process.env.STIPE_SUCESS_URL,
           cancel_url: process.env.STIPE_CANCEL_URL

       }) 
     
       return res.status(200).json({ sessionId: stripeChekoutSession })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}