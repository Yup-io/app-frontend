import React from 'react';
import PropTypes from 'prop-types';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@mui/styles';

import RKProvider from './features/RKProvider';
import { AuthModalContextProvider } from './contexts/AuthModalContext';
import { StyledIndexPaper } from './components/StyledIndexPaper';
import { AppUtilsProvider } from './contexts/AppUtilsContext';

// TODO: Convert to Mui v5 styling
const useSnackbarStyles = makeStyles((theme) => ({
  snackbar: {
    backgroundColor: `${theme.palette.M100} !important`,
    color: `${theme.palette.M900} !important`
  }
}));

const Providers = ({ children }) => {
  const classes = useSnackbarStyles();

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      classes={{
        variantError: classes.snackbar,
        variantSuccess: classes.snackbar,
        variantInfo: classes.snackbar,
        variantWarning: classes.snackbar
      }}
    >
      <RKProvider>
        <AppUtilsProvider>
          <AuthModalContextProvider>
            <StyledIndexPaper>{children}</StyledIndexPaper>
          </AuthModalContextProvider>
        </AppUtilsProvider>
      </RKProvider>
    </SnackbarProvider>
  );
};

Providers.propTypes = {
  children: PropTypes.node
};

export default Providers;
