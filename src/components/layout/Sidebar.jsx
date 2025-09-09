import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <aside className="flex w-64 flex-col bg-card p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Academica</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link to="/" className="block rounded-lg p-2 text-foreground hover:bg-primary hover:text-primary-foreground">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/courses" className="block rounded-lg p-2 text-foreground hover:bg-primary hover:text-primary-foreground">
              Courses
            </Link>
          </li>
          <li className="mb-2">
            <a href="#" className="block rounded-lg p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground">
              Analytics
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        {user && (
          <div className="mb-4 text-sm">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          disabled={isLoggingOut}
          className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;