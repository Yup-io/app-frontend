import { useTheme } from '@mui/styles';
import { useMediaQuery } from '@mui/material';

const useDevice = () => {
  const theme = useTheme();

  return {
    isMobile: useMediaQuery(theme.breakpoints.down('md')),
    isDesktop: useMediaQuery(theme.breakpoints.up('md'))
  };
};

export default useDevice;
