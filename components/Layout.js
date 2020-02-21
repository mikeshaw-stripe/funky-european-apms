import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY, {
  betas: ["bancontact_pm_beta_1"]
});

const Layout = ({ children, title = "Klarna Payments Demo" }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default Layout;
