import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PASSWORD_MIN, validateRegister } from "../utils/authUtils";

const emptyRegister = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const fields = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    hint: `At least ${PASSWORD_MIN} characters, with a letter and a number.`,
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
  },
];

function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState(emptyRegister);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validateRegister(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Temporary: will call the backend register API in a later step.
    navigate("/services");
  }

  return (
    <>
      <h1 className="h4 mb-1">Create your account</h1>
      <p className="text-secondary small mb-4">
        Sign up to book repairs and get instant AI estimates.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {fields.map((field) => (
          <div className="mb-3" key={field.name}>
            <label htmlFor={`register-${field.name}`} className="form-label">
              {field.label}
            </label>
            <input
              id={`register-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
              value={values[field.name]}
              onChange={handleChange}
            />
            {errors[field.name] ? (
              <div className="invalid-feedback">{errors[field.name]}</div>
            ) : (
              field.hint && <div className="form-text">{field.hint}</div>
            )}
          </div>
        ))}

        <button type="submit" className="btn btn-primary w-100 mt-2">
          Create account
        </button>
      </form>

      <p className="text-center small text-secondary mt-4 mb-0">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  );
}

export default RegisterPage;