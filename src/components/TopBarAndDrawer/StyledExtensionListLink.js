import React from 'react'
import {
  ListItem,
  ListItemText,
  Icon,
  ListItemIcon,
  Typography,
  Grow
} from '@mui/material'
import ListLink from '@mui/material/Link'
import withStyles from '@mui/styles/withStyles';

const { EXTENSION_LINK } = process.env

const styles = () => ({
  listItem: {
    paddingLeft: 0,
    textDecoration: 'none',
    borderRadius: '0.4rem'
  }
})

export const StyledExtensionListLink = withStyles(styles)(
  function ExtensionListLink ({ classes, isShown, isMobile }) {
    return (
      <ListItem
        className={classes.listItem}
        button
        component={ListLink}
        href={EXTENSION_LINK}
        target='_blank'
      >
        <ListItemIcon>
          <Icon fontSize='small'
            className='fal fa-plug'
          />
        </ListItemIcon>
        {(isShown || isMobile) && (
          <Grow in
            timeout={600}
          >
            <ListItemText>
              <Typography variant='body2'>Extension</Typography>
            </ListItemText>
          </Grow>
        )}
      </ListItem>
    )
  }
)
