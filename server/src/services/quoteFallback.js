// Simple keyword matching used ONLY when the AI provider is unavailable,
// so customers still get a helpful answer. Matches services by name.

const keywordRules = [
  { name: "Leaky Faucet Repair", words: ["faucet", "drip", "sink"], quantity: 1 },
  { name: "Toilet Repair", words: ["toilet", "flush"], quantity: 1 },
  { name: "Drywall Patch", words: ["drywall", "hole", "crack", "dent"], quantity: 1 },
  { name: "Tub & Shower Recaulking", words: ["caulk", "mold", "mildew", "tub", "shower"], quantity: 1 },
  { name: "Light Fixture Install", words: ["light fixture", "fixture", "lamp", "pendant"], quantity: 1 },
  { name: "Ceiling Fan Install", words: ["ceiling fan", "fan"], quantity: 1 },
  { name: "Interior Painting", words: ["paint"], quantity: 4 },
  { name: "Door Repair & Adjustment", words: ["door", "hinge", "squeak", "stick"], quantity: 1 },
  { name: "TV Wall Mount", words: ["tv", "television", "tv mount", "wall mount"], quantity: 1 },
  { name: "General Handyman Labor", words: ["shelf", "shelves", "assemble", "furniture"], quantity: 2 },
];

export function getFallbackSuggestions({ description, services }) {
  const text = description.toLowerCase();
  const suggestions = [];

  for (const rule of keywordRules) {
    const service = services.find((s) => s.name === rule.name);
    const matched = rule.words.some((word) => text.includes(word));

    if (service && matched) {
      suggestions.push({
        serviceId: service.id,
        quantity: rule.quantity,
        reason: `Matched "${rule.name}" from your description.`,
      });
    }
  }

  return {
    summary:
      suggestions.length > 0
        ? "Our AI assistant is busy, so here's a quick keyword-based estimate."
        : "We couldn't match your description to one of our services.",
    suggestions,
  };
}