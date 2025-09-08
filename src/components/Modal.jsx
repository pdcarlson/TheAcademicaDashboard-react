const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // main overlay
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      {/* modal content */}
      <div
        onClick={(e) => e.stopPropagation()} // prevent clicks inside modal from closing it
        className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;