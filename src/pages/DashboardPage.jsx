import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCourses } from "../lib/courses";
import { getAllAssignments } from "../lib/assignments";
import { format } from "date-fns";

const DashboardPage = () => {
  const { user } = useAuth();
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

        // process assignments: filter for upcoming, add course name, sort, and take top 5
        const processedAssignments = assignmentsData
          .filter(a => new Date(a.dueDate) > now) // only show tasks that aren't past due
          .map(assignment => ({
            ...assignment,
            courseName: coursesMap[assignment.courseId] || 'Unknown Course' // add course name
          }))
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // sort by due date
          .slice(0, 5); // get the top 5

        setUpcomingAssignments(processedAssignments);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Dashboard</h1>
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
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-primary">{task.courseName}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(task.dueDate), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">no upcoming tasks. enjoy the quiet!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;