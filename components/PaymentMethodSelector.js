import React from "react";

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
          <option value="bancontact">Bancontact</option>
          <option value="card">Card</option>
          <option value="eps">EPS</option>
          <option value="giropay">Giropay</option>
          <option value="klarna">Klarna</option>
          <option value="p24">Przelewy24</option>
          <option value="sofort">SOFORT</option>
        </select>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
