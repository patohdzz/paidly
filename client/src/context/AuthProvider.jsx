import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AUTH_STORAGE_KEY = "paidly-user";

// TEMPORARY: until the backend exists, this email logs in as an admin.
const DEMO_ADMIN_EMAIL = "admin@paidly.com";

function loadSavedUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function nameFromEmail(email) {
  const beforeAt = email.split("@")[0];
  return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSavedUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // TEMPORARY: fake login. Will call POST /api/auth/login later.
  async function login({ email }) {
    const cleanEmail = email.trim().toLowerCase();

    const loggedInUser = {
      id: `user-${cleanEmail}`,
      name: nameFromEmail(cleanEmail),
      email: cleanEmail,
      role: cleanEmail === DEMO_ADMIN_EMAIL ? "admin" : "customer",
    };

    setUser(loggedInUser);
    return loggedInUser;
  }

  // TEMPORARY: fake register. Will call POST /api/auth/register later.
  async function register({ name, email }) {
           const cleanEmail = email.trim().toLowerCase();

    const newUser = {
      id: `user-${cleanEmail}`,
      name: name.trim(),
      email: cleanEmail,
      role: "customer",
    };

    setUser(newUser);
    return newUser;
  }

  function logout() {
    setUser(null);
  }

  const value = {
    user,
    isLoggedIn: user !== null,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;