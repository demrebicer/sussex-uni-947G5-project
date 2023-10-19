import React from "react";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom"; // Changed BrowserRouter to HashRouter
import Router from "./router/router";

import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <NextUIProvider>
          <Router />
          <Toaster />
      </NextUIProvider>
    </HashRouter>
  </React.StrictMode>
);
