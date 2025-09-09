import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import Modal from "./Modal";

const DateTimePicker = ({ value, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // local state to manage selection inside the modal
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [selectedTime, setSelectedTime] = useState(
    value ? format(value, "HH:mm") : "23:59" // default time is now 11:59 pm
  );

  const handleDaySelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleDone = () => {
    // combine date and time into a single date object
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hours, minutes);
    onChange(newDateTime); // pass the final date object to the parent
    setIsModalOpen(false);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted-foreground">
        Due Date
      </label>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-left text-foreground"
      >
        {value ? format(value, "PPP 'at' h:mm a") : "Select a date and time"}
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col items-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            className="text-foreground"
          />
          <div className="mt-4 w-full">
            <label htmlFor="time" className="mb-2 block text-sm font-medium text-muted-foreground">
                Time
            </label>
            <input
              type="time"
              id="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="w-full rounded-md border border-muted-foreground/50 bg-background p-2 text-foreground"
            />
          </div>
          <div className="mt-6 flex w-full justify-end gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 font-semibold text-muted-foreground">
              Cancel
            </button>
            <button type="button" onClick={handleDone} className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DateTimePicker;