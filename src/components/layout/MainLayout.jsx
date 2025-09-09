import Sidebar from "./Sidebar";
import PomodoroTimer from "../PomodoroTimer"; // import the timer component

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8">{children}</main>
      <PomodoroTimer /> {/* add timer component here */}
    </div>
  );
};

export default MainLayout;