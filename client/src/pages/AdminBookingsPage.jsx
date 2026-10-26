import { useState } from "react";
import Header from "../components/Header";
import KpiCard from "../components/KpiCard";
import SearchBar from "../components/SearchBar";
import FilterSelect from "../components/FilterSelect";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import ConfirmDialog from "../components/ConfirmDialog";
import AdminBookingTable from "../components/AdminBookingTable";
import { bookingsApi } from "../api/paidlyApi";
import { useApiData } from "../hooks/useApiData";
import {
  bookingStatusFilterOptions,
  formatDateTime,
  isUpcoming,
} from "../utils/bookingUtils";

const loadAllBookings = (signal) => bookingsApi.all(signal);

function AdminBookingsPage() {
  const { data, setData, loading, error, reload } = useApiData(loadAllBookings);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [cancelling, setCancelling] = useState(null);
  const [actionError, setActionError] = useState(null);

  const bookings = data ?? [];

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const upcomingConfirmedCount = bookings.filter(
    (b) => b.status === "confirmed" && isUpcoming(b)
  ).length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  const searchText = search.trim().toLowerCase();

  const visibleBookings = bookings
    .filter((booking) => status === "all" || booking.status === status)
    .filter(
      (booking) =>
        searchText === "" ||
        booking.customerName.toLowerCase().includes(searchText) ||
        booking.customerEmail.toLowerCase().includes(searchText) ||
        booking.serviceName.toLowerCase().includes(searchText)
    )
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  async function updateStatus(booking, newStatus) {
    setActionError(null);
    try {
      const updated =
        newStatus === "cancelled"
          ? await bookingsApi.cancel(booking.id)
          : await bookingsApi.setStatus(booking.id, newStatus);
      setData((list) => list.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      setActionError(err.message);
    }
  }

  function handleChangeStatus(booking, newStatus) {
    if (newStatus === "cancelled") {
      setCancelling(booking);
      return;
    }
    updateStatus(booking, newStatus);
  }

  async function confirmCancel() {
    const booking = cancelling;
    setCancelling(null);
    await updateStatus(booking, "cancelled");
  }

  function clearFilters() {
    setSearch("");
    setStatus("all");
  }

  if (loading) {
    return <LoadingState message="Loading bookings..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={reload} />;
  }

  return (
    <>
      <Header title="Bookings" />

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <KpiCard label="Needs review" value={pendingCount} variant="warning" />
        </div>
        <div className="col-12 col-md-4">
          <KpiCard
            label="Upcoming confirmed"
            value={upcomingConfirmedCount}
            variant="primary"
          />
        </div>
        <div className="col-12 col-md-4">
          <KpiCard label="Completed" value={completedCount} variant="success" />
        </div>
      </div>

      {actionError && <ErrorState message={actionError} />}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-12 col-md-8">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by customer or service"
              />
            </div>
            <div className="col-12 col-md-4">
              <FilterSelect
                label="Filter by status"
                value={status}
                options={bookingStatusFilterOptions}
                onChange={setStatus}
              />
            </div>
          </div>

          {visibleBookings.length === 0 ? (
            <EmptyState title="No bookings found" message="Try a different search or status.">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </EmptyState>
          ) : (
            <AdminBookingTable
              bookings={visibleBookings}
              onChangeStatus={handleChangeStatus}
            />
          )}
        </div>
      </div>

      {cancelling && (
        <ConfirmDialog
          title="Cancel this booking?"
          message={`${cancelling.customerName}'s ${cancelling.serviceName} on ${formatDateTime(
            cancelling.scheduledAt
          )} will be cancelled.`}
          confirmLabel="Cancel booking"
          cancelLabel="Keep booking"
          onConfirm={confirmCancel}
          onCancel={() => setCancelling(null)}
        />
      )}
    </>
  );
}

export default AdminBookingsPage;