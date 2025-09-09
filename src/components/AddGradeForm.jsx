import { useState } from "react";
import { updateAssignment } from "../lib/assignments";

const AddGradeForm = ({ assignment, onClose, onGradeAdded }) => {
  const [gradeReceived, setGradeReceived] = useState(assignment.gradeReceived || '');
  const [maxGrade, setMaxGrade] = useState(assignment.maxGrade || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedData = {
        gradeReceived: parseFloat(gradeReceived),
        maxGrade: parseFloat(maxGrade),
        status: "Completed",
      };
      const updatedAssignment = await updateAssignment(assignment.$id, updatedData);
      if (updatedAssignment) {
        onGradeAdded(updatedAssignment);
        onClose();
      }
    } catch (error) {
      console.error("error submitting grade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Add/Edit Grade</h2>
      <p className="mb-6 text-muted-foreground">{assignment.title}</p>
      
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label htmlFor="gradeReceived" className="mb-2 block text-sm font-medium text-muted-foreground">
            Grade Received
          </label>
          <input
            type="number"
            step="any"
            id="gradeReceived"
            value={gradeReceived}
            onChange={(e) => setGradeReceived(e.target.value)}
            className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="maxGrade" className="mb-2 block text-sm font-medium text-muted-foreground">
            Max Grade
          </label>
          <input
            type="number"
            step="any"
            id="maxGrade"
            value={maxGrade}
            onChange={(e) => setMaxGrade(e.target.value)}
            className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Grade"}
      </button>
    </form>
  );
};

export default AddGradeForm;