import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <div className="w-full max-w-md rounded-lg bg-card p-8 text-center shadow-md">
        <h1 className="text-2xl font-bold text-foreground">Welcome to the Dashboard</h1>
        {user && <p className="mt-2 text-muted-foreground">Logged in as {user.name} ({user.email})</p>}
        <button
          onClick={logout}
          className="mt-6 w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
