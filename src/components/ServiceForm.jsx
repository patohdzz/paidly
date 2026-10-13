import { useState } from "react";
import { unitOptions } from "../utils/serviceUtils";

const emptyService = { name: "", unit: "hr", rate: "" };

function validate(values, existingServices) {
  const errors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = "Service name is required.";
  } else if (
    existingServices.some(
      (service) =>
        service.id !== values.id &&
        service.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    errors.name = "A service with this name already exists.";
  }

  const rate = Number(values.rate);
  if (values.rate.trim() === "") {
    errors.rate = "Rate is required.";
  } else if (!Number.isFinite(rate) || rate <= 0) {
    errors.rate = "Rate must be a number greater than 0.";
  }

  return errors;
}

function ServiceForm({
  initialValues = emptyService,
  existingServices,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState({
    ...initialValues,
    rate: String(initialValues.rate),
  });
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

    const newErrors = validate(values, existingServices);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...values,
      name: values.name.trim(),
      rate: Math.round(Number(values.rate) * 100) / 100,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="service-name" className="form-label">
            Service name
          </label>
          <input
            id="service-name"
            name="name"
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={values.name}
            onChange={handleChange}
            placeholder="e.g. Editing"
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <label htmlFor="service-unit" className="form-label">
              Billed
            </label>
            <select
              id="service-unit"
              name="unit"
              className="form-select"
              value={values.unit}
              onChange={handleChange}
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-sm-6">
            <label htmlFor="service-rate" className="form-label">
              Rate
            </label>
            <div className="input-group has-validation">
              <span className="input-group-text">$</span>
              <input
                id="service-rate"
                name="rate"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                className={`form-control ${errors.rate ? "is-invalid" : ""}`}
                value={values.rate}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.rate && (
                <div className="invalid-feedback">{errors.rate}</div>
              )}
            </div>
          </div>
        </div>
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

export default ServiceForm;