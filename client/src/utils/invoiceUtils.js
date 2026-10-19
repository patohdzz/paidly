function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}

export function getSubtotal(invoice) {
  return invoice.lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
}

export function getTax(invoice) {
  return roundMoney((getSubtotal(invoice) * invoice.taxRate) / 100);
}

export function getTotal(invoice) {
  return roundMoney(getSubtotal(invoice) + getTax(invoice));
}

export function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getStatus(invoice) {
  if (invoice.status === "Sent" && invoice.dueDate < todayISO()) {
    return "Overdue";
  }
  return invoice.status;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDashboardStats(invoices) {
  return invoices.reduce(
    (stats, invoice) => {
      const status = getStatus(invoice);
      if (status === "Draft") return stats;

      const total = getTotal(invoice);
      stats.billed += total;

      if (status === "Paid") stats.paid += total;
      else if (status === "Overdue") stats.overdue += total;
      else stats.outstanding += total;

      return stats;
    },
    { billed: 0, paid: 0, outstanding: 0, overdue: 0 }
  );
}