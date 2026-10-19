import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/authUtils";

const emptyLogin = { email: "", password: "" };

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [values, setValues] = useState(emptyLogin);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validateLogin(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const loggedInUser = await login(values);
    navigate(loggedInUser.role === "admin" ? "/" : "/services");
  }

  return (
    <>
      <h1 className="h4 mb-1">Log in</h1>
      <p className="text-secondary small mb-4">
        Welcome back. Log in to book and manage your repairs.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Log in
        </button>
      </form>

      <p className="text-center small text-secondary mt-4 mb-0">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </p>
    </>
  );
}

export default LoginPage;