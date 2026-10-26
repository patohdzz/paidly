import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import ServiceCard from "../components/ServiceCard";
import { servicesApi } from "../api/paidlyApi";
import { useApiData } from "../hooks/useApiData";
import { useAuth } from "../hooks/useAuth";
import { categoryOptions } from "../utils/serviceUtils";
import { categoryIcons } from "../utils/serviceVisuals";

// Defined outside the component so it stays the same between renders.
const loadServices = (signal) => servicesApi.list(signal);

function BrowseServicesPage() {
  const { isAdmin } = useAuth();
  const { data: services, loading, error, reload } = useApiData(loadServices);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const searchText = search.trim().toLowerCase();

  const visibleServices = (services ?? [])
    .filter((service) => category === "all" || service.category === category)
    .filter(
      (service) =>
        searchText === "" ||
        service.name.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText)
    );

  function clearFilters() {
    setSearch("");
    setCategory("all");
  }

  function renderContent() {
    if (loading) {
      return <LoadingState message="Loading services..." />;
    }

    if (error) {
      return <ErrorState message={error.message} onRetry={reload} />;
    }

    if (visibleServices.length === 0) {
      return (
        <div className="card border-0 shadow-sm">
          <EmptyState
            title="No services match your search"
            message="Try a different word or category."
          >
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </EmptyState>
        </div>
      );
    }

    return (
      <div className="row g-4">
        {visibleServices.map((service) => (
          <div className="col-12 col-md-6 col-xl-4" key={service.id}>
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="hero rounded-4 p-4 p-md-5 mb-4 text-white">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <h1 className="display-6 fw-bold mb-2">Home repairs, booked in minutes</h1>
            <p className="lead mb-4 hero-subtitle">
              Browse trusted services, or describe the problem in your own words and
              get an instant AI estimate.
            </p>
            {!isAdmin && (
              <Link to="/quote" className="btn btn-light btn-lg fw-semibold">
                <i className="bi bi-stars me-2" aria-hidden="true" />
                Get an AI estimate
              </Link>
            )}
          </div>
          <div className="col-lg-4 d-none d-lg-block text-center">
            <i className="bi bi-house-gear-fill hero-icon" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <h2 className="h4 fw-semibold mb-0">Our services</h2>
        <div className="browse-search">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search, e.g. faucet or drywall"
          />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={`btn btn-sm rounded-pill category-chip ${
            category === "all" ? "btn-dark" : "btn-outline-secondary"
          }`}
          onClick={() => setCategory("all")}
        >
          <i className="bi bi-grid me-1" aria-hidden="true" />
          All
        </button>
        {categoryOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={`btn btn-sm rounded-pill category-chip ${
              category === option ? "btn-dark" : "btn-outline-secondary"
            }`}
            aria-pressed={category === option}
            onClick={() => setCategory(option)}
          >
            <i className={`bi ${categoryIcons[option]} me-1`} aria-hidden="true" />
            {option}
          </button>
        ))}
      </div>

      {renderContent()}
    </>
  );
}

export default BrowseServicesPage;