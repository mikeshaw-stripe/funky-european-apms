import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Some form of Global variable
const paymentMethodMap = {
  card: "Card",
  bancontact: "Bancontact",
  eps: "EPS",
  giropay: "Giropay",
  klarna: "Klarna",
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
          return { error };
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
          return { error };
        } else {
          return { paymentIntent };
        }
      }
      break;
    default:
      // Return an error if the paymentMethod is not recognised
      return {
        error: {
          message: `Unknown payment method ${paymentMethod}`
        }
      };
  }
};
