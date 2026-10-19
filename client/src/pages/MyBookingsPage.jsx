import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import EmptyState from "../components/EmptyState";
import BookingCard from "../components/BookingCard";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import RescheduleForm from "../components/RescheduleForm";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { canChangeBooking, formatDateTime } from "../utils/bookingUtils";

const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past & cancelled" },
];

function MyBookingsPage() {
  const { user } = useAuth();
  const { bookings, dispatch } = useData();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [rescheduling, setRescheduling] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const myBookings = bookings.filter((booking) => booking.userId === user.id);

  const upcoming = myBookings
    .filter(canChangeBooking)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  const past = myBookings
    .filter((booking) => !canChangeBooking(booking))
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));

  const visibleBookings = activeTab === "upcoming" ? upcoming : past;

  function handleReschedule(newScheduledAt) {
    dispatch({
      type: "UPDATE",
      collection: "bookings",
      item: { ...rescheduling, scheduledAt: newScheduledAt, status: "pending" },
    });
    setRescheduling(null);
  }

  function confirmCancel() {
    dispatch({
      type: "UPDATE",
      collection: "bookings",
      item: { ...cancelling, status: "cancelled" },
    });
    setCancelling(null);
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
              {tab.label} (
              {tab.value === "upcoming" ? upcoming.length : past.length})
            </button>
          </li>
        ))}
      </ul>

      {visibleBookings.length === 0 ? (
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
      ) : (
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
      )}

      {rescheduling && (
        <Modal
          title={`Reschedule ${rescheduling.serviceName}`}
          onClose={() => setRescheduling(null)}
        >
          <RescheduleForm
            booking={rescheduling}
            bookings={bookings}
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