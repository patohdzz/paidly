import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/invoiceUtils";
import { formatRate } from "../utils/serviceUtils";

function QuoteResult({ summary, estimate, description }) {
  if (estimate.lineItems.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 text-center">
          <h2 className="h5">No matching services</h2>
          <p className="text-secondary small mb-3">{summary}</p>
          <Link to="/services" className="btn btn-outline-primary btn-sm">
            Browse all services instead
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h5 mb-1">Your estimate</h2>
        <p className="text-secondary small mb-4">{summary}</p>

        <ul className="list-group list-group-flush mb-3">
          {estimate.lineItems.map((item) => (
            <li className="list-group-item px-0" key={item.id}>
              <div className="d-flex justify-content-between gap-3">
                <div>
                  <Link
                    to={`/services/${item.serviceId}`}
                    className="fw-semibold text-decoration-none"
                  >
                    {item.description}
                  </Link>
                  <div className="small text-secondary">{item.reason}</div>
                  <div className="small text-muted">
                    {item.qty} &times; {formatRate(item)}
                  </div>
                </div>
                <div className="text-end">
                  <div className="fw-semibold">
                    {formatCurrency(item.lineTotal)}
                  </div>
                  <Link
                    to={`/services/${item.serviceId}/book`}
                    state={{ notes: description }}
                    className="btn btn-primary btn-sm mt-2"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <dl className="row small mb-0">
          <dt className="col-6 fw-normal text-secondary">Subtotal</dt>
          <dd className="col-6 text-end mb-1">
            {formatCurrency(estimate.subtotal)}
          </dd>
          <dt className="col-6 fw-normal text-secondary">Estimated tax</dt>
          <dd className="col-6 text-end mb-1">{formatCurrency(estimate.tax)}</dd>
          <dt className="col-6 fs-6">Estimated total</dt>
          <dd className="col-6 text-end fs-6 fw-bold mb-0">
            {formatCurrency(estimate.total)}
          </dd>
        </dl>

        <p className="small text-muted border-top pt-3 mt-3 mb-0">
          This is an AI-assisted estimate based on our standard prices. AI can
          make mistakes, so review each service before booking. Your technician
          confirms the final price on site.
        </p>
      </div>
    </div>
  );
}

export default QuoteResult;