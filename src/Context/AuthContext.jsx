import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Authcontex = createContext();

export const Authprovider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || []);
  const [errorToast, setErrorToast] = useState("");
  const [popup, setPopup] = useState("");

  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const signup = (email, mobileNumber, password, username, name, navigate, gender, role) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some(u => u.email === email)) {
      setErrorToast("User with this email already exists. Please log in.");
      return;
    }

    if (users.some(u => u.username === username)) {
      setErrorToast("Username already taken. Please choose a different username.");
      return;
    }

    if (users.some(u => u.mobileNumber === mobileNumber)) {
      setErrorToast("User with this mobile number already exists. Please log in.");
      return;
    }

    const newUser = {
      email,
      mobileNumber,
      password,
      username,
      name,
      navigate,
      gender,
      role,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setPopup("Signup successful");

    setTimeout(() => {
      navigate("/dashboard");
    }, 4000);
  };

  const Login = (emailphone, password, username, navigate) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const isAdminId  =
    emailphone === import.meta.env.VITE_EMAIL ||
    emailphone === import.meta.env.VITE_MOBILE_NUMBER;

    if (isAdminId &&
      password === import.meta.env.VITE_PASSWORD &&
      username === import.meta.env.VITE_USERNAME
    ) {
      const adminData = {
        role: import.meta.env.VITE_ROLE,
        name: import.meta.env.VITE_NAME,
      };

      setUser(adminData);
      localStorage.setItem("user", JSON.stringify(adminData));
      setPopup("Admin login successful");

      setTimeout(() => {
        navigate("/adminpanel");
      }, 4000);
      return;
    }

    const foundUser = users.find(
      u => (u.email === emailphone || u.mobileNumber == emailphone) &&
      u.password === password && 
      u.username === username
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      setPopup("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } else {
      setErrorToast("Invalid credentials");
    }
  };

  const Logout = (navigate) => {
    setUser(null);
    localStorage.removeItem("user");
    setPopup("Logged out successfully.");
    navigate("/login");
  };

  return (
    <Authcontex.Provider value={{ signup, Login, Logout, user, users }}>
      {children}

      {popup && (
        <div
          role="alert"
          className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 border border-green-600 max-w-sm text-sm sm:text-base  mt-20"
        >
          ✅ {popup}
        </div>
      )}

      {errorToast && (
        <div
          role="alert"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 border border-red-700 max-w-sm text-sm sm:text-base"
        >
          ❌ {errorToast}
        </div>
      )}
    </Authcontex.Provider>
  );
};

export const useAuth = () => useContext(Authcontex);
