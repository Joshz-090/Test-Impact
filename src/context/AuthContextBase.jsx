import { createContext, useContext } from "react";

export const AuthContext = createContext({
  currentUser: null,
  role: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}


