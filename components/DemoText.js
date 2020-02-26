import React from "react";

const DemoText = ({}) => {
  return (
    <div className="banner">
      <span>
        This is a{" "}
        <a href="https://github.com/stripe-samples"> Stripe Sample </a> on how
        to build a payment to accept common European payment methods.{" "}
        <a href="https://github.com/mikeshaw-stripe/funky-european-apms">
          View code on GitHub.
        </a>
      </span>
      <style jsx>{`
        .banner {
          max-width: 825px;
          margin: 0 auto;
          padding: 0 22px;
          font-size: 14px;
          background: white;
          color: #6a7c94;
          border-radius: 22px;
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default DemoText;
