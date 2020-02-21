const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 9900,
    currency: "eur",
    payment_method_types: ["bancontact"]
  });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(paymentIntent));
};
