import React, { Component, memo, useState, useRef } from 'react';
import { isEmpty } from 'lodash';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import SnackbarContent from '@mui/material/SnackbarContent';
import polly from 'polly-js';
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
import AuthModal from '../../features/AuthModal';
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

const { BACKEND_API } = process.env;
const CREATE_VOTE_LIMIT = 20;

const CAT_DESC = {
  easy: 'Easy: can do well without extra effort; generous grading, minimal time',
  interesting: 'Interesting: compelling subject matter, makes you think',
  useful: 'Useful: has important knowledge for your field/career',
  knowledgeable:
    "Knowledgeable: knows what they're talking about, expert in subject",
  engaging:
    'Engaging: captures your attention, makes concepts easy to understand',
  chill: 'Chill: cool, laidback, a vibe',
  popularity: 'like',
  intelligence: 'smart',
  trustworthy: 'most trustworthy',
  wouldelect: 'most electable',
  agreewith: 'most agreed with',
  fire: 'Fire: really good, amazing'
};

const DEFAULT_WAIT_AND_RETRY = [
  250, 250, 250, 250, 250, 300, 350, 400, 400, 500, 500, 500, 500, 500, 500,
  500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500,
  500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500,
  500, 500, 500, 500, 500, 500, 500, 500, 500, 500
];

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

const ratingStyles = ({ palette }) => ({
  iconFilled: {
    border: '3px',
    borderColor: palette.M100,
    color: palette.M900
  },
  iconHover: {
    stroke: palette.M100
  },
  iconEmpty: {
    color: palette.M900
  }
});
const StyledRating = withStyles(ratingStyles)(Rating);

const dislikeRatingConversion = {
  1: 2,
  2: 1
};

const likeRatingConversion = {
  1: 3,
  2: 4,
  3: 5
};

const convertRating = (like, rating) =>
  like ? likeRatingConversion[rating] : dislikeRatingConversion[rating];

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
  isShown: PropTypes.bool.isRequired,
  quantile: PropTypes.string.isRequired
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
  category,
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
  const { post } = postInfo;
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const ratingToMultiplier = () => {
    if (type === 'down') {
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
    mouseDown || isClicked ? [ratingToMultiplier()] : [],
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
      width: isHovered && !isVoted ? '18px' : '16px',
      height: isHovered && !isVoted ? '18px' : '16px',
      transform:
        isHovered && !isVoted
          ? type === 'up'
            ? 'rotate(-15deg)'
            : 'rotate(15deg)'
          : 'rotate(0deg)'
    }
  });
  const { ...hardPress } = useSpring({
    config: { tension: 300, friction: 35 },
    loop: { reverse: mouseDown },
    from: { width: '16px', height: '16px' },

    to: {
      width: mouseDown  ? '14px' : '16px',
      height: mouseDown  ? '14px' : '16px'
    },
    onRest: () =>{
      setIsClicked(false) 
    },
    onStart: () => {
      setLastClicked();
      handleOnclick()    
    }
  });
  const formattedWeight = totalVoters === 0 ? 0 : formatWeight(catWeight);

  const icon =
    type === 'up'
      ? isHovered || isClicked || isVoted
        ? faThumbsUpSolid
        : faThumbsUp
      : isHovered || isClicked || isVoted
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
          <Typography variant="body2">x</Typography>
          <Typography variant="label">{item}</Typography>
        </animated.div>
      ))}
      <Grid
        item
        sx={{ zIndex: '1000' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{ width: '18px', cursor: 'pointer' }}
          onMouseDown={() => {
            setMouseDown(true);
            setIsClicked(true);
          }}
          onMouseUp={() => {
            setMouseDown(false);
          }}
          onMouseLeave={() => {
            setMouseDown(false);
          }}
        >
          {mouseDown || isClicked ? (
            <AnimatedIcon style={{ ...hardPress }} icon={icon} />
          ) : (
            <AnimatedIcon style={{ ...hover }} icon={icon} />
          )}
        </div>

        {/*
      <Grid
        alignItems='center'
        container
        direction='row'
        justifyContent='flex-start'
        wrap='nowrap'
        spacing={1}
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
            <Typography variant="body2">x</Typography>
            <Typography variant="label">{item}</Typography>
          </animated.div>
        ))}
        <Grid
          item
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            style={{ width: '18px', cursor: 'pointer' }}
            onMouseDown={() => {
              setIsClicked(true);
              setMouseDown(true);
            }}
            onMouseUp={() => {
              setMouseDown(false);        
            }}
            onMouseLeave={() => {
              setMouseDown(false);
            }}
          >
              <AnimatedIcon style={(mouseDown || isClicked )?{ ...hardPress }:{ ...hover }} icon={icon} />
          
          </div>

          {/*         
        <Grid
          alignItems='center'
          container
          direction='row'
          justifyContent='flex-start'
          wrap='nowrap'
          spacing={1}
        >
           <Grid item
            style={{ zIndex: 100, display: 'none' }}
          >
            <Tooltip title={CAT_DESC[category] || category}>
              <Grid
                alignItems='center'
                container
                direction='column'
                justifyContent='space-around'
              >
                <Grid item
                  style={{ height: '1em' }}>
                  <StyledCatIcon
                    type={type}
                    category={category}
                    handleDefaultVote={this.handleDefaultVote}
                    voteLoading={voteLoading}
                    quantile={currPostCatQuantile}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Tooltip>
        </Grid>
        <Grid
          className={classes.postWeight}
          item
        >
          <StyledPostStats
            totalVoters={totalVoters}
            weight={formattedWeight}
            isShown={isShown}
          />
          <Grid item
            style={{ display: 'none' }}>
            {!isShown && (
              <Grow in
                timeout={300}
              >
                <StyledRating
                  emptyIcon={null}
                  name='customized-color'
                  max={5}
                  precision={1}
                  onChangeActive={this.onChangeActive}
                  IconContainerComponent={(props) => (
                    <IconContainer
                      {...props}
                      quantile={currPostCatQuantile}
                      ratingAvg={ratingAvg}
                      handleRatingChange={this.handleRatingChange}
                      hoverValue={hoverValue}
                      vote={this.props.vote}
                      currRating={
                        this.state.currRating || this.props.currRating
                      }
                    />
                  )}
                  icon={
                    window.matchMedia('(max-width: 520px)') ? (
                      <SvgIcon className={classes.mobileBtn}>
                        <circle cy='12'
                          cx='12'
                          r='4'
                          strokeWidth='1'
                        />{' '}
                      </SvgIcon>
                    ) : (
                      <SvgIcon>
                        <circle cy='12'
                          cx='12'
                          r='5'
                          strokeWidth='2'
                        />{' '}
                      </SvgIcon>
                    )
                  }
                />
              </Grow>
            )}
          </Grid>
        </Grid>
      </Grid> */}
      </Grid>
      <Grid xs={4} className={classes.postWeight} item>
        <StyledPostStats
          totalVoters={totalVoters}
          weight={formattedWeight}
          isShown={isShown}
        />
      </Grid>
    </Grid>
    //  <Portal>
    //   <Snackbar
    //     anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    //     autoHideDuration={4000}
    //     className={classes.snackUpper}
    //     onClose={this.handleSnackbarClose}
    //     open={this.state.snackbarOpen}
    //   >
    //     <SnackbarContent
    //       className={classes.snack}
    //       message={this.state.snackbarContent}
    //     />
    //   </Snackbar>
    // </Portal>
    //  TODO: Use `useAuthModal` after converting to functional component.
    // {twitterInfo ? (
    //   <WelcomeDialog
    //     dialogOpen={this.state.dialogOpen}
    //     handleDialogClose={this.handleDialogClose}
    //   />
    // ) : (
    //   <AuthModal
    //     onClose={this.handleDialogClose}
    //     open={this.state.dialogOpen}
    //   />
    // )}
  );
};

const mapStateToProps = (state, ownProps) => {
  let initialVote = null;
  let currRating = 0;
  const { category, postid } = ownProps;
  const account = accountInfoSelector(state);
  const ethAuth = ethAuthSelector(state);

  let userVotesForPost = {};

  if (account) {
    const userVotes = state.initialVotes[account.name];
    userVotesForPost = userVotes && userVotes[postid];
    if (state.userPermissions && state.userPermissions[account.name]) {
      account.authority = state.userPermissions[account.name].perm;
    }
    if (userVotesForPost) {
      initialVote = userVotesForPost.votes[category];
      if (initialVote) {
        currRating = convertRating(initialVote.like, initialVote.rating);
      }
    }
  }

  const postInfo = ownProps.postInfo
    ? ownProps.postInfo
    : state.postInfo[postid];

  return {
    postInfo,
    account,
    currRating,
    ethAuth,
    vote: initialVote,
    votesForPost: userVotesForPost || {}
  };
};

VoteButton.propTypes = {
  account: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  catWeight: PropTypes.number.isRequired,
  currRating: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  voterWeight: PropTypes.number.isRequired,
  rating: PropTypes.object.isRequired,
  initialVote: PropTypes.object.isRequired,
  quantile: PropTypes.string.isRequired,
  vote: PropTypes.object.isRequired,
  listType: PropTypes.string,
  votesForPost: PropTypes.object.isRequired,
  postInfo: PropTypes.object.isRequired,
  ethAuth: PropTypes.object,
  isShown: PropTypes.bool,
  isVoted: PropTypes.bool,
  totalVoters: PropTypes.number.isRequired,
  type: PropTypes.string,
  handleOnclick: PropTypes.func,
  setLastClicked: PropTypes.func
};

export default connect(mapStateToProps)(withStyles(styles)(VoteButton));
