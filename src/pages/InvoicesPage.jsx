import { useState } from "react";
import Header from "../components/Header";
import InvoiceTable from "../components/InvoiceTable";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import FilterSelect from "../components/FilterSelect";
import { invoices } from "../data/invoices";
import { clients } from "../data/clients";
import { getClientName } from "../utils/clientUtils";
import { getStatus, getTotal } from "../utils/invoiceUtils";

const statusOptions = [
  { value: "All", label: "All statuses" },
  { value: "Draft", label: "Draft" },
  { value: "Sent", label: "Sent" },
  { value: "Paid", label: "Paid" },
  { value: "Overdue", label: "Overdue" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount-high", label: "Amount: high to low" },
  { value: "amount-low", label: "Amount: low to high" },
  { value: "client", label: "Client: A to Z" },
];

function sortInvoices(list, sortBy, clients) {
  const sorted = [...list];

  if (sortBy === "oldest") {
    return sorted.sort((a, b) => a.issueDate.localeCompare(b.issueDate));
  }
  if (sortBy === "amount-high") {
    return sorted.sort((a, b) => getTotal(b) - getTotal(a));
  }
  if (sortBy === "amount-low") {
    return sorted.sort((a, b) => getTotal(a) - getTotal(b));
  }
  if (sortBy === "client") {
    return sorted.sort((a, b) =>
      getClientName(clients, a.clientId).localeCompare(
        getClientName(clients, b.clientId)
      )
    );
  }
  return sorted.sort((a, b) => b.issueDate.localeCompare(a.issueDate));
}

function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const query = search.trim().toLowerCase();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus =
      statusFilter === "All" || getStatus(invoice) === statusFilter;

    const clientName = getClientName(clients, invoice.clientId).toLowerCase();
    const matchesSearch =
      query === "" ||
      invoice.number.toLowerCase().includes(query) ||
      clientName.includes(query);

    return matchesStatus && matchesSearch;
  });

  const visibleInvoices = sortInvoices(filteredInvoices, sortBy, clients);
  const hasFilters = query !== "" || statusFilter !== "All";

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
  }

  return (
    <>
      <Header
        title="Invoices"
        actionLabel="New Invoice"
        onAction={() => alert("New invoice form coming soon!")}
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {invoices.length === 0 ? (
            <EmptyState
              title="No invoices yet"
              message="Create your first invoice to start getting paid."
            >
              <button type="button" className="btn btn-primary btn-sm">
                New Invoice
              </button>
            </EmptyState>
          ) : (
            <>
              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by invoice # or client"
                  />
                </div>
                <div className="col-6 col-md-3">
                  <FilterSelect
                    label="Filter by status"
                    value={statusFilter}
                    options={statusOptions}
                    onChange={setStatusFilter}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <FilterSelect
                    label="Sort invoices"
                    value={sortBy}
                    options={sortOptions}
                    onChange={setSortBy}
                  />
                </div>
              </div>

              <p className="small text-secondary mb-2">
                Showing {visibleInvoices.length} of {invoices.length} invoices
              </p>

              {visibleInvoices.length === 0 ? (
                <EmptyState
                  title="No matching invoices"
                  message="Try a different search or status."
                >
                  {hasFilters && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  )}
                </EmptyState>
              ) : (
                <InvoiceTable invoices={visibleInvoices} clients={clients} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default InvoicesPage;