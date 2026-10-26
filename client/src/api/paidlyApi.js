import { apiRequest } from "./client";

export const authApi = {
  register: (data) => apiRequest("/auth/register", { method: "POST", body: data }),
  login: (data) => apiRequest("/auth/login", { method: "POST", body: data }),
  me: () => apiRequest("/auth/me"),
};

export const servicesApi = {
  list: (signal) => apiRequest("/services", { signal }),
  get: (id, signal) => apiRequest(`/services/${encodeURIComponent(id)}`, { signal }),
  listAll: (signal) => apiRequest("/services/admin/all", { signal }),
  create: (data) => apiRequest("/services", { method: "POST", body: data }),
  update: (id, data) =>
    apiRequest(`/services/${encodeURIComponent(id)}`, { method: "PATCH", body: data }),
  remove: (id) => apiRequest(`/services/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const bookingsApi = {
  create: (data) => apiRequest("/bookings", { method: "POST", body: data }),
  mine: (signal) => apiRequest("/bookings/mine", { signal }),
  all: (signal) => apiRequest("/bookings", { signal }),
  reschedule: (id, scheduledAt) =>
    apiRequest(`/bookings/${encodeURIComponent(id)}/reschedule`, {
      method: "PATCH",
      body: { scheduledAt },
    }),
  cancel: (id) =>
    apiRequest(`/bookings/${encodeURIComponent(id)}/cancel`, { method: "PATCH" }),
  setStatus: (id, status) =>
    apiRequest(`/bookings/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: { status },
    }),
};

export const aiApi = {
  quote: (description) =>
    apiRequest("/ai/quote", { method: "POST", body: { description } }),
};