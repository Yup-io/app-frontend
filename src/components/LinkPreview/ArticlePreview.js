import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Img from 'react-image'
import { Grid, Typography } from '@material-ui/core'
import LinesEllipsis from 'react-lines-ellipsis'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { trimURL, getFavicon } from '../../utils/url'

const DEFAULT_POST_IMAGE = process.env.DEFAULT_POST_IMAGE

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    }
  },
  linkImg: {
    width: '100%',
    aspectRatio: '1 / 1',
    border: 'none',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      maxHeight: 30,
      maxWidth: 30
    }
  },
  previewContainer: {
    textDecoration: 'none',
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    fontSize: '1rem',
    fontWeight: 600,
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    color: theme.palette.M100,
    opacity: 0.9
  },
  description: {
    position: 'relative',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    lineHeight: '1.25rem',
    margin: '0.5rem 0'
  },
  url: {
    position: 'relative',
    fontSize: '10px',
    fontWeight: 300,
    overflowWrap: 'break-word',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: 0,
    opacity: '0.5'
  },
  previewData: {
    bottom: '0',
    textAlign: 'left',
    zIndex: 5,
    background:
      `linear-gradient(${theme.palette.M800}00, ${theme.palette.M800}46, ${theme.palette.M800}ae, ${theme.palette.M800}dd, ${theme.palette.M800}ed, ${theme.palette.M800}fe, ${theme.palette.M800}, ${theme.palette.M800})`,
    padding: '4% 3% 2% 3%',
    width: '100%',
    backdropFilter: 'blur(2px)'
  }
})

class ArticlePreview extends Component {
  addDefaultSrc = e => {
    e.target.onerror = null
    e.target.src = DEFAULT_POST_IMAGE
  }

  render () {
    const { title, description, url, classes, caption } = this.props
    let faviconURL = null

    if (url != null) {
      faviconURL = getFavicon(url)
    }

    return (
      <ErrorBoundary>
        <div className={classes.container}
          href={url}
          target='_blank'
        >
          <a
            className={classes.link}
            href={url}
            rel='noopener noreferrer'
            target='_blank'
          >
            <div className={classes.previewData}>
              <Grid alignItems='center'
                container
                direction='row'
                spacing={2}
              >
                <Grid item
                  xs={2}
                  sm={1}
                >
                  <Img
                    align='right'
                    href={url}
                    src={faviconURL}
                    className={classes.linkImg}
                    target='_blank'
                  />
                </Grid>
                <Grid item
                  xs={10}
                  sm={11}
                >
                  <Typography variant='h6'>
                    <LinesEllipsis
                      basedOn='letters'
                      ellipsis='...'
                      maxLine='2'
                      text={title.split(/[|]|[—]+/g, 1)}
                      trimRight
                    />
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant='body2'
                className={classes.description}
              >
                <LinesEllipsis
                  basedOn='letters'
                  ellipsis='...'
                  maxLine='6'
                  text={description || caption}
                  trimRight
                />
              </Typography>
              <Typography variant='body2'
                className={classes.url}
              >{url && trimURL(url).split(/[/]+/g, 1)}</Typography>
            </div>
          </a>
        </div>
      </ErrorBoundary>
    )
  }
}

ArticlePreview.propTypes = {
  caption: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ArticlePreview)
