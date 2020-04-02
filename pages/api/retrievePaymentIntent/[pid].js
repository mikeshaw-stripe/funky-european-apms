import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const {
    query: { pid }
  } = req;

  const paymentIntent = await stripe.paymentIntents.retrieve(pid);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(paymentIntent));
};
