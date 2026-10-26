import { useState } from "react";
import Header from "../components/Header";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ServiceForm from "../components/ServiceForm";
import ServiceList from "../components/ServiceList";
import { servicesApi } from "../api/paidlyApi";
import { useApiData } from "../hooks/useApiData";

const loadAllServices = (signal) => servicesApi.listAll(signal);

// Only send the fields the server lets admins edit.
function toServicePayload(values) {
  const { name, category, unit, rate, durationMinutes, description, active } = values;
  return { name, category, unit, rate, durationMinutes, description, active };
}

function ServicesPage() {
  const { data, setData, loading, error, reload } = useApiData(loadAllServices);

  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [actionError, setActionError] = useState(null);

  const services = data ?? [];
  const sortedServices = [...services].sort((a, b) => a.name.localeCompare(b.name));

  function openAdd() {
    setModal({ mode: "add" });
  }

  function openEdit(service) {
    setModal({ mode: "edit", service });
  }

  function closeModal() {
    setModal(null);
  }

  // Errors are shown inside the form, so let them bubble up.
  async function handleSave(values) {
    const payload = toServicePayload(values);

    if (modal.mode === "add") {
      const created = await servicesApi.create(payload);
      setData((list) => [...list, created]);
    } else {
      const updated = await servicesApi.update(modal.service.id, payload);
      setData((list) => list.map((s) => (s.id === updated.id ? updated : s)));
    }
    closeModal();
  }

  async function confirmDelete() {
    const service = deleting;
    setDeleting(null);
    setActionError(null);

    try {
      await servicesApi.remove(service.id);
      setData((list) => list.filter((s) => s.id !== service.id));
    } catch (err) {
      setActionError(err.message);
    }
  }

  function renderContent() {
    if (loading) {
      return <LoadingState message="Loading services..." />;
    }

    if (error) {
      return <ErrorState message={error.message} onRetry={reload} />;
    }

    if (services.length === 0) {
      return (
        <EmptyState
          title="No services yet"
          message="Add the services customers can book, like faucet repair or drywall patching."
        >
          <button type="button" className="btn btn-primary btn-sm" onClick={openAdd}>
            Add Service
          </button>
        </EmptyState>
      );
    }

    return <ServiceList services={sortedServices} onEdit={openEdit} onDelete={setDeleting} />;
  }

  return (
    <>
      <Header title="Manage Services" actionLabel="Add Service" onAction={openAdd} />

      {actionError && <ErrorState message={actionError} />}

      <div className="card border-0 shadow-sm">
        <div className="card-body">{renderContent()}</div>
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
          message={`${deleting.name} will be permanently deleted. Existing bookings keep their details. To hide it instead, edit it and turn off Active.`}
          confirmLabel="Delete Service"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

export default ServicesPage;