export function getClientName(clients, clientId) {
  const client = clients.find((c) => c.id === clientId);
  return client?.company ?? "Unknown client";
}