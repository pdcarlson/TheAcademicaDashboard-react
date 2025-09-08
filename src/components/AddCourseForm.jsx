import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createCourse } from "../lib/courses";
import { ID } from "appwrite";

const AddCourseForm = ({ onClose, onCourseAdded }) => {
  const { user } = useAuth();
  const [courseName, setCourseName] = useState("");
  const [professor, setProfessor] = useState("");
  const [colorCode, setColorCode] = useState("#FFFFFF");
  const [isSubmitting, setIsSubmitting] = useState(false); // loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // disable button
    try {
      const courseData = {
        courseId: ID.unique(),
        userId: user.$id,
        courseName,
        professor,
        colorCode,
      };
      const newCourse = await createCourse(courseData);
      if (newCourse) {
        onCourseAdded(newCourse);
        onClose();
      }
    } catch (error) {
      console.error("error submitting form", error);
    } finally {
      setIsSubmitting(false); // re-enable button
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
        Add New Course
      </h2>
      <div className="mb-4">
        <label htmlFor="courseName" className="mb-2 block text-sm font-medium text-muted-foreground">
          Course Name
        </label>
        <input
          type="text"
          id="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="professor" className="mb-2 block text-sm font-medium text-muted-foreground">
          Professor
        </label>
        <input
          type="text"
          id="professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="colorCode" className="mb-2 block text-sm font-medium text-muted-foreground">
          Course Color
        </label>
        <input
          type="color"
          id="colorCode"
          value={colorCode}
          onChange={(e) => setColorCode(e.target.value)}
          className="h-10 w-full cursor-pointer rounded-md border-none bg-background p-0"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Course"}
      </button>
    </form>
  );
};

export default AddCourseForm;