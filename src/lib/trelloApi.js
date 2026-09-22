// Lightweight client for the Trello REST API (https://api.trello.com/1).
// Authenticates with the member's private token stored in the Power-Up.

import { APP_KEY, getToken, clearToken } from "./auth.js";

export const NOT_AUTHORIZED = "NOT_AUTHORIZED";

/**
 * Executes an authenticated request against the Trello REST API.
 * Automatically clears the local token if the API returns 401 (e.g. member revoked token in Trello settings).
 */
export async function apiFetch(t, path, { method = "GET", params = {}, body = null, headers = {} } = {}) {
  const token = await getToken(t);
  if (!token) {
    throw new Error(NOT_AUTHORIZED);
  }

  const url = new URL(`https://api.trello.com/1${path}`);
  url.searchParams.set("key", APP_KEY);
  url.searchParams.set("token", token);

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, v);
    }
  }

  const fetchOptions = {
    method,
    headers: {
      ...headers,
    },
  };

  if (body) {
    if (typeof body === "object" && !(body instanceof FormData)) {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    } else {
      fetchOptions.body = body;
    }
  }

  const res = await fetch(url.toString(), fetchOptions);

  if (res.status === 401) {
    // Member token was revoked, expired, or invalid. Clear it so the UI re-prompts auth
    await clearToken(t);
    throw new Error(NOT_AUTHORIZED);
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Trello API error ${res.status}: ${errorText || res.statusText}`);
  }

  return res.status === 204 ? null : res.json();
}

/**
 * Fetches the currently authenticated Trello member's profile.
 * @param {object} t - Trello Power-Up client
 * @returns {Promise<{id: string, username: string, fullName: string, avatarUrl: string|null, initials: string}>}
 */
export function getCurrentMember(t) {
  return apiFetch(t, "/members/me", {
    params: {
      fields: "id,username,fullName,avatarUrl,initials",
    },
  });
}

/**
 * Disconnects the member from Insight by clearing the stored token.
 * @param {object} t - Trello Power-Up client
 */
export async function disconnectMember(t) {
  await clearToken(t);
}
