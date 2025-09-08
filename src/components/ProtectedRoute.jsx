import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // if loading is finished and there is no user, redirect to login
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // while checking for user, show a loading indicator
  if (isLoading) {
    return <div>Loading...</div>; // or a spinner component
  }

  // if user is authenticated, render the requested component
  return user ? children : null;
};

export default ProtectedRoute;
