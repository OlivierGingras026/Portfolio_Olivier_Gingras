import { useEffect, useState } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const toastListeners: Set<(toast: ToastMessage) => void> = new Set();

export const showToast = (message: string, type: ToastType = 'info') => {
  const id = `toast-${toastId++}`;
  const toast: ToastMessage = { id, message, type };
  toastListeners.forEach(listener => listener(toast));
};

export const Toast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 4000);
    };

    toastListeners.add(handleToast);
    return () => {
      toastListeners.delete(handleToast);
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};
