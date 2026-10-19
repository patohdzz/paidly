import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import ClientCard from "../components/ClientCard";
import ClientForm from "../components/ClientForm";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useData } from "../hooks/useData";

function ClientsPage() {
  const { clients, invoices, dispatch } = useData();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const query = search.trim().toLowerCase();

  const visibleClients = clients
    .filter(
      (client) =>
        query === "" ||
        client.company.toLowerCase().includes(query) ||
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
    )
    .sort((a, b) => a.company.localeCompare(b.company));

  function countInvoices(clientId) {
    return invoices.filter((invoice) => invoice.clientId === clientId).length;
  }

  function openAdd() {
    setModal({ mode: "add" });
  }

  function openEdit(client) {
    setModal({ mode: "edit", client });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSave(values) {
    if (modal.mode === "add") {
      dispatch({
        type: "ADD",
        collection: "clients",
        item: { ...values, id: crypto.randomUUID() },
      });
    } else {
      dispatch({ type: "UPDATE", collection: "clients", item: values });
    }
    closeModal();
  }

  function confirmDelete() {
    dispatch({ type: "DELETE", collection: "clients", id: deleting.id });
    setDeleting(null);
  }

  const deletingInvoiceCount = deleting ? countInvoices(deleting.id) : 0;

  return (
    <>
      <Header title="Clients" actionLabel="Add Client" onAction={openAdd} />

      {clients.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <EmptyState
              title="No clients yet"
              message="Add your first client to start creating invoices."
            >
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={openAdd}
              >
                Add Client
              </button>
            </EmptyState>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by company, name, or email"
              />
            </div>
          </div>

          {visibleClients.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <EmptyState
                  title="No matching clients"
                  message="Try a different search."
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                </EmptyState>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {visibleClients.map((client) => (
                <div className="col-12 col-md-6 col-xl-4" key={client.id}>
                  <ClientCard
                    client={client}
                    invoiceCount={countInvoices(client.id)}
                    onEdit={openEdit}
                    onDelete={setDeleting}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add Client" : "Edit Client"}
          onClose={closeModal}
        >
          <ClientForm
            initialValues={modal.mode === "edit" ? modal.client : undefined}
            submitLabel={modal.mode === "add" ? "Add Client" : "Save Changes"}
            onSubmit={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {deleting &&
        (deletingInvoiceCount > 0 ? (
          <ConfirmDialog
            title="Can't delete client"
            message={`${deleting.company} has ${deletingInvoiceCount} ${
              deletingInvoiceCount === 1 ? "invoice" : "invoices"
            }. Delete those invoices first, then you can delete this client.`}
            cancelLabel="OK"
            onCancel={() => setDeleting(null)}
          />
        ) : (
          <ConfirmDialog
            title="Delete client?"
            message={`${deleting.company} will be permanently deleted. This can't be undone.`}
            confirmLabel="Delete Client"
            onConfirm={confirmDelete}
            onCancel={() => setDeleting(null)}
          />
        ))}
    </>
  );
}

export default ClientsPage;