import { useState } from "react";

const emptyClient = { name: "", company: "", email: "", phone: "" };

const fields = [
  { name: "company", label: "Company", type: "text", required: true },
  { name: "name", label: "Contact name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone (optional)", type: "tel", required: false },
];

function validate(values) {
  const errors = {};

  if (!values.company.trim()) errors.company = "Company is required.";
  if (!values.name.trim()) errors.name = "Contact name is required.";

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function ClientForm({
  initialValues = emptyClient,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues);
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

    const newErrors = validate(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...values,
      company: values.company.trim(),
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body">
        {fields.map((field) => (
          <div className="mb-3" key={field.name}>
            <label htmlFor={`client-${field.name}`} className="form-label">
              {field.label}
            </label>
            <input
              id={`client-${field.name}`}
              name={field.name}
              type={field.type}
              className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
              value={values[field.name]}
              onChange={handleChange}
              required={field.required}
            />
            {errors[field.name] && (
              <div className="invalid-feedback">{errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ClientForm;