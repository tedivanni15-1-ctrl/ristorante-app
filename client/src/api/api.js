import { getToken } from "../context/AuthContext.jsx";

const BASE = "/api/v1";

async function http(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `Errore HTTP ${res.status}`);
    err.status = res.status;
    err.detail = data.detail;
    throw err;
  }

  return data;
}

export const api = {
  get:    (path)       => http(path),
  post:   (path, body) => http(path, { method: "POST",   body }),
  put:    (path, body) => http(path, { method: "PUT",    body }),
  patch:  (path, body) => http(path, { method: "PATCH",  body }),
  delete: (path)       => http(path, { method: "DELETE" }),
};
