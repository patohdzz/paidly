import { Link } from "react-router-dom";
import { formatDuration, formatRate } from "../utils/serviceUtils";

function ServiceCard({ service }) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <span className="badge bg-primary-subtle text-primary-emphasis align-self-start mb-2">
          {service.category}
        </span>

        <h2 className="h5 card-title">{service.name}</h2>

        <p className="card-text text-secondary small flex-grow-1">
          {service.description}
        </p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold">{formatRate(service)}</span>
          <span className="text-muted small">
            ~{formatDuration(service.durationMinutes)}
          </span>
        </div>

        <Link to={`/services/${service.id}`} className="btn btn-outline-primary">
          View details
        </Link>
      </div>
    </div>
  );
}

export default ServiceCard;