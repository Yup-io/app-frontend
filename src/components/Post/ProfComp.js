import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import CourseLoader from '../FeedLoader/CourseLoader';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import axios from 'axios';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { apiBaseUrl, vergilSearchUrl } from '../../config';
import { TruncateText } from '../styles';

const styles = (theme) => ({
  container: {
    width: '100%',
    position: 'relative',
    overflowY: 'hidden',
    height: '7rem'
  },
  title: {
    position: 'relative',
    fontSize: '22px',
    fontWeight: 600,
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    width: '500px',
    [theme.breakpoints.down('sm')]: {
      width: '70vw',
      fontSize: '18px'
    }
  },
  previewContainer: {
    textDecoration: 'none',
    color: '#fafafa',
    '&:visited': {
      textDecoration: 'none',
      color: '#fafafa'
    },
    maxHeight: '800px'
  },
  description: {
    position: 'relative',
    fontSize: '18px',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    fontWeight: 100,
    wordWrap: 'break-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    }
  },
  subject: {
    fontSize: '16px',
    bottom: 0,
    marginTop: 0,
    fontWeight: 50,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  },
  icon: {
    width: 20,
    height: 20,
    backgroundColor: 'primary',
    [theme.breakpoints.down('sm')]: {
      height: 25,
      width: 25,
      margin: 0
    },
    filter: 'brightness(0) invert(1)'
  },
  crownIcon: {
    width: '20px',
    height: '20px',
    marginLeft: 0,
    backgroundColor: 'primary',
    [theme.breakpoints.down('sm')]: {
      height: 25,
      width: 25,
      margin: 0
    }
  },
  previewData: {
    position: 'absolute',
    top: 0,
    textAlign: 'left',
    zIndex: 5,
    padding: '0% 3%',
    width: '94%'
  }
});

const ICON_ROOT_PATH = '/images/icons';

class ProfComp extends Component {
  state = {
    subject: '',
    isLoading: true
  };
  componentDidMount() {
    this.fetchProfInfo();
  }

  async fetchProfInfo() {
    try {
      const { caption } = this.props;
      const courseInfo = (
        await axios.get(`${apiBaseUrl}/courses/professor?professor=${caption}`)
      ).data;
      const subject = courseInfo.subject.long_name;
      this.setState({ subject, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { classes, caption } = this.props;
    const { subject, isLoading } = this.state;
    if (isLoading) {
      return <CourseLoader />;
    }

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <div className={classes.previewContainer}>
            <div className={classes.previewData}>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <img
                    className={classes.icon}
                    style={{ marginRight: '10px' }}
                    src={`${ICON_ROOT_PATH}/knowledgeable.svg`}
                    alt="knowledgeable"
                  />
                </Grid>
                <Grid item>
                  <Link href={`${vergilSearchUrl}/${caption}`}>
                    <div className={classes.title}>
                      <TruncateText lines={2}>{caption}</TruncateText>
                    </div>
                  </Link>
                </Grid>
                <Grid item>
                  <img
                    className={classes.crownIcon}
                    src={`${ICON_ROOT_PATH}/crown.png`}
                    alt="crown"
                  />
                </Grid>
              </Grid>
              <p className={classes.subject}> {subject.toUpperCase()} </p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

ProfComp.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfComp);
