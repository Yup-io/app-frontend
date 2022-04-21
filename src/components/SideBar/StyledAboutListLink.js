import React from 'react'
import withStyles from '@mui/styles/withStyles'
import {
  ListItem,
  ListItemText,
  Icon,
  ListItemIcon,
  Typography
} from '@mui/material'
import ListLink from '@mui/material/Link'

const { YUP_LANDING } = process.env

const styles = () => ({
  listItem: {
    borderRadius: '0.4rem',
    textDecoration: 'none',
    display: 'none'
  },
  listItemIcon: {
    minWidth: '20px'
  }
})

export const StyledAboutListLink = withStyles(styles)(function AboutListLink ({ classes }) {
  return (
    <ListItem
      className={classes.listItem}
      button
      component={ListLink}
      href={YUP_LANDING}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <Icon className='fal fa-globe' />
      </ListItemIcon>
      <ListItemText>
        <Typography variant='body2'>About</Typography>
      </ListItemText>
    </ListItem>
  )
})
