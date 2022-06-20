import { TourProvider } from '@reactour/tour';
import { useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import TutorialsButton from '../components/TutorialsButton'
import { TUTORIAL_VISIBLE_PERIOD } from '../constants/const'

const TutorialsProvider = ({ steps, children }) => {
  const theme = useTheme();
  const [buttonVisible, setButtonVisible] = useState(true);

  useEffect(() => {
    const intervalId = setTimeout(() => setButtonVisible(false), TUTORIAL_VISIBLE_PERIOD);
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <TourProvider
      steps={steps}
      styles={{
        badge: (base) => ({
          ...base,
          backgroundColor: theme.palette.P500
        }),
        popover: (base) => ({
          ...base,
          borderRadius: 12
        }),
        dot: (base, { current }) => ({
          ...base,
          backgroundColor: current ? theme.palette.P500 : undefined
        })
      }}
    >
      {children}
      {buttonVisible && (
        <TutorialsButton />
      )}
    </TourProvider>
  );
};

export default TutorialsProvider;
