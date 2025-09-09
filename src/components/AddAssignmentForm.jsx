import { useState, useEffect } from "react";
import { createAssignment, updateAssignment } from "../lib/assignments";
import { ID } from "appwrite";
import { useAuth } from "../contexts/AuthContext";
import DateTimePicker from "./DateTimePicker";

const AddAssignmentForm = ({ courseId, onClose, onAssignmentUpdated, existingAssignment }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Homework");
  const [status, setStatus] = useState("Not Started");
  const [dueDate, setDueDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!existingAssignment;

  useEffect(() => {
    if (isEditMode) {
      setTitle(existingAssignment.title);
      setType(existingAssignment.type);
      setStatus(existingAssignment.status);
      setDueDate(new Date(existingAssignment.dueDate));
    }
  }, [existingAssignment, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dueDate) {
        alert("Please select a due date.");
        return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // logic for updating an existing assignment
        const updatedData = { title, type, status, dueDate: dueDate.toISOString() };
        const updatedAssignment = await updateAssignment(existingAssignment.$id, updatedData);
        if (updatedAssignment) {
          onAssignmentUpdated(updatedAssignment);
        }
      } else {
        // logic for creating a new assignment
        const assignmentData = {
          assignmentId: ID.unique(),
          courseId: courseId, 
          userId: user.$id,
          title,
          type,
          dueDate: dueDate.toISOString(),
          status,
          estimatedTime: 0,
          actualTimeSpent: 0,
          gradeReceived: null,
          maxGrade: null,
        };
        const newAssignment = await createAssignment(assignmentData);
        if (newAssignment) {
          onAssignmentUpdated(newAssignment);
        }
      }
      onClose();
    } catch (error) {
        console.error("Error submitting assignment form", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
        {isEditMode ? 'Edit Assignment' : 'Add New Assignment'}
      </h2>
      
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

      <div className="mb-4 flex gap-4">
        <div className="flex-1">
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
        <div className="flex-1">
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-muted-foreground">
            Status
            </label>
            <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
            >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
            </select>
        </div>
      </div>

      <div className="mb-6">
        <DateTimePicker value={dueDate} onChange={setDueDate} />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default AddAssignmentForm;