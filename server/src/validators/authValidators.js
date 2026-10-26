const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isText(value) {
  return typeof value === "string";
}

export function validateRegister(body) {
  const { name, email, password } = body ?? {};
  const details = [];

  if (!isText(name) || name.trim().length < 2 || name.trim().length > 50) {
    details.push({ field: "name", message: "Name must be 2 to 50 characters" });
  }

  if (!isText(email) || !EMAIL_PATTERN.test(email.trim()) || email.length > 254) {
    details.push({ field: "email", message: "Enter a valid email address" });
  }

  if (
    !isText(password) ||
    password.length < 8 ||
    password.length > 72 ||
    !/[A-Za-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    details.push({
      field: "password",
      message: "Password must be 8 to 72 characters with a letter and a number",
    });
  }

  return details;
}

export function validateLogin(body) {
  const { email, password } = body ?? {};
  const details = [];

  if (!isText(email) || !email.trim()) {
    details.push({ field: "email", message: "Email is required" });
  }

  if (!isText(password) || !password) {
    details.push({ field: "password", message: "Password is required" });
  }

  return details;
}