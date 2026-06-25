import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(() => {
    try {
      const saved = localStorage.getItem("ristorante_utente");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((token, utenteData) => {
    localStorage.setItem("ristorante_token", token);
    localStorage.setItem("ristorante_utente", JSON.stringify(utenteData));
    setUtente(utenteData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ristorante_token");
    localStorage.removeItem("ristorante_utente");
    setUtente(null);
  }, []);

  return (
    <AuthContext.Provider value={{ utente, login, logout, isAuth: !!utente }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getToken() {
  return localStorage.getItem("ristorante_token");
}
