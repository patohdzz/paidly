function ClientCard({ client, invoiceCount, onEdit, onDelete }) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h3 className="h6 fw-bold mb-1">{client.company}</h3>
        <p className="text-secondary small mb-3">{client.name}</p>

        <ul className="list-unstyled small mb-3">
          <li className="text-truncate">
            <a href={`mailto:${client.email}`}>{client.email}</a>
          </li>
          {client.phone && <li>{client.phone}</li>}
        </ul>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="badge text-bg-light">
            {invoiceCount} {invoiceCount === 1 ? "invoice" : "invoices"}
          </span>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(client)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(client)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientCard;