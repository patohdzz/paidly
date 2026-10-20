import { getSubtotal, getTax, getTotal } from "./invoiceUtils";

export const QUOTE_MIN = 10;
export const QUOTE_MAX = 1000;
export const QUOTE_TAX_RATE = 8.25;

export const exampleProblems = [
  "My bathroom faucet drips all night and the caulk around the tub is moldy.",
  "There's a fist-sized hole in my hallway wall and the closet door sticks.",
  "I want to replace my living room light with a ceiling fan and mount a 65 inch TV.",
];

export function validateQuoteRequest(description) {
  const text = description.trim();

  if (!text) {
    return "Describe the problem so we can build an estimate.";
  }
  if (text.length < QUOTE_MIN) {
    return `Add a little more detail (at least ${QUOTE_MIN} characters).`;
  }
  if (text.length > QUOTE_MAX) {
    return `Keep it under ${QUOTE_MAX} characters.`;
  }
  return null;
}

// Turns the AI's suggestions into a priced estimate.
// The AI only picks services and quantities. Prices always come from OUR
// service catalog, and any service ID the AI made up is thrown away.
// (This logic moves to the backend once the server is connected.)
export function buildEstimate(suggestions, services) {
  const lineItems = suggestions
    .map((suggestion) => {
      const service = services.find(
        (item) => item.id === suggestion.serviceId && item.active
      );
      if (!service) {
        return null;
      }

      const qty = service.unit === "flat" ? 1 : suggestion.quantity;

      return {
        id: service.id,
        serviceId: service.id,
        description: service.name,
        unit: service.unit,
        rate: service.rate,
        qty,
        lineTotal: Math.round(qty * service.rate * 100) / 100,
        reason: suggestion.reason,
      };
    })
    .filter((item) => item !== null);

  const estimate = { lineItems, taxRate: QUOTE_TAX_RATE };

  return {
    lineItems,
    subtotal: getSubtotal(estimate),
    tax: getTax(estimate),
    total: getTotal(estimate),
  };
}