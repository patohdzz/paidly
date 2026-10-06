import Header from "../components/Header";

function ClientsPage() {
  return (
    <>
      <Header
        title="Clients"
        actionLabel="Add Client"
        onAction={() => alert("Add client form coming soon!")}
      />
      <div className="card border-0 shadow-sm">
        <div className="card-body text-secondary">
          The client list will go here.
        </div>
      </div>
    </>
  );
}

export default ClientsPage;