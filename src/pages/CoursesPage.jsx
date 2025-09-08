import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCourses, deleteCourse } from "../lib/courses";
import Modal from "../components/Modal";
import AddCourseForm from "../components/AddCourseForm";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); // track which menu is open

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        setIsLoading(true);
        const userCourses = await getCourses(user.$id);
        setCourses(userCourses);
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const handleCourseAdded = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const success = await deleteCourse(courseId);
      if (success) {
        // remove course from state to update ui instantly
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.$id !== courseId)
        );
      }
    }
  };

  const toggleMenu = (courseId) => {
    setOpenMenuId(openMenuId === courseId ? null : courseId);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Courses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          Add New Course
        </button>
      </div>

      {isLoading ? (
        <p>loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link to={`/courses/${course.$id}`} key={course.$id} className="block rounded-lg bg-card hover:ring-2 hover:ring-primary">
              <div
                className="relative p-6"
                style={{ borderTop: `5px solid ${course.colorCode}` }}
              >
                <div className="absolute top-4 right-4">
                  <button onClick={(e) => { e.preventDefault(); toggleMenu(course.$id); }} className="text-muted-foreground">
                    ...
                  </button>
                  {openMenuId === course.$id && (
                    <div className="absolute right-0 z-10 mt-2 w-32 rounded-md bg-background shadow-lg">
                      <button className="block w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-primary/20">
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); handleDelete(course.$id); }}
                        className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-primary/20"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold">{course.courseName}</h3>
                <p className="text-muted-foreground">{course.professor}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddCourseForm 
            onClose={() => setIsModalOpen(false)}
            onCourseAdded={handleCourseAdded}
        />
      </Modal>
    </div>
  );
};

export default CoursesPage;