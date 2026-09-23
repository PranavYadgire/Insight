(function () {
  // Trello returns the authorization token in the URL hash.
  var token = window.location.hash;

  var titleEl = document.getElementById("status-title");
  var descEl = document.getElementById("status-desc");
  var spinnerEl = document.getElementById("spinner");

  if (!token) {
    if (spinnerEl) spinnerEl.style.display = "none";

    if (titleEl) {
      titleEl.textContent = "Authorization Failed";
    }

    if (descEl) {
      descEl.textContent =
        "No authorization token was received from Trello.";
      descEl.style.color = "#f87168";
    }

    return;
  }

  // Send the token back to t.authorize().
  try {
    if (
      window.opener &&
      typeof window.opener.authorize === "function"
    ) {
      window.opener.authorize(token);
    } else {
      // Trello's documented fallback.
      localStorage.setItem("token", token);
    }
  } catch (e) {
    console.warn("Authorization callback error:", e);

    try {
      localStorage.setItem("token", token);
    } catch (storageError) {
      console.warn("Could not save authorization token:", storageError);
    }
  }

  if (spinnerEl) {
    spinnerEl.style.display = "none";
  }

  if (titleEl) {
    titleEl.textContent = "Successfully Connected!";
  }

  if (descEl) {
    descEl.textContent =
      "Insight is authorized. Closing this window…";
  }

  setTimeout(function () {
    window.close();
  }, 1000);
})();