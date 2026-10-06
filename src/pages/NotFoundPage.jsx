import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4 fw-bold">404</h1>
      <p className="text-secondary mb-4">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;