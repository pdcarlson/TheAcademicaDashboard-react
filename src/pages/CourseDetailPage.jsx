import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "../lib/courses";
import { getAssignmentsForCourse } from "../lib/assignments";
import Modal from "../components/Modal";
import AddAssignmentForm from "../components/AddAssignmentForm";

const CourseDetailPage = () => {
  const { courseId } = useParams(); // get course id from url
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      const [courseData, assignmentsData] = await Promise.all([
        getCourse(courseId),
        getAssignmentsForCourse(courseId)
      ]);
      setCourse(courseData);
      setAssignments(assignmentsData);
      setIsLoading(false);
    };
    fetchCourseData();
  }, [courseId]);
  
  const handleAssignmentAdded = (newAssignment) => {
    setAssignments((prev) => [...prev, newAssignment]);
  };

  if (isLoading) {
    return <p>loading course details...</p>;
  }

  if (!course) {
    return <p>course not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/courses" className="text-sm text-primary hover:underline">&larr; Back to Courses</Link>
        <h1 className="text-3xl font-bold text-foreground" style={{ borderBottom: `3px solid ${course.colorCode}` }}>
            {course.courseName}
        </h1>
        <p className="text-muted-foreground">{course.professor}</p>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          Add Assignment
        </button>
      </div>

      {/* assignments list */}
      <div className="space-y-4">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.$id} className="flex justify-between items-center rounded-lg bg-card p-4">
              <div>
                <h3 className="font-bold">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground">{assignment.type}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Due: {new Date(assignment.dueDate).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">no assignments yet.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddAssignmentForm
          courseId={courseId}
          onClose={() => setIsModalOpen(false)}
          onAssignmentAdded={handleAssignmentAdded}
        />
      </Modal>
    </div>
  );
};

export default CourseDetailPage;