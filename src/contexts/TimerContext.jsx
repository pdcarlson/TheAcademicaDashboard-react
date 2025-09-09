import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { createTimeSession } from '../lib/timeSessions';
import { updateAssignmentTime } from '../lib/assignments';
import { ID } from 'appwrite'; // import the id generator

const TimerContext = createContext();

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds

export const TimerProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  // function to save a completed session
  const saveSession = async () => {
    if (!activeAssignment || !sessionStartTimeRef.current) return;

    const sessionEndTime = new Date();
    const durationInMinutes = Math.round((sessionEndTime - sessionStartTimeRef.current) / (1000 * 60));

    // only save sessions that are at least 1 minute long
    if (durationInMinutes < 1) return;

    const sessionData = {
      userId: user.$id,
      assignmentId: activeAssignment.$id,
      startTime: sessionStartTimeRef.current.toISOString(),
      endTime: sessionEndTime.toISOString(),
      duration: durationInMinutes,
      sessionId: ID.unique(), // use the id generator to create a unique id
    };
    
    await createTimeSession(sessionData);

    const newTimeSpent = (activeAssignment.actualTimeSpent || 0) + durationInMinutes;
    await updateAssignmentTime(activeAssignment.$id, newTimeSpent);
  };

  const startTimer = (assignment) => {
    setActiveAssignment(assignment);
    setTimeRemaining(FOCUS_DURATION);
    setIsActive(true);
    sessionStartTimeRef.current = new Date();
  };

  const stopTimer = () => {
    // save the session before stopping if it was active
    if (isActive) {
      saveSession();
    }
    setIsActive(false);
    setActiveAssignment(null);
    setTimeRemaining(FOCUS_DURATION);
    sessionStartTimeRef.current = null;
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
      // when timer finishes naturally
      saveSession().then(() => {
        stopTimer();
        alert('Focus session complete!');
      });
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