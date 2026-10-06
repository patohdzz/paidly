function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="search"
      className="form-control"
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;