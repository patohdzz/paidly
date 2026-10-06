import Header from "../components/Header";

function ServicesPage() {
  return (
    <>
      <Header
        title="Services"
        actionLabel="Add Service"
        onAction={() => alert("Add service form coming soon!")}
      />
      <div className="card border-0 shadow-sm">
        <div className="card-body text-secondary">
          The service catalog will go here.
        </div>
      </div>
    </>
  );
}

export default ServicesPage;