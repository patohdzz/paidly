import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authApi } from "../api/paidlyApi";
import { getToken, setToken } from "../api/client";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token was saved, we must ask the server who it belongs to first.
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => getToken() !== null);

  // On page load: turn a saved token back into a logged-in user.
  useEffect(() => {
    if (!getToken()) return;

    let active = true;

    authApi
      .me()
      .then(({ user: savedUser }) => {
        if (active) setUser(savedUser);
      })
      .catch((error) => {
        if (active && error.status === 401) setToken(null);
      })
      .finally(() => {
        if (active) setIsCheckingAuth(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // If any request says our token is no longer valid, log out.
  useEffect(() => {
    function handleUnauthorized() {
      setToken(null);
      setUser(null);
    }

    window.addEventListener("paidly:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("paidly:unauthorized", handleUnauthorized);
  }, []);

  async function login({ email, password }) {
    const { token, user: loggedInUser } = await authApi.login({ email, password });
    setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register({ name, email, password }) {
    const { token, user: newUser } = await authApi.register({ name, email, password });
    setToken(token);
    setUser(newUser);
    return newUser;
  }

  // JWTs are stateless: logging out just means forgetting the token.
  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    isLoggedIn: user !== null,
    isAdmin: user?.role === "admin",
    isCheckingAuth,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;