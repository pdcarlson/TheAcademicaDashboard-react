import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCourses } from "../lib/courses";
import { getAllAssignments } from "../lib/assignments";
import { useTimer } from "../contexts/TimerContext";
import Modal from "../components/Modal";
import { format } from "date-fns";

const DashboardPage = () => {
  const { user } = useAuth();
  const { startTimer, isActive } = useTimer();
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user) {
        setIsLoading(true);
        // fetch courses and assignments in parallel
        const [coursesData, assignmentsData] = await Promise.all([
          getCourses(user.$id),
          getAllAssignments(user.$id),
        ]);

        // create a quick lookup map for course names
        const coursesMap = coursesData.reduce((acc, course) => {
          acc[course.$id] = course.courseName;
          return acc;
        }, {});

        const now = new Date();
        
        const assignmentsWithCourseNames = assignmentsData.map(assignment => ({
            ...assignment,
            courseName: coursesMap[assignment.courseId] || 'Unknown Course'
        }));

        setAllAssignments(assignmentsWithCourseNames); // save all assignments for the modal

        // process assignments: filter for upcoming, add course name, sort, and take top 5
        const processedAssignments = assignmentsWithCourseNames
          .filter(a => new Date(a.dueDate) > now) // only show tasks that aren't past due
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // sort by due date
          .slice(0, 5); // get the top 5

        setUpcomingAssignments(processedAssignments);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleStartSessionFromModal = () => {
    if (selectedTaskId) {
        const taskToStart = allAssignments.find(a => a.$id === selectedTaskId);
        if (taskToStart) {
            startTimer(taskToStart);
        }
        setIsTaskModalOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <button
            onClick={() => setIsTaskModalOpen(true)}
            disabled={isActive}
            className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50"
        >
            Start Focus Session
        </button>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {/* main content area for the calendar */}
        <div className="col-span-2 rounded-lg bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Calendar View</h2>
          <div className="h-96 rounded-md bg-background">
            {/* placeholder for calendar */}
          </div>
        </div>

        {/* sidebar for upcoming tasks */}
        <div className="col-span-1 rounded-lg bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Upcoming Tasks</h2>
          {isLoading ? (
            <p className="text-muted-foreground">loading tasks...</p>
          ) : (
            <div className="space-y-4">
              {upcomingAssignments.length > 0 ? (
                upcomingAssignments.map((task) => (
                  <div key={task.$id} className="rounded-md bg-background p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{task.title}</p>
                            <p className="text-sm text-primary">{task.courseName}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {format(new Date(task.dueDate), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                        </div>
                        <button 
                            onClick={() => startTimer(task)}
                            disabled={isActive}
                            className="rounded-md bg-primary/20 px-3 py-1 text-xs font-semibold text-primary disabled:opacity-50"
                        >
                            Focus
                        </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">no upcoming tasks. enjoy the quiet!</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* modal for selecting any task to focus on */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <h2 className="mb-4 text-xl font-bold">Select a Task to Focus On</h2>
        <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground mb-6"
        >
            <option value="" disabled>Choose an assignment...</option>
            {allAssignments.map(task => (
                <option key={task.$id} value={task.$id}>{task.title} ({task.courseName})</option>
            ))}
        </select>
        <button
            onClick={handleStartSessionFromModal}
            disabled={!selectedTaskId}
            className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-50"
        >
            Start Session
        </button>
      </Modal>
    </div>
  );
};

export default DashboardPage;