import Stripe from "stripe";
import isValidPaymentMethod from "../../utils";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (req.method == "POST") {
    const paymentMethod = req.body.paymentMethod;
    if (isValidPaymentMethod(paymentMethod)) {
      // Create the PI using Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 9900,
        currency: "eur",
        payment_method_types: [req.body.paymentMethod]
      });

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(paymentIntent));
    } else {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: `Payment Method: ${paymentMethod} is not a valid payment method.`
        })
      );
    }
  } else {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `Request Method: ${req.method} Not supported.`
      })
    );
  }
};
