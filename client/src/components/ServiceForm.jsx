import { useState } from "react";
import {
  categoryOptions,
  formatDuration,
  unitOptions,
} from "../utils/serviceUtils";

// code for when clicking "Add Service"

const durationOptions = [30, 60, 90, 120, 180, 240, 360, 480];

const DESCRIPTION_MAX = 300;

const emptyService = {
  name: "",
  category: categoryOptions[0],
  unit: "flat",
  rate: "",
  durationMinutes: 60,
  description: "",
  active: true,
};

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

  const description = values.description.trim();
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or less.`;
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
    ...emptyService,
    ...initialValues,
    rate: String(initialValues.rate),
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({ ...prev, [name]: newValue }));

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
      description: values.description.trim(),
      rate: Math.round(Number(values.rate) * 100) / 100,
      durationMinutes: Number(values.durationMinutes),
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
            placeholder="e.g. Leaky Faucet Repair"
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6">
            <label htmlFor="service-category" className="form-label">
              Category
            </label>
            <select
              id="service-category"
              name="category"
              className="form-select"
              value={values.category}
              onChange={handleChange}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-sm-6">
            <label htmlFor="service-duration" className="form-label">
              Typical duration
            </label>
            <select
              id="service-duration"
              name="durationMinutes"
              className="form-select"
              value={values.durationMinutes}
              onChange={handleChange}
            >
              {durationOptions.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {formatDuration(minutes)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3 mb-3">
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

        <div className="mb-3">
          <label htmlFor="service-description" className="form-label">
            Description
          </label>
          <textarea
            id="service-description"
            name="description"
            rows="3"
            maxLength={DESCRIPTION_MAX}
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            value={values.description}
            onChange={handleChange}
            placeholder="What's included in this service?"
          />
          <div className="d-flex justify-content-between">
            {errors.description ? (
              <div className="invalid-feedback d-block">
                {errors.description}
              </div>
            ) : (
              <span />
            )}
            <small className="text-muted">
              {values.description.length}/{DESCRIPTION_MAX}
            </small>
          </div>
        </div>

        <div className="form-check form-switch">
          <input
            id="service-active"
            name="active"
            type="checkbox"
            role="switch"
            className="form-check-input"
            checked={values.active}
            onChange={handleChange}
          />
          <label htmlFor="service-active" className="form-check-label">
            Active (customers can book this service)
          </label>
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