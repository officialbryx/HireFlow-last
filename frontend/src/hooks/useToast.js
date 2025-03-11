import { useState } from 'react';

export const useToast = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');

  const showToast = (type, msg, duration = 3000) => {
    setMessageType(type);
    setMessage(msg);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, duration);
  };

  return {
    showMessage,
    messageType,
    message,
    showToast
  };
};