import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  DialogTitle,
  Typography,
  DialogContent,
  Dialog,
  withStyles
} from '@material-ui/core'
import { YupButton } from '../Miscellaneous'

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
    <Dialog
      aria-labelledby='form-dialog-title'
      onClose={handleSettingsClose}
      open={settingsOpen}
    >
      <DialogTitle className={classes.dialogTitle}>
        <Typography variant='h4'>Settings</Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText
              id='switch-list-label-wifi'
              primary='Log out of Yup'
            />
            <ListItemSecondaryAction>
              <YupButton
                onClick={handleLogout}
                variant='outlined'
                color='secondary'
                size='medium'
              >
                Log out
              </YupButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  )
})
