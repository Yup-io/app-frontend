import React, { memo, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import SnackbarContent from '@mui/material/SnackbarContent';
import numeral from 'numeral';
import axios from 'axios';
import { connect } from 'react-redux';
import { levelColors } from '../../utils/colors';
import Rating from '@mui/material/Rating';
import equal from 'fast-deep-equal';
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog';
import rollbar from '../../utils/rollbar';
import isEqual from 'lodash/isEqual';
import { accountInfoSelector, ethAuthSelector } from '../../redux/selectors';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { YupButton } from '../Miscellaneous';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
  faThumbsDown as faThumbsDownSolid,
  faThumbsUp as faThumbsUpSolid
} from '@fortawesome/free-solid-svg-icons';
import {
  useTransition,
  useSpring,
  useChain,
  easings,
  config,
  animated,
  useSpringRef
} from '@react-spring/web';
import { styled } from '@mui/material/styles';
import { useAuthModal } from '../../contexts/AuthModalContext';
import useAuth from '../../hooks/useAuth';

const styles = (theme) => ({
  greenArrow: {
    color: levelColors.second
  },
  redArrow: {
    color: levelColors.sixth
  },
  defaultArrow: {
    color: 'white',
    opacity: 0.6
  },
  catIcon: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    padding: '2px',
    [theme.breakpoints.down('md')]: {
      height: 25,
      width: 25,
      margin: 0
    }
  },
  postWeight: {
    userSelect: 'none',
    fontSize: '16px',
    [theme.breakpoints.down('md')]: {
      fontSize: '20px'
    }
  },
  snackbar: {
    position: 'absolute',
    backgroundColor: '#ff5252',
    textColor: '#f0f0f0',
    width: '8%'
  },
  snack: {
    backgroundColor: '#ff5252',
    color: '#fff8f3',
    fontWeight: 'light'
  },
  snackbarContent: {
    width: 150
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  },
  dialog: {
    width: '100%',
    marginLeft: 190,
    [theme.breakpoints.down('xl')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 190,
      width: `calc(100% - 190px)`
    },
    [theme.breakpoints.up('1600')]: {
      width: '100%',
      marginLeft: 0
    }
  },
  mobileBtn: {
    [theme.breakpoints.down('lg')]: {
      width: '1.2em'
    }
  }
});

const dislikeRatingConversion = {
  1: 2,
  2: 1
};

const likeRatingConversion = {
  1: 3,
  2: 4,
  3: 5
};

const StyledTooltip = memo(
  withStyles({
    popper: {
      marginTop: '-10px',
      marginLeft: '14px'
    }
  })((props) => (
    <Tooltip
      {...props}
      disableTouchListener
      classes={{
        popper: props.classes.popper
      }}
    />
  ))
);

StyledTooltip.propTypes = {
  classes: PropTypes.object.isRequired
};

const PostStats = ({
  classes,
  isShown,
  quantile,
  theme,
  totalVoters,
  weight
}) => {
  return (
    <Grid itemRef="">
      <Grid container spacing={0}>
        <Grid item>
          <Typography
            variant="body2"
            className={classes.weight}
            style={{
              color: !isShown ? levelColors[quantile] : theme.palette.M200
            }}
            placeholder={weight}
          >
            {
              Math.round(
                totalVoters ** (1 + 0.001 * weight)
              ) /* this is a temporary calculation to be expanded on */
            }
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

PostStats.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  totalVoters: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
  isShown: PropTypes.bool.isRequired
};

const postStatStyles = (theme) => ({
  weight: {
    marginRight: '3px',
    fontSize: '16px'
  },
  totalVoters: {
    fontSize: '16px',
    color: theme.palette.M300,
    opacity: 0.3,
    marginLeft: '7px'
  }
});

const StyledPostStats = withTheme(withStyles(postStatStyles)(PostStats));

// TODO: Convert to functional component
const VoteButton = ({
  classes,
  postInfo,
  isShown,
  type,
  totalVoters,
  handleOnclick,
  catWeight,
  rating,
  isVoted,
  setLastClicked
}) => {
  const account = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let interval;
    if (mouseDown && (!account || !account.name)) {
      openAuthModal({ noRedirect: true });
    } else {
      if (mouseDown) {
        setLastClicked();
        handleOnclick();
        interval = setInterval(() => {
          setLastClicked();
          handleOnclick();
        }, 500);
      }
    }
    return () => clearInterval(interval);
  }, [mouseDown]);

  const ratingToMultiplier = () => {
    if (type === 'dislike') {
      if (rating === 1) {
        return 2;
      }
      return 1;
    }
    return rating - 2 > 0 ? rating - 2 : 1;
  };

  const formatWeight = (weight) => {
    const _weight = Math.round(weight);
    if (weight < 1000) {
      return numeral(_weight).format('0a');
    } else if (weight < 10000) {
      return numeral(_weight).format('0.00a');
    } else {
      return numeral(_weight).format('0.0a');
    }
  };

  //This resets mousedown for whatever reason...
  const transition = useTransition(
    mouseDown && account && account.name ? [ratingToMultiplier()] : [],
    {
      config: { mass: 0.7, tension: 300, friction: 35, clamp: true },
      from: { top: 0, opacity: 0 },
      enter: { top: -15, opacity: 1 },
      leave: { top: -70, opacity: 0 },
      easings: easings.linear
    }
  );

  const AnimatedIcon = animated(FontAwesomeIcon);
  const { ...hover } = useSpring({
    config: { tension: 300, friction: 15, clamp: true },
    from: { width: '16px', height: '16px', transform: 'rotate(0deg)' },

    to: {
      width: isHovered && account && account.name ? '18px' : '16px',
      height: isHovered && account && account.name ? '18px' : '16px',
      transform:
        isHovered && account && account.name
          ? type === 'like'
            ? 'rotate(-15deg)'
            : 'rotate(15deg)'
          : 'rotate(0deg)'
    }
  });
  const { ...hardPress } = useSpring({
    config: { tension: 300, friction: 35 },
    loop: { reverse: mouseDown && account && account.name },
    from: { width: '16px', height: '16px' },

    to: {
      width: mouseDown && account && account.name ? '14px' : '16px',
      height: mouseDown && account && account.name ? '14px' : '16px'
    }
  });
  const formattedWeight = totalVoters === 0 ? 0 : formatWeight(catWeight);
  const icon =
    type === 'like'
      ? (isHovered || isClicked || isVoted) && account && account.name
        ? faThumbsUpSolid
        : faThumbsUp
      : (isHovered || isClicked || isVoted) && account && account.name
      ? faThumbsDownSolid
      : faThumbsDown;
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ position: 'relative' }}
    >
      {transition((style, item) => (
        <animated.div
          className={styles.item}
          style={{
            left: 15,
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style
          }}
        >
          <Grid item>
            <Typography variant="label">x{item}</Typography>
          </Grid>
        </animated.div>
      ))}
      <Grid item sx={{ zIndex: '1000', marginBottom: '4px' }}>
        <div
          style={{ width: '18px', cursor: 'pointer' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseDown={() => {
            setMouseDown(true);
          }}
          onMouseUp={() => {
            setMouseDown(false);
          }}
          onMouseLeave={() => {
            setMouseDown(false);
            setIsHovered(false);
          }}
        >
          {mouseDown || isClicked ? (
            <AnimatedIcon style={{ ...hardPress }} icon={icon} />
          ) : (
            <AnimatedIcon style={{ ...hover }} icon={icon} />
          )}
        </div>
      </Grid>
      <Grid xs={4} className={classes.postWeight} item>
        <StyledPostStats
          totalVoters={totalVoters}
          weight={Number(formattedWeight)}
          isShown={isShown}
        />
      </Grid>
    </Grid>
  );
};

VoteButton.propTypes = {
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  voterWeight: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  postInfo: PropTypes.object.isRequired,
  isShown: PropTypes.bool,
  isVoted: PropTypes.bool,
  totalVoters: PropTypes.number.isRequired,
  type: PropTypes.string,
  handleOnclick: PropTypes.func,
  setLastClicked: PropTypes.func
};

export default withStyles(styles)(VoteButton);
