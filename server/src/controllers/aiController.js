import { createQuote } from "../services/quoteService.js";
import { validateQuoteRequest } from "../validators/quoteValidators.js";

// POST /api/ai/quote  (customer)
export async function getQuote(req, res) {
  const details = validateQuoteRequest(req.body);
  if (details.length > 0) {
    return res.status(400).json({ error: "Validation failed", details });
  }

  const quote = await createQuote(req.body.description.trim());
  res.json(quote);
}