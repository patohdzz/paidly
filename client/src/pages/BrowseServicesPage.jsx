import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterSelect from "../components/FilterSelect";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import ServiceCard from "../components/ServiceCard";
import { servicesApi } from "../api/paidlyApi";
import { useApiData } from "../hooks/useApiData";
import { categoryOptions } from "../utils/serviceUtils";

const categoryFilterOptions = [
  { value: "all", label: "All categories" },
  ...categoryOptions.map((category) => ({ value: category, label: category })),
];

// Defined outside the component so it stays the same between renders.
const loadServices = (signal) => servicesApi.list(signal);

function BrowseServicesPage() {
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
      <div className="row g-3">
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
      <Header title="Browse Services" />

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search services, e.g. faucet or drywall"
          />
        </div>
        <div className="col-12 col-md-4">
          <FilterSelect
            label="Filter by category"
            value={category}
            options={categoryFilterOptions}
            onChange={setCategory}
          />
        </div>
      </div>

      {renderContent()}
    </>
  );
}

export default BrowseServicesPage;