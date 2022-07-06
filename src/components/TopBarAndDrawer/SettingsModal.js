import React from 'react';
import { YupButton } from '../Miscellaneous';
import YupDialog from '../Miscellaneous/YupDialog';

const SettingsModal = ({
  handleSettingsClose,
  settingsOpen,
  handleLogout
}) => {
  return (
    <YupDialog
      headline="Settings"
      description="Log out of Yup"
      onClose={handleSettingsClose}
      open={settingsOpen}
      aria-labelledby="form-dialog-title"
      firstButton={
        <YupButton
          onClick={handleLogout}
          variant="contained"
          color="primary"
          size="medium"
        >
          Log out
        </YupButton>
      }
    />
  );
};

export default SettingsModal;
