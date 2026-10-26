export const QUOTE_MIN = 10;
export const QUOTE_MAX = 1000;

export function validateQuoteRequest(body) {
  const { description } = body ?? {};

  if (typeof description !== "string") {
    return [{ field: "description", message: "Describe the problem" }];
  }

  const length = description.trim().length;

  if (length < QUOTE_MIN || length > QUOTE_MAX) {
    return [
      {
        field: "description",
        message: `Description must be ${QUOTE_MIN} to ${QUOTE_MAX} characters`,
      },
    ];
  }

  return [];
}