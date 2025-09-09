import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourse } from "../lib/courses";
import { getAssignmentsForCourse } from "../lib/assignments";
import Modal from "../components/Modal";
import AddAssignmentForm from "../components/AddAssignmentForm";
import AddGradeForm from "../components/AddGradeForm";
import { useTimer } from "../contexts/TimerContext";
import { format } from "date-fns"; // import format for consistent dates

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const { startTimer, isActive } = useTimer();

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      const [courseData, assignmentsData] = await Promise.all([
        getCourse(courseId),
        getAssignmentsForCourse(courseId)
      ]);
      setCourse(courseData);
      setAssignments(assignmentsData.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)));
      setIsLoading(false);
    };
    fetchCourseData();
  }, [courseId]);
  
  const handleAssignmentUpdated = (updatedAssignment) => {
    if (assignments.find(a => a.$id === updatedAssignment.$id)) {
      // it's an update, so replace it
      setAssignments(prev => prev.map(a => a.$id === updatedAssignment.$id ? updatedAssignment : a));
    } else {
      // it's a new assignment, so add it and re-sort
      setAssignments(prev => [...prev, updatedAssignment].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)));
    }
  };

  const handleGradeAdded = (updatedAssignment) => {
    setAssignments(prev => prev.map(a => a.$id === updatedAssignment.$id ? updatedAssignment : a));
  };

  const openGradeModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsGradeModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
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
        <h1 className="text-3xl font-bold text-foreground" style={{ borderBottom: `3px solid ${course.colorCode}` }}>
            {course.courseName}
        </h1>
        <p className="text-muted-foreground">{course.professor}</p>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
        <button
          onClick={() => { setSelectedAssignment(null); setIsAssignmentModalOpen(true); }}
          className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          Add Assignment
        </button>
      </div>

      <div className="space-y-4">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.$id} className="flex flex-col gap-4 rounded-lg bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground">{assignment.type} - {assignment.status}</p>
                {assignment.gradeReceived != null && (
                    <p className="text-sm font-bold text-primary">
                        Grade: {assignment.gradeReceived} / {assignment.maxGrade}
                    </p>
                )}
              </div>
              <div className="flex flex-shrink-0 items-center gap-2 self-end">
                <p className="text-sm font-medium text-foreground">
                    Due: {format(new Date(assignment.dueDate), "MMM d, h:mm a")}
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
                 <button onClick={() => openEditModal(assignment)} className="rounded-md bg-primary/20 px-3 py-1 text-sm font-semibold text-primary">
                    Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">no assignments yet.</p>
        )}
      </div>

      <Modal isOpen={isAssignmentModalOpen || isEditModalOpen} onClose={() => { setIsAssignmentModalOpen(false); setIsEditModalOpen(false); }}>
        <AddAssignmentForm
          courseId={courseId}
          existingAssignment={selectedAssignment}
          onClose={() => { setIsAssignmentModalOpen(false); setIsEditModalOpen(false); }}
          onAssignmentUpdated={handleAssignmentUpdated}
        />
      </Modal>

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