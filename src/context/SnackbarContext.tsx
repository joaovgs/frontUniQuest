import React, { createContext, useState, useContext } from 'react';
import Snackbar from '../components/Snackbar/Snackbar';

type SnackbarContextType = {
  showSnackbar: (message: string, type: 'success' | 'error') => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'error',
    isVisible: false,
  });

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ message, type, isVisible: true });

    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={() => setSnackbar((prev) => ({ ...prev, isVisible: false }))}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
