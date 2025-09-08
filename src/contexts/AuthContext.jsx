import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // a function to check for a logged in user session
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        // no user session found
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      navigate("/");
    } catch (error) {
      console.error("failed to login:", error);
      // here you would probably want to show a toast notification
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("failed to logout:", error);
    }
  };

  const signup = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      // after signup, log the user in automatically
      await login(email, password);
    } catch (error) {
      console.error("failed to sign up:", error);
    }
  };

  const contextData = {
    user,
    isLoading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

// custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;