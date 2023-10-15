import React from "react";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom"; // Changed BrowserRouter to HashRouter
import Router from "./router/router";

import { NextUIProvider } from "@nextui-org/react";

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <NextUIProvider>
          <Router />
      </NextUIProvider>
    </HashRouter>
  </React.StrictMode>
);
