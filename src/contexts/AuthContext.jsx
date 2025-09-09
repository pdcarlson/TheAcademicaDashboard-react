import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const loginWithGoogle = () => {
    const successUrl = `${window.location.origin}/`; // redirect to dashboard on success
    const failureUrl = `${window.location.origin}/login`; // redirect to login on failure
    account.createOAuth2Session('google', successUrl, failureUrl);
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/login");
    } catch (error) { // added the missing curly braces here
      console.error("failed to logout:", error);
    } finally {
        setIsLoggingOut(false);
    }
  };

  const contextData = {
    user,
    isLoading,
    isLoggingOut,
    loginWithGoogle, // new login function
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;