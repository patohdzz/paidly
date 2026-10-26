import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import ServiceIcon from "../components/ServiceIcon";
import { servicesApi } from "../api/paidlyApi";
import { useApiData } from "../hooks/useApiData";
import { formatDuration, formatRate } from "../utils/serviceUtils";

function ServiceDetailsPage() {
  const { serviceId } = useParams();

  const loadService = useCallback(
    (signal) => servicesApi.get(serviceId, signal),
    [serviceId]
  );
  const { data: service, loading, error, reload } = useApiData(loadService);

  if (loading) {
    return <LoadingState message="Loading service..." />;
  }

  if (error?.status === 404) {
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

  if (error) {
    return <ErrorState message={error.message} onRetry={reload} />;
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
              <div className="d-flex align-items-center gap-3 mb-3">
                <ServiceIcon name={service.name} category={service.category} size={72} />
                <div>
                  <span className="badge bg-primary-subtle text-primary-emphasis mb-1">
                    {service.category}
                  </span>
                  <h1 className="h3 fw-bold mb-0">{service.name}</h1>
                </div>
              </div>
              <p className="text-secondary mb-4">{service.description}</p>

              <h2 className="h6 fw-semibold mb-3">How it works</h2>
              <ul className="list-unstyled small text-secondary mb-0 d-grid gap-2">
                <li>
                  <i className="bi bi-calendar-check text-primary me-2" aria-hidden="true" />
                  Pick a date and time that works for you.
                </li>
                <li>
                  <i className="bi bi-shield-check text-primary me-2" aria-hidden="true" />
                  We review and confirm your booking.
                </li>
                <li>
                  <i className="bi bi-tools text-primary me-2" aria-hidden="true" />
                  A technician arrives and completes the job.
                </li>
              </ul>
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
                <dd className="mb-0">About {formatDuration(service.durationMinutes)}</dd>
              </dl>

              {isHourly && (
                <p className="small text-muted">
                  Hourly services are billed for the actual time worked.
                </p>
              )}

              <Link to={`/services/${service.id}/book`} className="btn btn-primary w-100">
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