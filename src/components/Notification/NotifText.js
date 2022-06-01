import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Dotdotdot from 'react-clamp';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { reactionIcons } from '../../config';

const styles = (theme) => ({
  text: {
    display: 'inline-block',
    color: theme.palette.M100,
    margin: 0
  },
  icon: {
    height: '15px',
    width: '15px',
    position: 'relative',
    filter: 'brightness(0) invert(1)',
    top: '3px'
  },
  arrow: {
    fontSize: '15px',
    position: 'relative',
    top: '3px'
  },
  dotdotdot: {
    whiteSpace: 'normal',
    color: theme.palette.M100,
    width: '100%',
    lineHeight: '20px'
  }
});

const ICONS = reactionIcons;
const CATEGORY_ICONS = {
  popularity: ICONS[0],
  intelligence: ICONS[1],
  funny: ICONS[2],
  useful: ICONS[3],
  knowledgeable: ICONS[4],
  interesting: ICONS[5],
  expensive: ICONS[6],
  engaging: ICONS[7],
  easy: ICONS[8],
  chill: ICONS[9],
  beautiful: ICONS[10],
  affordable: ICONS[11],
  trustworthy: ICONS[12],
  wouldelect: ICONS[13],
  agreewith: ICONS[14],
  original: ICONS[15],
  fire: ICONS[16]
};

function NotifText(props) {
  const { notif, invokerWeight, underlineColor, invoker, classes } = props;
  if (!notif) {
    return null;
  }

  const notifVotes = notif.votes ? notif.votes.slice(0, 3) : [];

  if (notif.action === 'vote' && notifVotes.length !== 0) {
    const renderedVotes = [];

    for (let i = 0; i < notifVotes.length; i++) {
      renderedVotes.push(
        notifVotes[i].like ? (
          <KeyboardArrowUp className={classes.arrow} />
        ) : (
          <KeyboardArrowDown className={classes.arrow} />
        )
      );
      renderedVotes.push(
        <span> {CATEGORY_ICONS[notifVotes[i].category]}</span>
      );
    }

    return (
      <ErrorBoundary>
        <Dotdotdot clamp={3} className={classes.dotdotdot}>
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; voted
          {renderedVotes}
          &nbsp; on &nbsp;
          <em>
            {notif.post && notif.post.previewData
              ? notif.post.previewData.title
              : (notif.post && notif.post.caption) || 'Post data null'}
          </em>
        </Dotdotdot>
      </ErrorBoundary>
    );
  } else if (notif.action === 'vote') {
    return (
      <ErrorBoundary>
        <Dotdotdot clamp={3} className={classes.dotdotdot}>
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; voted
          {notif.like ? (
            <KeyboardArrowUp className={classes.arrow} />
          ) : (
            <KeyboardArrowDown className={classes.arrow} />
          )}
          <img
            className={classes.icon}
            src={`images/icons/${CATEGORY_ICONS[notif.category]}`}
            alt={notif.category}
          />
          &nbsp; on &nbsp;
          <em>
            {notif.post && notif.post.previewData
              ? notif.post.previewData.title
              : (notif.post && notif.post.caption) || 'Post data null'}
          </em>
        </Dotdotdot>
      </ErrorBoundary>
    );
  } else if (notif.action === 'comment') {
    return (
      <ErrorBoundary>
        <Dotdotdot clamp={3} className={classes.dotdotdot}>
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; commented on &nbsp;
          <i>
            {notif.post && notif.post.previewData
              ? notif.post.previewData.title
              : notif.post.caption}
          </i>
        </Dotdotdot>
      </ErrorBoundary>
    );
  } else if (notif.action === 'circle') {
    return (
      <ErrorBoundary>
        <Dotdotdot
          clamp={2}
          className={classes.dotdotdot}
          style={{ color: 'white' }}
        >
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; followed you.
        </Dotdotdot>
      </ErrorBoundary>
    );
  } else if (notif.action === 'update') {
    return (
      <ErrorBoundary>
        <Dotdotdot
          clamp={2}
          className={classes.dotdotdot}
          style={{ color: 'white' }}
        >
          <p className={classes.text}>{notif.message}</p>
        </Dotdotdot>
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        <Dotdotdot clamp={2} className={classes.dotdotdot}>
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; were rewarded {notif.quantity.toFixed(4)} YUP.
        </Dotdotdot>
      </ErrorBoundary>
    );
  }
}

NotifText.propTypes = {
  classes: PropTypes.object.isRequired,
  notif: PropTypes.object.isRequired,
  invokerWeight: PropTypes.object.isRequired,
  underlineColor: PropTypes.object.isRequired,
  invoker: PropTypes.object.isRequired
};

export default withStyles(styles)(NotifText);
