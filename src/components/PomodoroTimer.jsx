import { useTimer } from '../contexts/TimerContext';

const PomodoroTimer = () => {
  const { isActive, timeRemaining, activeAssignment, stopTimer } = useTimer();

  if (!isActive) {
    return null; // don't render anything if the timer isn't active
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed bottom-8 right-8 z-50 w-80 rounded-lg bg-card p-6 shadow-lg">
      <div className="text-center">
        <p className="text-lg font-bold text-primary">{activeAssignment?.title || 'Focus Session'}</p>
        <p className="my-2 text-5xl font-bold tracking-tighter text-foreground">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
        <button
          onClick={stopTimer}
          className="mt-4 w-full rounded-md bg-red-600 py-2 font-semibold text-white"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;