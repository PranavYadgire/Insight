// Single source of truth for member's Trello authentication token.
//
// The token is stored in Trello's member-scoped private plugin storage:
// `t.set('member', 'private', 'token', token)`.
// It is scoped to that single member on the current board and cannot be read
// by any other board member. It is never placed in localStorage or sent to external servers.

export const APP_KEY = import.meta.env.VITE_TRELLO_APP_KEY;
export const APP_NAME = "Insight";

// Shared message tag validated by authorized.js and AuthPopup.jsx
export const AUTH_MESSAGE_SOURCE = "insight-auth";

const TOKEN_KEY = "token";

/**
 * Retrieves the stored token from Trello member-private storage.
 * @param {object} t - Trello Power-Up client instance
 */
export function getToken(t) {
  if (!t || typeof t.get !== "function") return Promise.resolve(null);
  return t.get("member", "private", TOKEN_KEY);
}

/**
 * Saves the authenticated token into Trello member-private storage.
 * @param {object} t - Trello Power-Up client instance
 * @param {string} token - Trello member OAuth token
 */
export function saveToken(t, token) {
  if (!t || typeof t.set !== "function") return Promise.resolve();
  return t.set("member", "private", TOKEN_KEY, token);
}

/**
 * Clears the stored token from Trello member-private storage.
 * @param {object} t - Trello Power-Up client instance
 */
export function clearToken(t) {
  if (!t || typeof t.remove !== "function") return Promise.resolve();
  return t.remove("member", "private", TOKEN_KEY);
}

/**
 * Checks whether the member currently has a validly stored token.
 * @param {object} t - Trello Power-Up client instance
 * @returns {Promise<boolean>}
 */
export async function isAuthorized(t) {
  const token = await getToken(t);
  return Boolean(token);
}

/**
 * Constructs the Trello OAuth authorization URL.
 * @param {string} returnUrl - Full URL to authorized.html on the current origin
 * @returns {string} Complete authorization URL
 */
export function buildAuthorizeUrl(returnUrl) {
  if (!APP_KEY || APP_KEY === "your_trello_app_key_here") {
    console.warn(
      "[Insight] VITE_TRELLO_APP_KEY is not configured in .env. Authorization will fail until a valid key is set."
    );
  }

  const params = new URLSearchParams({
    expiration: "never",
    name: APP_NAME,
    scope: "read,write",
    response_type: "token",
    key: APP_KEY || "",
    return_url: returnUrl,
  });

  return `https://trello.com/1/authorize?${params.toString()}`;
}
