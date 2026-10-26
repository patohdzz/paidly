import { Service } from "../models/Service.js";
import { getGeminiSuggestions } from "./ai/geminiProvider.js";
import { getFallbackSuggestions } from "./quoteFallback.js";

export const QUOTE_TAX_RATE = 8.25;
const MAX_ITEMS = 5;

export const QUOTE_DISCLAIMER =
  "This is an AI-assisted estimate based on our standard prices. Review each service before booking. Your technician confirms the final price on site.";

function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}

// Hourly jobs: 0.5 to 8 hours, rounded to the nearest half hour.
// Daily jobs: 1 to 5 days. Flat-fee jobs: always 1.
function safeQuantity(unit, quantity) {
  const value = Number(quantity);

  if (unit === "hr") {
    const hours = Number.isFinite(value) ? Math.round(value * 2) / 2 : 1;
    return Math.min(Math.max(hours, 0.5), 8);
  }
  if (unit === "day") {
    const days = Number.isFinite(value) ? Math.round(value) : 1;
    return Math.min(Math.max(days, 1), 5);
  }
  return 1;
}

// Turns raw suggestions (from the AI or the fallback) into a priced estimate.
// The model only picks services; prices ALWAYS come from our database.
export function buildEstimate(suggestions, services) {
  const byId = new Map(services.map((s) => [s.id, s]));
  const seen = new Set();
  const lineItems = [];

  for (const suggestion of Array.isArray(suggestions) ? suggestions : []) {
    const service = byId.get(suggestion?.serviceId);

    // Drop invented or duplicate services.
    if (!service || seen.has(service.id) || lineItems.length >= MAX_ITEMS) {
      continue;
    }
    seen.add(service.id);

    const qty = safeQuantity(service.unit, suggestion.quantity);

    lineItems.push({
      serviceId: service.id,
      description: service.name,
      unit: service.unit,
      rate: service.rate,
      qty,
      lineTotal: roundMoney(qty * service.rate),
      reason: String(suggestion.reason ?? "").slice(0, 200),
    });
  }

  const subtotal = roundMoney(lineItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const tax = roundMoney((subtotal * QUOTE_TAX_RATE) / 100);

  return {
    lineItems,
    subtotal,
    taxRate: QUOTE_TAX_RATE,
    tax,
    total: roundMoney(subtotal + tax),
  };
}

export async function createQuote(description) {
  const services = await Service.find({ active: true });

  let result;
  let source = "ai";

  try {
    result = await getGeminiSuggestions({ description, services });
  } catch (error) {
    console.warn(`AI quote failed, using fallback: ${error.message}`);
    result = getFallbackSuggestions({ description, services });
    source = "fallback";
  }

  const estimate = buildEstimate(result?.suggestions, services);

  return {
    summary:
      typeof result?.summary === "string"
        ? result.summary.slice(0, 300)
        : "Here's your estimate.",
    source,
    estimate,
    disclaimer: QUOTE_DISCLAIMER,
  };
}