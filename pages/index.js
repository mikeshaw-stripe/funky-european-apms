import React from "react";
import dynamic from "next/dynamic";
import ImageStack from "../components/ImageStack";
import DemoText from "../components/DemoText";
import Layout from "../components/Layout";

export default function Index() {
  const CheckoutForm = dynamic(() => import("../components/CheckoutForm"), {
    ssr: false
  });

  return (
    <Layout>
      <div id="root">
        <div className="App">
          <div className="sr-root">
            <div className="sr-main">
              <header className="sr-header">
                <div className="sr-header__logo" />
              </header>

              <CheckoutForm />
            </div>
            <ImageStack />
          </div>
          <DemoText />
        </div>
      </div>
    </Layout>
  );
}
