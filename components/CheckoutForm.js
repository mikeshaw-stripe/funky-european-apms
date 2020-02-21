import React, { Component, useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import fetch from "unfetch";
import queryString from "query-string";

const CheckoutForm = props => {
  // Set some state
  const [metadata, setMetadata] = useState(null);
  const [disabled, setDisabled] = useState(null);
  const [succeeded, setSucceeded] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState(null);

  // Get Stripe context
  const stripe = useStripe();

  // Use a hook to check if there is a Successfull Payment Already
  useEffect(() => {
    const values = queryString.parse(location.search);
    if (values.payment_intent) {
      const retrievePaymentIntent = async () => {
        const res = await fetch(
          `/api/retrievePaymentIntent/${values.payment_intent}`
        );
        const paymentIntentObj = await res.json();
        setMetadata(paymentIntentObj);
      };

      retrievePaymentIntent();
      setSucceeded(true);
    }
  }, []);

  const handleSubmit = async ev => {
    ev.preventDefault();
    setDisabled(true);
    setProcessing(true);

    // Create a PaymentIntent
    const res = await fetch("/api/createPaymentIntent");
    const paymentIntent = await res.json();

    // Confirm the Bancontant Payment
    const { error } = await stripe.confirmBancontactPayment(
      paymentIntent.client_secret,
      {
        payment_method: {
          billing_details: {
            name: "Jenny Rosen"
          }
        },
        return_url: `${window.location.origin}`
      }
    );
  };

  const renderSuccess = () => (
    <div className="sr-field-success message">
      <h1>Your test payment succeeded</h1>
      <p>View PaymentIntent response:</p>
      <pre className="sr-callout">
        <code>{JSON.stringify(metadata, null, 2)}</code>
      </pre>
    </div>
  );

  const renderForm = () => {
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
        </div>

        {error && <div className="message sr-field-error">{error}</div>}

        {!succeeded && (
          <button className="btn" disabled={disabled}>
            {processing ? "Processing…" : "Pay by Bancontact"}
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
