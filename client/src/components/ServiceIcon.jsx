import { getServiceVisual } from "../utils/serviceVisuals";

function ServiceIcon({ name, category, size = 48 }) {
  const { icon, color, bg } = getServiceVisual({ name, category });

  return (
    <span
      className="service-icon"
      style={{ width: size, height: size, color, backgroundColor: bg, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      <i className={`bi ${icon}`} />
    </span>
  );
}

export default ServiceIcon;