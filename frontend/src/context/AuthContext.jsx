// import { createContext, useContext, useState } from "react";

// // Create Context
// const AuthContext = createContext();

// // Provider Component
// export function AuthProvider({ children }) {

//   const [user, setUser] = useState(null);

//   const [token, setToken] = useState(
//     localStorage.getItem("token") || ""
//   );

//   // Login
//   const login = (userData, jwtToken) => {

//     setUser(userData);

//     setToken(jwtToken);

//     localStorage.setItem("token", jwtToken);

//   };

//   // Logout
//   const logout = () => {

//     setUser(null);

//     setToken("");

//     localStorage.removeItem("token");

//   };

//   return (

//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         logout,
//       }}
//     >

//       {children}

//     </AuthContext.Provider>

//   );

// }

// // Custom Hook
// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(null);

  // Loading State
  const [loading, setLoading] = useState(true);

  // Runs once when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  // Login Function
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);