function KpiCard({ label, value, variant = "primary" }) {
  return (
    <div
      className={`card h-100 border-0 border-start border-4 border-${variant} shadow-sm`}
    >
      <div className="card-body">
        <p className="text-secondary small text-uppercase fw-semibold mb-1">
          {label}
        </p>
        <p className="fs-3 fw-bold mb-0">{value}</p>
      </div>
    </div>
  );
}

export default KpiCard;