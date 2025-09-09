import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { createTimeSession } from '../lib/timeSessions';
import { updateAssignmentTime } from '../lib/assignments';

const TimerContext = createContext();

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds

export const TimerProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  const startTimer = (assignment) => {
    setActiveAssignment(assignment);
    setTimeRemaining(FOCUS_DURATION);
    setIsActive(true);
    sessionStartTimeRef.current = new Date();
  };

  const stopTimer = () => {
    setIsActive(false);
    setActiveAssignment(null);
    setTimeRemaining(FOCUS_DURATION);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      // when timer finishes
      const sessionEndTime = new Date();
      const durationInMinutes = Math.round((sessionEndTime - sessionStartTimeRef.current) / (1000 * 60));

      const sessionData = {
        userId: user.$id,
        assignmentId: activeAssignment.$id,
        startTime: sessionStartTimeRef.current.toISOString(),
        endTime: sessionEndTime.toISOString(),
        duration: durationInMinutes,
        sessionId: 'placeholder', // these are required from our readme, we can just put a placeholder for now
      };
      
      createTimeSession(sessionData);

      const newTimeSpent = (activeAssignment.actualTimeSpent || 0) + durationInMinutes;
      updateAssignmentTime(activeAssignment.$id, newTimeSpent);

      stopTimer();
      alert('focus session complete!');
    }
  }, [timeRemaining, activeAssignment, user]);

  const value = {
    startTimer,
    stopTimer,
    isActive,
    timeRemaining,
    activeAssignment,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => {
  return useContext(TimerContext);
};