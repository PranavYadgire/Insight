/* global TrelloPowerUp */
import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard.jsx";

const t = TrelloPowerUp.iframe();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Dashboard t={t} />
  </React.StrictMode>
);