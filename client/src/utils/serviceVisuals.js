// Picks an icon and colors for a service, so every service has a picture.
// Category sets the color; keywords in the name pick a more specific icon.

const categoryStyles = {
  Plumbing: { icon: "bi-droplet-fill", color: "#0b6bcb", bg: "#e7f1fd" },
  Electrical: { icon: "bi-lightning-charge-fill", color: "#b7791f", bg: "#fdf4e3" },
  "Drywall & Painting": { icon: "bi-paint-bucket", color: "#8e44ad", bg: "#f4ecfa" },
  Carpentry: { icon: "bi-hammer", color: "#b4541a", bg: "#fbeee5" },
  "General Handyman": { icon: "bi-tools", color: "#14806e", bg: "#e5f5f2" },
};

const defaultStyle = { icon: "bi-wrench-adjustable", color: "#495057", bg: "#eef0f3" };

// [word in the name, icon, category to use if the service has none (e.g. bookings)]
const keywordIcons = [
  ["faucet", "bi-droplet-half", "Plumbing"],
  ["toilet", "bi-water", "Plumbing"],
  ["caulk", "bi-bucket-fill", "Plumbing"],
  ["disposal", "bi-droplet-fill", "Plumbing"],
  ["fan", "bi-fan", "Electrical"],
  ["light", "bi-lightbulb", "Electrical"],
  ["paint", "bi-brush", "Drywall & Painting"],
  ["drywall", "bi-bricks", "Drywall & Painting"],
  ["door", "bi-door-open", "Carpentry"],
  ["tv", "bi-tv", "Carpentry"],
  ["gutter", "bi-house-door", "General Handyman"],
  ["handyman", "bi-tools", "General Handyman"],
];

export const categoryIcons = Object.fromEntries(
  Object.entries(categoryStyles).map(([category, style]) => [category, style.icon])
);

export function getServiceVisual({ name = "", category } = {}) {
  const lowerName = name.toLowerCase();
  const match = keywordIcons.find(([word]) => lowerName.includes(word));

  const style = categoryStyles[category] ?? categoryStyles[match?.[2]] ?? defaultStyle;

  return { ...style, icon: match ? match[1] : style.icon };
}