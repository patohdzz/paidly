export const QUOTE_MIN = 10;
export const QUOTE_MAX = 1000;

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