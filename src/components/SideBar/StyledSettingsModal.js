import React from 'react'
import withStyles from '@mui/styles/withStyles'
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  DialogTitle,
  Typography,
  DialogContent,
  Dialog
} from '@mui/material'

const styles = theme => ({
  logoutBtn: {
    fontFamily: 'Gilroy',
    margin: 'auto',
    marginLeft: 15,
    letterSpacing: '0.2em',
    width: 100,
    height: 35,
    fontSize: 10,
    [theme.breakpoints.down('sm')]: {
      width: 75,
      height: 30,
      marginLeft: 5,
      fontSize: 7
    }
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
      <DialogTitle style={{ paddingLeft: '40px', paddingBottom: '10px' }}>
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
              <Button
                className={classes.logoutBtn}
                onClick={handleLogout}
                variant='outlined'
              >
                Log out
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  )
})
