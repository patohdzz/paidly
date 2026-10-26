function ErrorState({ message, onRetry }) {
  return (
    <div
      className="alert alert-danger d-flex justify-content-between align-items-center gap-3"
      role="alert"
    >
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;