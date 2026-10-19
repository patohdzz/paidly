import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useData } from "../hooks/useData";
import { formatDuration, formatRate } from "../utils/serviceUtils";

function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const { services } = useData();

  const service = services.find((item) => item.id === serviceId);

  if (!service || !service.active) {
    return (
      <div className="card border-0 shadow-sm">
        <EmptyState
          title="Service not found"
          message="This service doesn't exist or is no longer available."
        >
          <Link to="/services" className="btn btn-primary btn-sm">
            Browse all services
          </Link>
        </EmptyState>
      </div>
    );
  }

  const isHourly = service.unit === "hr";

  return (
    <>
      <Link to="/services" className="btn btn-link px-0 mb-3">
        &larr; Back to services
      </Link>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <span className="badge bg-primary-subtle text-primary-emphasis mb-2">
                {service.category}
              </span>
              <h1 className="h3 mb-3">{service.name}</h1>
              <p className="text-secondary mb-4">{service.description}</p>

              <h2 className="h6 fw-semibold">How it works</h2>
              <ol className="text-secondary small mb-0">
                <li>Pick a date and time that works for you.</li>
                <li>We review and confirm your booking.</li>
                <li>A technician arrives and completes the job.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <dl className="mb-4">
                <dt className="small text-muted fw-normal">Price</dt>
                <dd className="fs-4 fw-semibold mb-3">{formatRate(service)}</dd>

                <dt className="small text-muted fw-normal">Typical duration</dt>
                <dd className="mb-0">
                  About {formatDuration(service.durationMinutes)}
                </dd>
              </dl>

              {isHourly && (
                <p className="small text-muted">
                  Hourly services are billed for the actual time worked.
                </p>
              )}

              <Link
                to={`/services/${service.id}/book`}
                className="btn btn-primary w-100"
              >
                Book this service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceDetailsPage;