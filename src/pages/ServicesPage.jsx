import { useState } from "react";
import Header from "../components/Header";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ServiceForm from "../components/ServiceForm";
import ServiceList from "../components/ServiceList";
import { useData } from "../hooks/useData";
import { countServiceUsage } from "../utils/serviceUtils";

function ServicesPage() {
  const { services, invoices, dispatch } = useData();

  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const sortedServices = [...services].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  function openAdd() {
    setModal({ mode: "add" });
  }

  function openEdit(service) {
    setModal({ mode: "edit", service });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSave(values) {
    if (modal.mode === "add") {
      dispatch({
        type: "ADD",
        collection: "services",
        item: { ...values, id: crypto.randomUUID() },
      });
    } else {
      dispatch({ type: "UPDATE", collection: "services", item: values });
    }
    closeModal();
  }

  function confirmDelete() {
    dispatch({ type: "DELETE", collection: "services", id: deleting.id });
    setDeleting(null);
  }

  const deletingUsage = deleting ? countServiceUsage(invoices, deleting.id) : 0;

  const deleteMessage =
    deletingUsage > 0
      ? `${deleting.name} is used in ${deletingUsage} ${
          deletingUsage === 1 ? "invoice" : "invoices"
        }. Those invoices will keep their line items, but this service won't be available for new invoices.`
      : `${deleting?.name} will be permanently deleted. This can't be undone.`;

  return (
    <>
      <Header title="Services" actionLabel="Add Service" onAction={openAdd} />

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {services.length === 0 ? (
            <EmptyState
              title="No services yet"
              message="Add the services you bill for, like hourly editing or a flat-fee shoot."
            >
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={openAdd}
              >
                Add Service
              </button>
            </EmptyState>
          ) : (
            <ServiceList
              services={sortedServices}
              invoices={invoices}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          )}
        </div>
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add Service" : "Edit Service"}
          onClose={closeModal}
        >
          <ServiceForm
            initialValues={modal.mode === "edit" ? modal.service : undefined}
            existingServices={services}
            submitLabel={modal.mode === "add" ? "Add Service" : "Save Changes"}
            onSubmit={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete service?"
          message={deleteMessage}
          confirmLabel="Delete Service"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

export default ServicesPage;