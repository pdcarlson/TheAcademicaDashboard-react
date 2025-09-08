import { useState } from "react";
import { createAssignment } from "../lib/assignments";
import { ID } from "appwrite";
import { useAuth } from "../contexts/AuthContext";

const AddAssignmentForm = ({ courseId, onClose, onAssignmentAdded }) => {
  const { user } = useAuth(); // get the authenticated user
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Homework");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const assignmentData = {
        assignmentId: ID.unique(),
        courseId: courseId, 
        userId: user.$id, // add the user's id to the document data
        title,
        type,
        dueDate,
        status: "Not Started",
        estimatedTime: 0,
        actualTimeSpent: 0,
        gradeReceived: null,
        maxGrade: null,
      };
      const newAssignment = await createAssignment(assignmentData);
      if (newAssignment) {
        onAssignmentAdded(newAssignment);
        onClose();
      }
    } catch (error) {
        console.error("error submitting assignment form", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
        Add New Assignment
      </h2>
      
      {/* title */}
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-muted-foreground">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
          required
        />
      </div>

      {/* type */}
      <div className="mb-4">
        <label htmlFor="type" className="mb-2 block text-sm font-medium text-muted-foreground">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
        >
          <option>Homework</option>
          <option>Project</option>
          <option>Quiz</option>
          <option>Exam</option>
          <option>Lab</option>
        </select>
      </div>

      {/* due date */}
      <div className="mb-6">
        <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-muted-foreground">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Assignment"}
      </button>
    </form>
  );
};

export default AddAssignmentForm;