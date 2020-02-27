import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Creat some custom errors for if things go wrong
class StripeError extends Error {}
class UnknownPaymentMethodError extends Error {}

// Some form of Global variable
export const paymentMethodMap = {
  bancontact: "Bancontact",
  card: "Card",
  eps: "EPS",
  giropay: "Giropay",
  p24: "Przelewy24",
  sofort: "SOFORT"
};

// Map for looking up Text for Payment Methods
export const getPaymentMethodDisplayName = paymentMethod => {
  return paymentMethodMap[paymentMethod];
};

export const isValidPaymentMethod = paymentMethod => {
  return paymentMethod in paymentMethodMap;
};

//Abstraction over confirming the various paymentmethods to keep the frontend code ~clean
export const confirmPayment = async (
  stripe,
  elements,
  clientSecret,
  paymentMethod
) => {
  // Switch between the different Payment confirmation calls for each paymentMethod
  switch (paymentMethod) {
    // Bancontact
    case "bancontact":
      {
        // Does a Stripe-js handled redirect so only need to handle a potential error being returned
        const { error } = await stripe.confirmBancontactPayment(clientSecret, {
          payment_method: {
            billing_details: {
              name: "Jenny Rosen"
            }
          },
          return_url: `${window.location.origin}`
        });
        if (error) {
          throw new StripeError(error);
        }
      }
      break;
    case "card":
      {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: "Jenny Rosen"
              }
            }
          }
        );
        if (error) {
          throw new StripeError(error);
        } else {
          return { paymentIntent };
        }
      }
      break;
    case "eps":
      {
        const { error } = await stripe.confirmEpsPayment(clientSecret, {
          payment_method: {
            billing_details: {
              name: "Jenny Rosen"
            }
          },
          return_url: `${window.location.origin}`
        });
        if (error) {
          throw new StripeError(error);
        }
      }
      break;
    case "giropay":
      {
        const { error } = await stripe.confirmGiropayPayment(clientSecret, {
          payment_method: {
            billing_details: {
              name: "Jenny Rosen"
            }
          },
          return_url: `${window.location.origin}`
        });
        if (error) {
          throw new StripeError(error);
        }
      }
      break;
    case "p24":
      {
        const { error } = await stripe.confirmP24Payment(clientSecret, {
          payment_method: {
            billing_details: {
              email: "jenny.rosen@example.com"
            }
          },
          return_url: `${window.location.origin}`
        });
        if (error) {
          throw new StripeError(error);
        }
      }
      break;
    default:
      // Throw an error if the paymentMethod is not recognised
      throw new UnknownPaymentMethodError(
        `Unknown payment method ${paymentMethod}`
      );
  }
};
