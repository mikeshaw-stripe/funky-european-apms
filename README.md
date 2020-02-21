This is a Stripe Sample showing how to accept Bancontact payments using Stripe's PaymentIntents API.

## Getting Started

First install the things you will need:

```bash
npm install
# or
yarn install
```

Then create a `.env` file and pop in your Stripe Keys:

```bash
# Stripe keys
STRIPE_PUBLISHABLE_KEY=pk_test_123
STRIPE_SECRET_KEY=sk_test_123
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

Bancontact is in beta. You can read the documentation [here](https://stripe.com/docs/payments/bancontact)
