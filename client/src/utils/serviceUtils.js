import { formatCurrency } from "./invoiceUtils";

export const unitOptions = [
  { value: "hr", label: "Per hour" },
  { value: "day", label: "Per day" },
  { value: "flat", label: "Flat fee" },
];

const unitSuffix = {
  hr: "/ hr",
  day: "/ day",
  flat: "flat",
};

export function formatRate(service) {
  return `${formatCurrency(service.rate)} ${unitSuffix[service.unit] ?? ""}`.trim();
}

export function countServiceUsage(invoices, serviceId) {
  return invoices.filter((invoice) =>
    invoice.lineItems.some((item) => item.serviceId === serviceId)
  ).length;
}

// official list of categories
export const categoryOptions = [
  "Plumbing",
  "Electrical",
  "Drywall & Painting",
  "Carpentry",
  "General Handyman",
];

// correctly returns time in text format
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}