function Header({ title, actionLabel, onAction }) {
  return (
    <header className="d-flex justify-content-between align-items-center gap-3 mb-4">
      <h1 className="h3 mb-0">{title}</h1>

      {actionLabel && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </header>
  );
}

export default Header;