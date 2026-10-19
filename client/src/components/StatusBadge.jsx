const statusStyles = {
  Draft: "text-bg-secondary",
  Sent: "text-bg-primary",
  Paid: "text-bg-success",
  Overdue: "text-bg-danger",
  pending: "text-bg-warning",
  confirmed: "text-bg-primary",
  completed: "text-bg-success",
  cancelled: "text-bg-secondary",
};

function StatusBadge({ status }) {
  const style = statusStyles[status] ?? "text-bg-light";

  return <span className={`badge rounded-pill text-capitalize ${style}`}>{status}</span>;
}

export default StatusBadge;