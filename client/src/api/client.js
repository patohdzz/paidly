// One place for every request to our backend.
// Builds the URL, sends JSON, attaches the login token, and turns
// error responses into ApiError objects with a friendly message.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
const TOKEN_KEY = "paidly-token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Storage can be blocked (e.g. private mode). The app still works until refresh.
  }
}

export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// [{ field, message }] from the server -> { field: message } for forms
export function detailsToErrors(details = []) {
  return Object.fromEntries(details.map((d) => [d.field, d.message]));
}

export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  const headers = { Accept: "application/json" };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // A saved token that the server rejects means the session expired.
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event("paidly:unauthorized"));
    }
    throw new ApiError(
      data?.error ?? "Something went wrong. Please try again.",
      response.status,
      data?.details ?? []
    );
  }

  return data;
}