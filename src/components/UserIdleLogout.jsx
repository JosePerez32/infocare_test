import React, { useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';

const UserIdleLogout = ({ timeout = 6000000, onLogout }) => {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();

  const { reset, getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout,
    onIdle: () => {
      setIsIdle(true);
      onLogout();
    },
    debounce: 500,
  });

  useEffect(() => {
    if (isIdle) {
      navigate('/');
    }
  }, [isIdle, navigate]);

  return null; // This component doesn't render anything, it just handles the logout logic
};

export default UserIdleLogout;