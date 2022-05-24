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
import withStyles from '@mui/styles/withStyles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug } from '@fortawesome/pro-light-svg-icons';
import { extensionUrl } from '../../config'

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
        href={extensionUrl}
        target='_blank'
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={faPlug}/>
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
