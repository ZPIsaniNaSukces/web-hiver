import { useState } from "react";

import { authPayload } from "@/types/auth-types";

export const useAuth = () => {
  const [authData, setAuthData] = useState<authPayload>({
    login: "",
    password: "",
  });

  const fetchLogin = async () => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.login,
        password: authData.password,
      }),
      credentials: "same-origin",
    });
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  };

  return { authData, setAuthData, fetchLogin };
};
