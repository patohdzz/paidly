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