import { TourProvider } from '@reactour/tour';
import { useTheme } from '@mui/material';
import React from 'react'
import TutorialsButton from '../components/TutorialsButton'

const TutorialsProvider = ({ steps, children }) => {
  const theme = useTheme();

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
      <TutorialsButton />
    </TourProvider>
  );
};

export default TutorialsProvider;
