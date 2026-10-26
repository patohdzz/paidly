import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import BookingCard from "../components/BookingCard";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import RescheduleForm from "../components/RescheduleForm";
import { bookingsApi } from "../api/paidlyApi";
import { useApiData } from "../hooks/useApiData";
import { canChangeBooking, formatDateTime } from "../utils/bookingUtils";

const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past & cancelled" },
];

const loadMyBookings = (signal) => bookingsApi.mine(signal);

function MyBookingsPage() {
  const { data, setData, loading, error, reload } = useApiData(loadMyBookings);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [rescheduling, setRescheduling] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [actionError, setActionError] = useState(null);

  // The server only sends bookings that belong to the logged-in customer.
  const myBookings = data ?? [];

  const upcoming = myBookings
    .filter(canChangeBooking)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  const past = myBookings
    .filter((booking) => !canChangeBooking(booking))
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));

  const visibleBookings = activeTab === "upcoming" ? upcoming : past;

  function replaceBooking(updated) {
    setData((list) => list.map((b) => (b.id === updated.id ? updated : b)));
  }

  // Errors are shown inside the reschedule form, so let them bubble up.
  async function handleReschedule(newScheduledAt) {
    const updated = await bookingsApi.reschedule(rescheduling.id, newScheduledAt);
    replaceBooking(updated);
    setRescheduling(null);
  }

  async function confirmCancel() {
    setActionError(null);
    try {
      replaceBooking(await bookingsApi.cancel(cancelling.id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCancelling(null);
    }
  }

  function renderContent() {
    if (loading) {
      return <LoadingState message="Loading your bookings..." />;
    }

    if (error) {
      return <ErrorState message={error.message} onRetry={reload} />;
    }

    if (visibleBookings.length === 0) {
      return (
        <div className="card border-0 shadow-sm">
          {activeTab === "upcoming" ? (
            <EmptyState
              title="No upcoming bookings"
              message="When you book a service, it will show up here."
            >
              <Link to="/services" className="btn btn-primary btn-sm">
                Browse services
              </Link>
            </EmptyState>
          ) : (
            <EmptyState
              title="No past bookings yet"
              message="Completed and cancelled bookings will show up here."
            />
          )}
        </div>
      );
    }

    return (
      <div className="row g-3">
        {visibleBookings.map((booking) => (
          <div className="col-12 col-xl-6" key={booking.id}>
            <BookingCard
              booking={booking}
              onReschedule={setRescheduling}
              onCancel={setCancelling}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Header title="My Bookings" />

      <ul className="nav nav-pills mb-4">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.value}>
            <button
              type="button"
              className={`nav-link ${activeTab === tab.value ? "active" : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label} ({tab.value === "upcoming" ? upcoming.length : past.length})
            </button>
          </li>
        ))}
      </ul>

      {actionError && <ErrorState message={actionError} />}

      {renderContent()}

      {rescheduling && (
        <Modal
          title={`Reschedule ${rescheduling.serviceName}`}
          onClose={() => setRescheduling(null)}
        >
          <RescheduleForm
            booking={rescheduling}
            onSubmit={handleReschedule}
            onCancel={() => setRescheduling(null)}
          />
        </Modal>
      )}

      {cancelling && (
        <ConfirmDialog
          title="Cancel this booking?"
          message={`${cancelling.serviceName} on ${formatDateTime(
            cancelling.scheduledAt
          )} will be cancelled. This can't be undone.`}
          confirmLabel="Cancel booking"
          cancelLabel="Keep booking"
          onConfirm={confirmCancel}
          onCancel={() => setCancelling(null)}
        />
      )}
    </>
  );
}

export default MyBookingsPage;