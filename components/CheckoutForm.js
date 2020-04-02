import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  IdealBankElement
} from "@stripe/react-stripe-js";
import fetch from "unfetch";
import queryString from "query-string";
import PaymentMethodSelector from "./PaymentMethodSelector";
import {
  getPaymentMethodDisplayName,
  confirmPayment
} from "../utils/stripe-helper";
import Success from "./Success";

const CheckoutForm = props => {
  // Set some state
  const [successObj, setSuccessObj] = useState(null);
  const [disabled, setDisabled] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [succeeded, setSucceeded] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState(null);

  // Get Stripe context
  const stripe = useStripe();
  const elements = useElements();

  // Use a hook to check if there is a Successfull Payment Already
  useEffect(() => {
    /* For Payment Methods that use a redirect Stripe direct with query params
    and we will need to extract the PaymentIntent Id from the query params. For 
    Those that don't redirect we can get the paymentIntent Id the PaymentIntent we store in the state */
    const paymentIntentId = location.search
      ? queryString.parse(location.search).payment_intent
      : paymentIntent
      ? paymentIntent.id
      : null;

    // Check if we have a PaymentIntent Id to lookup
    if (paymentIntentId) {
      // Call the Serverless Backend to retrieve the PaymentIntent by ID
      const retrievePaymentIntent = async () => {
        const res = await fetch(
          `/api/retrievePaymentIntent/${paymentIntentId}`
        );
        const paymentIntentObj = await res.json();

        if (
          paymentIntentObj.status === "succeeded" ||
          paymentIntentObj.status === "processing"
        ) {
          setSuccessObj(paymentIntentObj);
          setSucceeded(true);
        } else {
          setError(paymentIntentObj.last_payment_error.message);
        }
      };

      retrievePaymentIntent();
    }
  }, [paymentIntent]);

  const handleSubmit = async ev => {
    ev.preventDefault();
    setDisabled(true);
    setProcessing(true);

    // Create a PaymentIntent passing the paymentMethod so that we can set the correct params
    const res = await fetch("/api/createPaymentIntent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ paymentMethod: paymentMethod })
    });

    if (res.ok) {
      const paymentIntentObj = await res.json();

      /* Rather than having every single Stripe.js call here for all payment methods
      I am using a helper function in ../utils/stripe-helper.js to give a single 
      "confirmPayment" interface */
      try {
        const { paymentIntent } = await confirmPayment(
          stripe,
          elements,
          paymentIntentObj.client_secret,
          paymentMethod
        );

        /* If we got a PaymetIntent then store it in the state (which will 
        cause the useEffect hook to fire and fetch the PaymentIntent 
        status from the backend) */
        if (paymentIntent) {
          setPaymentIntent(paymentIntent);
        }
      } catch (err) {
        // If we got an error show the message and re-enabled the buttons
        setError(err.message);
        setDisabled(false);
        setProcessing(false);
        return;
      }
    } else {
      setError(paymentIntentObj.json().error);
      setDisabled(false);
      setProcessing(false);
      return;
    }
  };

  const renderSuccess = () => <Success paymentIntentObj={successObj} />;

  const renderForm = () => {
    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    return (
      <form onSubmit={handleSubmit}>
        <h1>GBP 99</h1>
        <h4>Pre-order the Pasha package</h4>

        <div className="sr-combo-inputs">
          <div className="sr-combo-inputs-row">
            <input
              type="text"
              id="name"
              placeholder="Name"
              className="sr-input"
            />
          </div>
          {/* Only show the Card Element if the selected payment method is 'card' */}
          {paymentMethod === "card" && (
            <div className="sr-combo-inputs-row">
              <CardElement className="sr-input sr-card-element" style={style} />
            </div>
          )}
          {/* Only show the iDEAL Element if the selected payment method is 'ideal' */}
          {paymentMethod === "ideal" && (
            <div className="sr-combo-inputs-row">
              <IdealBankElement
                className="sr-input sr-card-element"
                style={style}
              />
            </div>
          )}
        </div>

        <PaymentMethodSelector setPaymentMethod={setPaymentMethod} />

        {error && <div className="message sr-field-error">{error}</div>}

        {!succeeded && (
          <button className="btn" disabled={disabled}>
            {processing
              ? "Processing…"
              : paymentMethod
              ? `Pay by ${getPaymentMethodDisplayName(paymentMethod)}`
              : "Pay Now"}
          </button>
        )}
      </form>
    );
  };

  return (
    <div>
      <div>
        {succeeded && renderSuccess()}
        {!succeeded && renderForm()}
      </div>
      <style jsx global>{`
        .sr-combo-inputs {
          margin: 20px 0;
        }

        .sr-input {
          font-size: 16px;
        }

        .sr-card-element {
          padding-top: 12px;
        }

        .btn {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default CheckoutForm;
