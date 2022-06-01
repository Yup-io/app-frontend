import React, { memo } from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '../UserAvatar/UserAvatar';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  avatarImage: {
    height: '35px',
    width: '35px',
    maxHeight: '35px',
    maxWidth: '35px',
    border: '2px solid',
    borderRadius: '100%',
    aspectRatio: '1 / 1',
    [theme.breakpoints.down('sm')]: {
      height: '30px',
      width: '30px'
    }
  }
});

const ProfileAvatar = memo(
  ({ username, avatar, classes, socialLevelColor }) => (
    <ErrorBoundary>
      <UserAvatar
        alt={username}
        username={username}
        src={avatar}
        className={classes.avatarImage}
        style={{
          border: `solid 2px ${socialLevelColor}`
        }}
      />
    </ErrorBoundary>
  )
);

ProfileAvatar.propTypes = {
  avatar: PropTypes.string,
  classes: PropTypes.object,
  username: PropTypes.string,
  socialLevelColor: PropTypes.string
};

export const StyledProfileAvatar = withStyles(styles)(ProfileAvatar);
