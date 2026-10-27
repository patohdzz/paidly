import { useCallback, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { bookingsApi, servicesApi } from "../api/paidlyApi";
import { detailsToErrors } from "../api/client";
import { useApiData } from "../hooks/useApiData";
import { todayISO } from "../utils/formatUtils";
import { formatDuration, formatRate } from "../utils/serviceUtils";
import {
  NOTES_MAX,
  formatDateTime,
  timeSlotOptions,
  toScheduledAt,
  validateBooking,
} from "../utils/bookingUtils";

const emptyBooking = { date: "", time: "", address: "", notes: "" };

function BookServicePage() {
  const { serviceId } = useParams();
  const location = useLocation();

  const loadService = useCallback(
    (signal) => servicesApi.get(serviceId, signal),
    [serviceId]
  );
  const { data: service, loading, error, reload } = useApiData(loadService);

  const [values, setValues] = useState({
    ...emptyBooking,
    notes: (location.state?.notes ?? "").slice(0, NOTES_MAX),
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Quick checks in the browser. The server checks everything again,
    // including double-booking, which only it can see.
    const newErrors = validateBooking(values, {
      bookings: [],
      durationMinutes: service.durationMinutes,
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const booking = await bookingsApi.create({
        serviceId: service.id,
        scheduledAt: toScheduledAt(values.date, values.time),
        address: values.address.trim(),
        notes: values.notes.trim(),
      });
      setConfirmedBooking(booking);
    } catch (err) {
      if (err.status === 409) {
        setErrors({ time: err.message });
      } else if (err.details.length > 0) {
        const fieldErrors = detailsToErrors(err.details);
        setErrors({ ...fieldErrors, time: fieldErrors.scheduledAt });
      } else {
        setServerError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedBooking) {
    return (
      <div className="card border-0 shadow-sm mx-auto booking-success">
        <div className="card-body p-4 text-center">
          <div className="display-6 mb-2" aria-hidden="true">
            &#10003;
          </div>
          <h1 className="h4">Booking requested!</h1>
          <p className="text-secondary">
            <strong>{confirmedBooking.serviceName}</strong> on{" "}
            {formatDateTime(confirmedBooking.scheduledAt)}.
            <br />
            We&apos;ll review it and confirm soon.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Link to="/my/bookings" className="btn btn-primary">
              View my bookings
            </Link>
            <Link to="/services" className="btn btn-outline-secondary">
              Browse more services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link to={`/services/${service.id}`} className="btn btn-link px-0 mb-3">
        &larr; Back to {service.name}
      </Link>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-4">Book {service.name}</h1>

              {serverError && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="booking-date" className="form-label">
                      Date
                    </label>
                    <input
                      id="booking-date"
                      name="date"
                      type="date"
                      min={todayISO()}
                      className={`form-control ${errors.date ? "is-invalid" : ""}`}
                      value={values.date}
                      onChange={handleChange}
                    />
                    {errors.date && (
                      <div className="invalid-feedback">{errors.date}</div>
                    )}
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="booking-time" className="form-label">
                      Start time
                    </label>
                    <select
                      id="booking-time"
                      name="time"
                      className={`form-select ${errors.time ? "is-invalid" : ""}`}
                      value={values.time}
                      onChange={handleChange}
                    >
                      <option value="">Choose a time</option>
                      {timeSlotOptions.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {errors.time && (
                      <div className="invalid-feedback">{errors.time}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="booking-address" className="form-label">
                    Service address
                  </label>
                  <input
                    id="booking-address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    value={values.address}
                    onChange={handleChange}
                    placeholder="e.g. 123 Main St, Arlington, TX"
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="booking-notes" className="form-label">
                    Notes for the technician{" "}
                    <span className="text-muted">(optional)</span>
                  </label>
                  <textarea
                    id="booking-notes"
                    name="notes"
                    rows="3"
                    maxLength={NOTES_MAX}
                    className={`form-control ${errors.notes ? "is-invalid" : ""}`}
                    value={values.notes}
                    onChange={handleChange}
                    placeholder="Describe the problem, gate codes, parking, etc."
                  />
                  {errors.notes && (
                    <div className="invalid-feedback">{errors.notes}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? "Sending request..." : "Request booking"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h6 text-muted fw-normal mb-1">Booking summary</h2>
              <div className="fw-semibold mb-3">{service.name}</div>
              <dl className="small mb-0">
                <dt className="text-muted fw-normal">Price</dt>
                <dd>{formatRate(service)}</dd>
                <dt className="text-muted fw-normal">Typical duration</dt>
                <dd className="mb-0">
                  About {formatDuration(service.durationMinutes)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookServicePage;