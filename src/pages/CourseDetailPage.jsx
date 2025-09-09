import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "../lib/courses";
import { getAssignmentsForCourse } from "../lib/assignments";
import Modal from "../components/Modal";
import AddAssignmentForm from "../components/AddAssignmentForm";
import AddGradeForm from "../components/AddGradeForm"; // import new form
import { useTimer } from "../contexts/TimerContext";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false); // state for grade modal
  const [selectedAssignment, setSelectedAssignment] = useState(null); // track which assignment is being graded
  const { startTimer, isActive } = useTimer();

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

  const handleGradeAdded = (updatedAssignment) => {
    // find and update the assignment in the local state
    setAssignments(prev => prev.map(a => a.$id === updatedAssignment.$id ? updatedAssignment : a));
  };

  const openGradeModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsGradeModalOpen(true);
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
          onClick={() => setIsAssignmentModalOpen(true)}
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
                <p className="text-sm text-muted-foreground">{assignment.type} - {assignment.status}</p>
                {assignment.gradeReceived != null && (
                    <p className="text-sm font-bold text-primary">
                        Grade: {assignment.gradeReceived} / {assignment.maxGrade}
                    </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
                <button 
                    onClick={() => openGradeModal(assignment)}
                    className="rounded-md bg-primary/20 px-3 py-1 text-sm font-semibold text-primary"
                >
                    {assignment.gradeReceived != null ? 'Edit Grade' : 'Add Grade'}
                </button>
                <button 
                    onClick={() => startTimer(assignment)}
                    disabled={isActive || assignment.status === 'Completed'}
                    className="rounded-md bg-primary/20 px-3 py-1 text-sm font-semibold text-primary disabled:opacity-50"
                >
                    Focus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">no assignments yet.</p>
        )}
      </div>

      <Modal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)}>
        <AddAssignmentForm
          courseId={courseId}
          onClose={() => setIsAssignmentModalOpen(false)}
          onAssignmentAdded={handleAssignmentAdded}
        />
      </Modal>

      {/* grade modal */}
      <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)}>
        {selectedAssignment && (
            <AddGradeForm 
                assignment={selectedAssignment}
                onClose={() => setIsGradeModalOpen(false)}
                onGradeAdded={handleGradeAdded}
            />
        )}
      </Modal>
    </div>
  );
};

export default CourseDetailPage;