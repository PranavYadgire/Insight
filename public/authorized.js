(function () {
  // Trello OAuth redirects to this page with the token in the URL hash:
  // e.g. https://<domain>/authorized.html#token=ATTA...
  var hash = window.location.hash.substring(1);
  var params = new URLSearchParams(hash);
  var token = params.get("token");

  var titleEl = document.getElementById("status-title");
  var descEl = document.getElementById("status-desc");
  var spinnerEl = document.getElementById("spinner");

  if (!token) {
    if (spinnerEl) spinnerEl.style.display = "none";
    if (titleEl) titleEl.textContent = "Authorization Failed";
    if (descEl) {
      descEl.textContent = "No token was received from Trello. You can safely close this window and try again.";
      descEl.style.color = "#f87168";
    }
    return;
  }

  // Remove the token from the browser address bar and history to prevent credential exposure
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  // Post the token securely to the opener window (auth.html popup)
  if (window.opener) {
    window.opener.postMessage(
      {
        source: "insight-auth",
        token: token,
      },
      window.location.origin
    );
  }

  if (titleEl) titleEl.textContent = "Successfully Connected!";
  if (descEl) descEl.textContent = "Insight is authorized. Closing this window…";

  // Attempt to close the popup window automatically
  window.close();

  // If window.close() is blocked by browser policy, advise user they can close it manually
  setTimeout(function () {
    if (descEl) descEl.textContent = "You can safely close this window now.";
  }, 500);
})();
