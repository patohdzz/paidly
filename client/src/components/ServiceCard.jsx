import { Link } from "react-router-dom";
import ServiceIcon from "./ServiceIcon";
import { formatDuration, formatRate } from "../utils/serviceUtils";
import { getServiceVisual } from "../utils/serviceVisuals";

function ServiceCard({ service }) {
  const { color, bg } = getServiceVisual(service);

  return (
    <div className="card service-card h-100 border-0 shadow-sm">
      <div
        className="service-card-banner"
        style={{ background: `linear-gradient(135deg, ${bg} 0%, #ffffff 100%)` }}
      >
        <ServiceIcon name={service.name} category={service.category} size={56} />
        <span className="badge rounded-pill bg-white border" style={{ color }}>
          {service.category}
        </span>
      </div>

      <div className="card-body d-flex flex-column pt-2">
        <h2 className="h5 card-title fw-semibold">{service.name}</h2>

        <p className="card-text text-secondary small flex-grow-1">{service.description}</p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fs-5 fw-bold">{formatRate(service)}</span>
          <span className="text-muted small">
            <i className="bi bi-clock me-1" aria-hidden="true" />
            {formatDuration(service.durationMinutes)}
          </span>
        </div>

        <Link to={`/services/${service.id}`} className="btn btn-outline-primary">
          View details <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default ServiceCard;