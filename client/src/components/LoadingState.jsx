function LoadingState({ message = "Loading..." }) {
  return (
    <div className="text-center text-secondary py-5" role="status">
      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
      {message}
    </div>
  );
}

export default LoadingState;