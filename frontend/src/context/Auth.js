import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('towingUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error while checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async ({ firstName, lastName, email, phone, password, cin, role = 'passenger' }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstName, lastName, email, phone, password, cin, role })
      });

      const data = await res.json();

      if (res.ok) {
        // Registration does not return token, so sign in the user automatically
        const loginRes = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          let userId = undefined;
          try {
            const payload = JSON.parse(atob(loginData.token.split('.')[1]));
            userId = payload.userId;
          } catch (e) {}
          const userData = {
            email,
            role: loginData.role,
            token: loginData.token,
            userId,
            firstName: loginData.firstName,
            lastName: loginData.lastName
          };
          localStorage.setItem("towingUser", JSON.stringify(userData));
          setUser(userData);
          return { success: true };
        } else {
          return { success: false, error: loginData.message || "Auto-login failed" };
        }
      } else {
        return { success: false, error: data.message || "Registration failed" };
      }
    } catch (error) {
      return { success: false, error: error.message || "Erreur réseau" };
    }
  };

  const signIn = async (email, password) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    // Always parse the JSON first
    const data = await res.json();
    console.log("Login API response:", data);

    // Handle errors explicitly if res.ok is false
    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Login failed"
      };
    }

    // Validate presence of token
    if (!data.token) {
      return {
        success: false,
        error: "No token returned from server."
      };
    }

    // Decode JWT payload to extract userId and role
    let userId = undefined;
    let role = undefined;
    try {
      const payloadBase64 = data.token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      userId = decodedPayload.userId;
      role = decodedPayload.role;
    } catch (e) {
      console.error("Failed to decode JWT payload:", e);
    }

    // Always store all relevant info in localStorage
    const userData = {
      email,
      role: role || data.role, // fallback to server-provided role
      token: data.token,
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      cin: data.cin,
      message: data.message || `Logged in as ${role || 'user'}`
    };

    localStorage.setItem("towingUser", JSON.stringify(userData));
    setUser(userData);

    return { success: true, token: data.token }; // return the token for your SignIn.js
  } catch (error) {
    console.error("Login request error:", error);
    return { success: false, error: error.message || "Network error" };
  }
};

  const signOut = () => {
    localStorage.removeItem('towingUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};