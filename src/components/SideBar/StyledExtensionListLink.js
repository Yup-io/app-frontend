import React from 'react'
import {
  ListItem,
  ListItemText,
  Icon,
  ListItemIcon,
  Typography,
  Grow
} from '@material-ui/core'
import ListLink from '@material-ui/core/Link'
import { withStyles } from '@material-ui/core/styles'

const { EXTENSION_LINK } = process.env

const styles = () => ({
  listItem: {
    paddingLeft: 0,
    textDecoration: 'none'
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
