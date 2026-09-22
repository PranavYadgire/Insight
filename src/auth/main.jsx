/* global TrelloPowerUp */
import React from "react";
import ReactDOM from "react-dom/client";
import AuthPopup from "./AuthPopup.jsx";

// Initialize Trello PowerUp iframe context or provide fallback for local dev
let t = null;
try {
  if (typeof TrelloPowerUp !== "undefined" && typeof TrelloPowerUp.iframe === "function") {
    t = TrelloPowerUp.iframe();
  }
} catch (e) {
  console.warn("TrelloPowerUp.iframe() not available in this context:", e);
}

// Fallback mock for local development and testing
if (!t) {
  t = {
    get: (scope, visibility, key) => Promise.resolve(localStorage.getItem(`trello_${scope}_${visibility}_${key}`)),
    set: (scope, visibility, key, val) => {
      localStorage.setItem(`trello_${scope}_${visibility}_${key}`, val);
      return Promise.resolve();
    },
    remove: (scope, visibility, key) => {
      localStorage.removeItem(`trello_${scope}_${visibility}_${key}`);
      return Promise.resolve();
    },
    sizeTo: () => Promise.resolve(),
    closePopup: () => {
      console.log("[Mock] t.closePopup() called");
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthPopup t={t} />
  </React.StrictMode>
);
