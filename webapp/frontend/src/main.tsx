import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Always load at the top; prevents the browser from restoring a prior scroll
// position (which could land the user near the footer on reload).
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
