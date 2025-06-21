// // Registration, email verification, login, and reset password worked 16/04/25 

import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

export default function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

