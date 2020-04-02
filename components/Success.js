const Success = props => {
  return (
    <div className="sr-field-success message">
      <h1>
        {props.paymentIntentObj.status == "succeeded"
          ? `Your test payment succeeded`
          : props.paymentIntentObj.status == "processing"
          ? `Your test payment is processing`
          : `An error occured with your payment.`}
      </h1>
      <p>View PaymentIntent response:</p>
      <pre className="sr-callout">
        <code>{JSON.stringify(props.paymentIntentObj, null, 2)}</code>
      </pre>

      {props.paymentIntentObj.status === "processing" ? (
        <p>
          You checked out using an asyncronous payment method.
          <br /> <br />
          In order to be notified when the payment succeeds, you should
          integrate{" "}
          <a href="https://stripe.com/docs/payments/handling-payment-events">
            Webhooks
          </a>
          .
        </p>
      ) : null}
      <button onClick={() => (window.location.href = window.location.origin)}>
        Back
      </button>
    </div>
  );
};

export default Success;
