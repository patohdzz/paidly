export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN = 8;

export function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateRegister(values) {
  const errors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2 || name.length > 50) {
    errors.name = "Name must be 2 to 50 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (
    values.password.length < PASSWORD_MIN ||
    !/[A-Za-z]/.test(values.password) ||
    !/[0-9]/.test(values.password)
  ) {
    errors.password = `Use at least ${PASSWORD_MIN} characters with a letter and a number.`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords don't match.";
  }

  return errors;
}