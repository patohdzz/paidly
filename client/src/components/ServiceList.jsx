import {
  countServiceUsage,
  formatDuration,
  formatRate,
} from "../utils/serviceUtils";

function ServiceList({ services, invoices, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Service</th>
            <th scope="col" className="d-none d-md-table-cell">
              Duration
            </th>
            <th scope="col" className="text-end">
              Rate
            </th>
            <th scope="col" className="text-center d-none d-lg-table-cell">
              Used in
            </th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {services.map((service) => {
            const usage = countServiceUsage(invoices, service.id);

            return (
              <tr key={service.id}>
                <td>
                  <div className="fw-semibold">
                    {service.name}
                    {!service.active && (
                      <span className="badge text-bg-secondary ms-2">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="small text-muted">{service.category}</div>
                </td>
                <td className="d-none d-md-table-cell text-nowrap">
                  {formatDuration(service.durationMinutes)}
                </td>
                <td className="text-end text-nowrap">{formatRate(service)}</td>
                <td className="text-center d-none d-lg-table-cell">
                  <span className="badge text-bg-light">
                    {usage} {usage === 1 ? "invoice" : "invoices"}
                  </span>
                </td>
                <td className="text-end text-nowrap">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => onEdit(service)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onDelete(service)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceList;