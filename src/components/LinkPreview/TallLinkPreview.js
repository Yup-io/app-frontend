import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Img from 'react-image'
import Grid from '@material-ui/core/Grid'
import LinesEllipsis from 'react-lines-ellipsis'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const DEFAULT_POST_IMAGE = process.env.DEFAULT_POST_IMAGE

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
    overflowY: 'hidden',
    maxHeight: '22rem',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '20rem'
    },
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    '&:visited': {
      textDecoration: 'none',
      color: '#fff'
    }
  },
  linkImg: {
    width: '100%',
    minHeight: '15rem',
    maxHeight: '30rem',
    objectFit: 'cover',
    backgroundColor: '#4f4f4f',
    objectPosition: '50% 50%',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    position: 'relative',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '30rem',
      width: '70%'
    }
  },
  previewContainer: {
    textDecoration: 'none',
    color: '#fafafa',
    '&:visited': {
      textDecoration: 'none',
      color: '#fafafa'
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    fontSize: '18px',
    fontWeight: 600,
    textShadow: '0px 0px 5px rgba(20, 20, 20, 0.5)',
    [theme.breakpoints.down('xs')]: {
      width: '60vw',
      fontSize: '16px'
    }
  },
  description: {
    position: 'relative',
    fontSize: '14px',
    textShadow: '0px 0px 5px rgba(20, 20, 20, 0.3)',

    display: 'none',
    fontWeight: 500,
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  },
  url: {
    position: 'relative',
    fontSize: '10px',
    fontWeight: '100',
    overflowWrap: 'break-word',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: '0px'
  },
  previewData: {
    position: 'absolute',
    bottom: '0',
    textAlign: 'left',
    zIndex: 5,
    background: 'linear-gradient(rgba(26, 26, 26,0), rgba(40, 26, 26,0.2), rgba(26, 26, 26, 0.55), rgba(26, 26, 26, 0.75), rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.95), rgba(26, 26, 26,0.99), rgb(26, 26, 26))',
    padding: '0% 3%',
    width: '94.5%'
  }
})

class LinkPreview extends Component {
  cutUrl (inUrl) {
    const protocol = 'https://'
    const pro2 = 'http://'

    if (inUrl.startsWith(protocol)) {
      inUrl = inUrl.substring(protocol.length)
    } else if (inUrl.startsWith(pro2)) {
      inUrl = inUrl.substring(pro2.length)
    }

    const web = 'www.'

    if (inUrl.startsWith(web)) {
      inUrl = inUrl.substring(web.length)
    }

    if (inUrl.endsWith('/')) {
      inUrl = inUrl.substring(0, inUrl.length - 1)
    }

    return inUrl
  }

  trimURLEnd (link) {
    let count = 0
    for (let i = 0; i < link.length; i++) {
      if (link.charAt(i) === '/') {
        count++
        if (count === 3) {
          return link.substring(0, i + 1)
        }
      }
    }
  }

  trimURLStart (link) {
    let count = 0
    for (let i = 0; i < link.length; i++) {
      if (link.charAt(i) === '/') {
        count++
        if (count === 2) {
          link = link.substring(i + 1, link.length)
        }
      }
    }
    if (link.substring(0, 4) === 'www.') {
      link = link.substring(4, link.length)
    }
    return link
  }

  render () {
    const { image, title, description, url, classes, caption } = this.props
    let faviconURL
    let faviconURLFallback

    if (url != null) {
      faviconURL = 'https://api.faviconkit.com/' + this.trimURLStart(this.trimURLEnd(url)) + '64'
      faviconURLFallback = this.trimURLEnd(url) + 'favicon.ico'
    } else {
      faviconURL = null
      faviconURLFallback = null
    }

    return (
      <ErrorBoundary>
        <div className={classes.container}
          href={url}
          target='_blank'
        >
          <a className={classes.link}
            href={url}
            rel='noopener noreferrer'
            target='_blank'
          >
            <div className={classes.previewContainer}
              href={url}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Img alt={title}
                className={classes.linkImg}
                src={[image, DEFAULT_POST_IMAGE]}
                target='_blank'
                loader={<img src={DEFAULT_POST_IMAGE} />}
              />
              <div className={classes.previewData}>
                <Grid
                  alignItems='center'
                  container
                  direction='row'
                >
                  <Grid item>
                    <Img
                      align='right'
                      href={url}
                      src={[faviconURL, faviconURLFallback]}
                      style={{ height: 30, width: 30, marginRight: '0.5rem', border: 'none', borderRadius: '0.5rem' }}
                      target='_blank'
                    />
                  </Grid>
                  <Grid item>
                    <div className={classes.title}>
                      <LinesEllipsis
                        basedOn='letters'
                        ellipsis='...'
                        maxLine='2'
                        text={title}
                        trimRight
                      />
                    </div>
                  </Grid>
                </Grid>
                <div className={classes.description}>
                  <LinesEllipsis
                    basedOn='letters'
                    ellipsis='...'
                    maxLine='5'
                    text={description || caption}
                    trimRight
                  />
                </div>
                <p className={classes.url}>{url && this.cutUrl(url)}</p>
              </div>
            </div>
          </a>
        </div>
      </ErrorBoundary>
    )
  }
}

LinkPreview.propTypes = {
  image: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default (withStyles(styles)(LinkPreview))
