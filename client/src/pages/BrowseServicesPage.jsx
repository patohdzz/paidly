import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterSelect from "../components/FilterSelect";
import EmptyState from "../components/EmptyState";
import ServiceCard from "../components/ServiceCard";
import { useData } from "../hooks/useData";
import { categoryOptions } from "../utils/serviceUtils";

const categoryFilterOptions = [
  { value: "all", label: "All categories" },
  ...categoryOptions.map((category) => ({ value: category, label: category })),
];

function BrowseServicesPage() {
  const { services } = useData();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const searchText = search.trim().toLowerCase();

  const visibleServices = services
    .filter((service) => service.active)
    .filter((service) => category === "all" || service.category === category)
    .filter(
      (service) =>
        searchText === "" ||
        service.name.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  function clearFilters() {
    setSearch("");
    setCategory("all");
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

      {visibleServices.length === 0 ? (
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
      ) : (
        <div className="row g-3">
          {visibleServices.map((service) => (
            <div className="col-12 col-md-6 col-xl-4" key={service.id}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default BrowseServicesPage;