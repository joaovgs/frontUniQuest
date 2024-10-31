import React, { useEffect, useState } from 'react';
import './Snackbar.css';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, isVisible, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const icon = type === 'success' ? '✔️' : '❌';

  return (
    <div className={`snackbar ${type} ${visible ? 'show' : ''}`}>
      <span className="icon">{icon}</span>
      {message}
    </div>
  );
};

export default Snackbar;
