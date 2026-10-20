// TEMPORARY: a fake "AI" so we can build the screen before the backend exists.
// It returns the same shape the real AI endpoint will return:
// { summary, suggestions: [{ serviceId, quantity, reason }] }

const keywordRules = [
  { serviceId: "s1", words: ["faucet", "drip", "sink"], quantity: 1, reason: "A dripping or leaking faucet usually needs a new washer or cartridge." },
  { serviceId: "s2", words: ["toilet", "flush", "running water"], quantity: 1, reason: "Toilet issues like running or weak flushes are covered by a toilet repair." },
  { serviceId: "s3", words: ["drywall", "hole", "crack", "dent"], quantity: 1, reason: "Holes and cracks in walls are fixed with a drywall patch." },
  { serviceId: "s4", words: ["caulk", "mold", "mildew", "grout", "tub", "shower"], quantity: 1, reason: "Moldy or cracked caulk around a tub or shower should be removed and replaced." },
  { serviceId: "s5", words: ["light fixture", "fixture", "lamp", "pendant"], quantity: 1, reason: "Swapping a light fixture uses the existing wiring." },
  { serviceId: "s7", words: ["ceiling fan", "fan"], quantity: 1, reason: "A ceiling fan can replace an existing ceiling light." },
  { serviceId: "s8", words: ["paint", "repaint"], quantity: 4, reason: "Interior painting is billed hourly; a typical room takes about 4 hours." },
  { serviceId: "s9", words: ["door", "hinge", "squeak", "stick"], quantity: 1, reason: "Sticking or squeaky doors usually need hinge and strike-plate adjustment." },
  { serviceId: "s10", words: ["tv", "television", "tv mount", "wall mount"], quantity: 1, reason: "TV mounting into studs, including leveling and cable tidy-up." },
  { serviceId: "s6", words: ["shelf", "shelves", "assemble", "furniture"], quantity: 2, reason: "Small odd jobs are covered by hourly handyman labor." },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMockQuote(description) {
  await wait(900); // pretend the AI is thinking

  const text = description.toLowerCase();
  const suggestions = [];

  for (const rule of keywordRules) {
    const matched = rule.words.some((word) => text.includes(word));
    const alreadyAdded = suggestions.some((s) => s.serviceId === rule.serviceId);

    if (matched && !alreadyAdded) {
      suggestions.push({
        serviceId: rule.serviceId,
        quantity: rule.quantity,
        reason: rule.reason,
      });
    }
  }

  return {
    summary:
      suggestions.length > 0
        ? "Based on your description, these services should cover the job."
        : "We couldn't confidently match your description to one of our services.",
    suggestions,
  };
}