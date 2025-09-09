import { useState } from "react";
import { createAssignment } from "../lib/assignments";
import { ID } from "appwrite";
import { useAuth } from "../contexts/AuthContext";
import DateTimePicker from "./DateTimePicker"; // import the new component

const AddAssignmentForm = ({ courseId, onClose, onAssignmentAdded }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Homework");
  const [dueDate, setDueDate] = useState(null); // single state for date and time
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dueDate) {
        alert("please select a due date.");
        return;
    }
    setIsSubmitting(true);
    try {
      const assignmentData = {
        assignmentId: ID.unique(),
        courseId: courseId, 
        userId: user.$id,
        title,
        type,
        dueDate: dueDate.toISOString(), // convert date object to iso string
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

      {/* new date time picker */}
      <div className="mb-6">
        <DateTimePicker value={dueDate} onChange={setDueDate} />
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