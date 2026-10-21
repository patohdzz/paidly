// MongoDB IDs are exactly 24 hexadecimal characters (0-9, a-f).
export function isValidId(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}