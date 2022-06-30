import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import UserAvatar from '../UserAvatar/UserAvatar';
import withStyles from '@mui/styles/withStyles';
import { levelColors } from '../../utils/colors';
import { connect } from 'react-redux';
import Grid from '@mui/material/Grid';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Fade from '@mui/material/Fade';

const styles = (theme) => ({
  article: {
    borderRadius: '0.5rem',
    border: '0px solid #ffffff',
    boxShadow: `0px 0px 1px ${theme.palette.M300}`,
    backgroundColor: theme.palette.M300,
    textAlign: 'right',
    alignContent: 'center',
    display: 'contents',
    maxWidth: '600px',
    marginLeft: '0%',
    marginRight: '0%',
    width: '100%',
    height: '50px',
    padding: '3rem, 0px'
  },
  user: {
    display: 'flex',
    padding: '3%',
    alignItems: 'center'
  },
  avatar: {
    width: '16px',
    height: '16px',
    maxHeight: '16px',
    maxWidth: '16px'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '0.9rem',
    fontSize: '12px'
  },
  text: {
    fontFamily: 'Gilroy',
    fontSize: '16px',
    color: '#ffffff',
    [theme.breakpoints.down(undefined)]: {
      fontSize: '10px'
    }
  }
});

class SearchResult extends Component {
  render() {
    const { classes, avatar, level, username } = this.props;
    let socialLevelColor = null;
    if (level.levelInfo && level.levelInfo.quantile) {
      const { quantile } = level.levelInfo;
      socialLevelColor = levelColors[quantile];
    }

    return (
      <Fade in timeout={1000}>
        <ErrorBoundary>
          <article className={classes.article}>
            <header>
              <Grid alignItems="center" container>
                <Grid item>
                  <div className={classes.avatar}>
                    <UserAvatar
                      alt={username}
                      username={username}
                      className={classes.avatarImage}
                      style={{
                        borderRadius: '100%',
                        width: '20px',
                        marginRight: '7px',
                        height: '20px'
                      }}
                      src={avatar}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  style={{
                    paddingLeft: '0.5rem',
                    marginBottom: '0.5px'
                  }}
                >
                  <Typography
                    className={classes.text}
                    fontWeight="bold"
                    style={{
                      textDecoration: socialLevelColor ? 'underline' : 'none',
                      textDecorationColor: socialLevelColor,
                      textDecorationStyle: socialLevelColor ? 'solid' : 'none'
                    }}
                    variant="url"
                  >
                    {username}
                  </Typography>
                </Grid>
              </Grid>
            </header>
          </article>
        </ErrorBoundary>
      </Fade>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { eosname } = ownProps;

  return {
    level: state.socialLevels.levels[eosname] || {
      isLoading: true,
      error: false,
      levelInfo: {}
    }
  };
};

SearchResult.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  level: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(SearchResult));
