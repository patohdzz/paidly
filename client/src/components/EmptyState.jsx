function EmptyState({ title, message, children }) {
  return (
    <div className="text-center py-5 px-3">
      <h3 className="h6 fw-semibold mb-1">{title}</h3>
      <p className="text-secondary small mb-3">{message}</p>
      {children}
    </div>
  );
}

export default EmptyState;