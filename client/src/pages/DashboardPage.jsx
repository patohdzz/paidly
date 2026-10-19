import Header from "../components/Header";
import KpiCard from "../components/KpiCard";
import StatusBadge from "../components/StatusBadge";
import { useData } from "../hooks/useData";
import { getClientName } from "../utils/clientUtils";
import {
  getDashboardStats,
  getStatus,
  getTotal,
  formatCurrency,
  formatDate,
} from "../utils/invoiceUtils";

function DashboardPage() {
  const { invoices, clients } = useData();

  const stats = getDashboardStats(invoices);

  const recentInvoices = [...invoices]
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 5);

  return (
    <>
      <Header
        title="Dashboard"
        actionLabel="New Invoice"
        onAction={() => alert("New invoice form coming soon!")}
      />

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard label="Total Billed" value={formatCurrency(stats.billed)} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard
            label="Paid"
            value={formatCurrency(stats.paid)}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard
            label="Outstanding"
            value={formatCurrency(stats.outstanding)}
            variant="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard
            label="Overdue"
            value={formatCurrency(stats.overdue)}
            variant="danger"
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3">Recent invoices</h2>

          {recentInvoices.length === 0 ? (
            <p className="text-secondary small mb-0">No invoices yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {recentInvoices.map((invoice) => (
                <li
                  key={invoice.id}
                  className="list-group-item d-flex justify-content-between align-items-center px-0"
                >
                  <div>
                    <div className="fw-semibold">{invoice.number}</div>
                    <div className="small text-secondary">
                      {getClientName(clients, invoice.clientId)} ·{" "}
                      {formatDate(invoice.issueDate)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-semibold">
                      {formatCurrency(getTotal(invoice))}
                    </span>
                    <StatusBadge status={getStatus(invoice)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;