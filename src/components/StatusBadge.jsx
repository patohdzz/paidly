const statusStyles = {
  Draft: "text-bg-secondary",
  Sent: "text-bg-primary",
  Paid: "text-bg-success",
  Overdue: "text-bg-danger",
};

function StatusBadge({ status }) {
  const style = statusStyles[status] ?? "text-bg-light";

  return <span className={`badge rounded-pill ${style}`}>{status}</span>;
}

export default StatusBadge;