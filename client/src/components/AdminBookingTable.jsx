import StatusBadge from "./StatusBadge";
import { adminStatusActions, formatDateTime } from "../utils/bookingUtils";

function AdminBookingTable({ bookings, onChangeStatus }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">When</th>
            <th scope="col">Customer</th>
            <th scope="col" className="d-none d-md-table-cell">
              Service
            </th>
            <th scope="col">Status</th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => {
            const actions = adminStatusActions[booking.status] ?? [];

            return (
              <tr key={booking.id}>
                <td className="text-nowrap small">
                  {formatDateTime(booking.scheduledAt)}
                </td>
                <td>
                  <div className="fw-semibold">{booking.customerName}</div>
                  <div className="small text-muted">{booking.customerEmail}</div>
                </td>
                <td className="d-none d-md-table-cell">
                  <div>{booking.serviceName}</div>
                  <div className="small text-muted">{booking.address}</div>
                </td>
                <td>
                  <StatusBadge status={booking.status} />
                </td>
                <td className="text-end text-nowrap">
                  {actions.length === 0 ? (
                    <span className="small text-muted">No actions</span>
                  ) : (
                    actions.map((action) => (
                      <button
                        key={action.status}
                        type="button"
                        className={`btn btn-outline-${action.variant} btn-sm ms-2`}
                        onClick={() => onChangeStatus(booking, action.status)}
                      >
                        {action.label}
                      </button>
                    ))
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookingTable;