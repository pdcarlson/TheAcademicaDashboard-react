import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user, signup, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // loading state for button

  // redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch (error) {
      // errors are logged in the context, can add alerts here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
          {isLoginView ? "Login" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border bg-transparent p-2 text-foreground"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border bg-transparent p-2 text-foreground"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border bg-transparent p-2 text-foreground"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? "Processing..." : (isLoginView ? "Login" : "Sign Up")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="ml-1 font-semibold text-primary"
          >
            {isLoginView ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;