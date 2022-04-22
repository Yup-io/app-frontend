import React from 'react'
import withStyles from '@mui/styles/withStyles';
import { YupButton } from '../Miscellaneous'
import YupDialog from '../Miscellaneous/YupDialog'

const styles = () => ({
  dialogTitle: {
    paddingLeft: '40px',
    paddingBottom: '10px'
  }
})

export const StyledSettingsModal = withStyles(styles)(function SettingsModal ({
  classes,
  handleSettingsClose,
  settingsOpen,
  handleLogout
}) {
  return (

    <YupDialog
      headline='Settings'
      description='Log out of Yup'
      onClose={handleSettingsClose}
      open={settingsOpen}
      aria-labelledby='form-dialog-title'
      firstButton={

        <YupButton
          onClick={handleLogout}
          variant='outlined'
          color='secondary'
          size='medium'
        >
        Log out
        </YupButton>
      }
    />
  )
})
