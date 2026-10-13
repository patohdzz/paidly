import Modal from "./Modal";

function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="modal-body">
        <p className="mb-0">{message}</p>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>

        {onConfirm && (
          <button
            type="button"
            className={`btn btn-${variant}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default ConfirmDialog;