import React from 'react';
import { List } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { StyledAboutListLink } from './StyledAboutListLink';
import { StyledExtensionListLink } from './StyledExtensionListLink';

const styles = () => ({
  list1: {
    background: 'transparent',
    border: '0px solid #e6e6e6'
  }
});

export const StyledYupProductNav = withStyles(styles)(function YupProductNav({
  account,
  classes,
  isShown,
  isMobile
}) {
  if (account) {
    return <div />;
  }

  return (
    <List component="nav" aria-label="main" className={classes.list1}>
      <StyledExtensionListLink isShown={isShown} isMobile={isMobile} />
      <StyledAboutListLink />
    </List>
  );
});
