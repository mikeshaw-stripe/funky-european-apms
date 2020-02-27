import React from "react";
import { paymentMethodMap } from "../utils/stripe-helper";

const PaymentMethodSelector = props => {
  const setPaymentMethod = ev => {
    console.log(ev.target.value);
    props.setPaymentMethod(ev.target.value);
  };

  return (
    <div>
      <h4>Payment Method</h4>
      <div className="sr-combo-inputs-row">
        <select
          className="sr-select sr-input"
          id="payment_methods"
          onChange={setPaymentMethod}
          defaultValue="Choose a Payment Method"
        >
          <option value="Choose a Payment Method" disabled hidden>
            Choose a Payment Method
          </option>
          {Object.keys(paymentMethodMap).map(paymentMethod => (
            <option value={paymentMethod}>
              {paymentMethodMap[paymentMethod]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
