import StatusBadge from "./StatusBadge";
import { getClientName } from "../utils/clientUtils";
import {
  formatCurrency,
  formatDate,
  getStatus,
  getTotal,
} from "../utils/invoiceUtils";

function InvoiceTable({ invoices, clients }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Invoice</th>
            <th scope="col">Client</th>
            <th scope="col" className="d-none d-md-table-cell">
              Issued
            </th>
            <th scope="col" className="d-none d-sm-table-cell">
              Due
            </th>
            <th scope="col" className="text-end">
              Total
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="fw-semibold">{invoice.number}</td>
              <td>{getClientName(clients, invoice.clientId)}</td>
              <td className="d-none d-md-table-cell">
                {formatDate(invoice.issueDate)}
              </td>
              <td className="d-none d-sm-table-cell">
                {formatDate(invoice.dueDate)}
              </td>
              <td className="text-end">{formatCurrency(getTotal(invoice))}</td>
              <td>
                <StatusBadge status={getStatus(invoice)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;