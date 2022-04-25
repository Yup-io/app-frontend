import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import SnackbarContent from '@mui/material/SnackbarContent'
import Snackbar from '@mui/material/Snackbar'
import { connect } from 'react-redux'
import { signalNotify } from '../../redux/actions'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import PolicyDialog from '../PrivacyPolicy/PolicyDialog'

const styles = theme => ({
  container: {
    display: 'none',
    background: 'transparent',
    marginTop: '10px',
    marginBottom: '-20px',
    width: '100%',
    height: '80px',
    position: 'absolute',
    bottom: 'auto',
    borderTop: `1.5px solid ${theme.palette.M900}`,
    zIndex: theme.zIndex.drawer + 5,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  root: {
    width: '100%',
    margin: '0px 0px 0px 0px'
  },
  text: {
    fontFamily: 'Gilroy',
    color: '#c0c0c0'
  },
  link: {
    textDecoration: 'none',
    color: '#c0c0c0'
  },
  Toolbar: {
    marginLeft: '0%',
    marginRight: '0%'
  },
  container1: {
    justifyContent: 'space-around',
    alignItems: 'center'
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
    paddingBottom: 14
  }
})

class Footer extends Component {
  render () {
    const { classes, notify } = this.props

    return (
      <ErrorBoundary>
        <div>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={4000}
            children={
              <a href='/tutorial'
                style={{ textDecoration: 'none' }}
              >
                <SnackbarContent
                  className={classes.snack}
                  message={<p>You're not logged in on Scatter. Please Download or Open Scatter</p>}
                /></a>}
            className={classes.snackUpper}
            onClose={this.props.notificationDone}
            open={notify}
          />
          <div className={classes.container}>
            <div className={classes.root}>
              <Toolbar>
                <Grid alignItems='center'
                  className={classes.container1}
                  container
                  direction='row'
                  justifyContent='space-between'
                >
                  <Grid item>
                    <Grid alignItems='center'
                      container
                      direction='row'
                    >
                      <Grid item>
                        <Typography className={classes.text}>
                          <a
                            className={classes.link}
                            href='mailto:admin@yup.io'
                          >
                            Contact Us
                          </a>
                        </Typography>
                      </Grid>
                      <Grid item >
                        <IconButton
                          className={classes.topbuttons}
                          component={Link}
                          style={{ 'maxWidth': '6vw', maxHeight: '6vw' }}
                          to='https://yup.io'
                          size='large'>
                          <img alt='add'
                            src='/images/icons/github.svg'
                            style={{ 'maxWidth': '4vw', width: '20px' }}
                          />
                        </IconButton>
                        <IconButton
                          className={classes.topbuttons}
                          component={Link}
                          style={{ 'maxWidth': '6vw', maxHeight: '6vw' }}
                          to='https://app.yup.io'
                          size='large'>
                          <img alt='compass'
                            src='/images/icons/reddit.svg'
                            style={{ 'maxWidth': '4vw', width: '20px' }}
                          />
                        </IconButton>
                        <IconButton
                          className={classes.topbuttons}
                          component={Link}
                          style={{ 'maxWidth': '6vw', maxHeight: '6vw' }}
                          to='https://app.yup.io'
                          size='large'>
                          <img alt='compass'
                            src='/images/icons/twitter.svg'
                            style={{ 'maxWidth': '4vw', width: '20px' }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.text}>
                      <a className={classes.link}
                        href='https://app.yup.io'
                      >
                        Yup.io, 2019
                      </a>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <PolicyDialog />
                  </Grid>
                </Grid>
              </Toolbar>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  notify: PropTypes.bool.isRequired,
  notificationDone: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    notify: state.scatterInstallation.notify
  }
}

const mapDispatchToProps = dispatch => {
  return {
    notificationDone: () => dispatch(signalNotify(false))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Footer))
