import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Img from 'react-image'
import Grid from '@material-ui/core/Grid'
import LinesEllipsis from 'react-lines-ellipsis'
import { levelColors } from '../../utils/colors'
import Fade from '@material-ui/core/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

import axios from 'axios'

const DEFAULT_POST_IMAGE = process.env.DEFAULT_POST_IMAGE
const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
    overflowY: 'hidden',
    height: '7.5rem',
    [theme.breakpoints.down('xs')]: {
      height: '7rem'
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
    width: '5rem',
    height: '5rem',
    objectFit: 'cover',
    backgroundColor: '#4f4f4f',
    alignItems: 'center',
    borderRadius: '200px',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%',
      maxWidth: '6rem'
    },
    [theme.breakpoints.down('xs')]: {
      width: '3.5rem',
      height: '3.5rem'
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
    fontSize: '22px',
    fontWeight: 500,
    textShadow: '0px 0px 5px rgba(20, 20, 20, 0.5)',
    width: '400px',
    [theme.breakpoints.down('xs')]: {
      width: '60vw',
      fontSize: '18px'
    }
  },
  description: {
    position: 'relative',
    fontSize: '14px',
    textShadow: '0px 0px 5px rgba(20, 20, 20, 0.3)',

    fontWeight: 200,
    maxWidth: '400px',
    [theme.breakpoints.down('xs')]: {
      width: '60vw'
    }
  },
  url: {
    position: 'relative',
    fontSize: '10px',
    fontWeight: '100',
    overflowWrap: 'break-word',
    display: 'none',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: '0px',
    [theme.breakpoints.down('xs')]: {
      width: '30vw'
    }
  },
  previewData: {
    position: 'absolute',
    bottom: '0',
    textAlign: 'left',
    zIndex: 5,
    background: '',
    padding: '0% 2% 0% 2%',
    width: '95%'
  }
})

class FallbackImage extends Component {
  state = { imgLink: '' }
  componentDidMount () {
    (async () => {
      const imgL = await this.resetImgLink()
      this.setState({ imgLink: imgL })
    })()
  }

  async resetImgLink () {
    const { caption } = this.props
    const res = await axios.post(`${BACKEND_API}/posts/linkpreview/`, { url: caption })
    return res.data.previewData.img
  }

  render () {
    const { classes, imageStyle } = this.props
    return <img className={classes.linkImg}
      style={imageStyle}
      src={this.state.imgLink || DEFAULT_POST_IMAGE}
           />
  }
}

FallbackImage.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  imageStyle: PropTypes.object.isRequired
}

const StyledFallbackImage = withStyles(styles)(FallbackImage)

class ObjectPreview extends Component {
  cutUrl (inUrl) {
    if (inUrl == null) { return '' }
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

  async resetImgLink () {
    const { caption } = this.props
    const res = await axios.post(`${BACKEND_API}/posts/linkpreview/`, { url: caption })
    return res.data.previewData.img
  }

  render () {
    const { image, title, description, url, caption, classes, quantiles, rankCategory } = this.props
    let faviconURL
    let faviconURLFallback
    if (url != null) {
      faviconURL = 'https://api.faviconkit.com/' + this.trimURLStart(this.trimURLEnd(url)) + '64'
      faviconURLFallback = this.trimURLEnd(url) + 'favicon.ico'
    } else {
      faviconURL = null
      faviconURLFallback = null
    }
    // TODO: Adjust this for Yup lists, should only get quantile for category and website being compared
    const overallQuantile = rankCategory ? quantiles[rankCategory] : quantiles.overall
    const levelColor = overallQuantile ? levelColors[overallQuantile] : null

    const imageStyle = { border: levelColor
      ? `3px solid ${levelColor}`
       : 'none' }

    return (
      <ErrorBoundary>
        <Fade in
          timeout={2000}
        >
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
                <div className={classes.previewData}>
                  <Grid
                    alignItems='flex-start'
                    container
                    direction='row'
                    justify='space-between'
                  >
                    <Grid item>
                      <Img alt={title}
                        className={classes.linkImg}
                        src={[image]}
                        unloader={<StyledFallbackImage className={classes.linkImg}
                          caption={caption}
                          imageStyle={imageStyle}
                                  />
                      }
                        target='_blank'
                        style={imageStyle}
                      />
                    </Grid>
                    <Grid item
                      style={{ margin: 'auto 0px' }}
                    >
                      <div className={classes.title}>
                        <LinesEllipsis
                          basedOn='letters'
                          ellipsis='...'
                          maxLine='1'
                          text={title}
                          trimRight
                        />
                      </div>
                      <div className={classes.description}>
                        <LinesEllipsis
                          basedOn='letters'
                          ellipsis='...'
                          maxLine='3'
                          text={description || caption}
                          trimRight
                        />
                      </div>
                    </Grid>
                    <Grid item>
                      <Img
                        align='right'
                        href={url}
                        src={[faviconURL, faviconURLFallback]}
                        style={{ height: 30, width: 30, marginRight: '0rem', border: 'none', borderRadius: '0.5rem' }}
                        target='_blank'
                      />
                    </Grid>
                  </Grid>
                  <p className={classes.url}>{url && this.cutUrl(url)}</p>
                </div>
              </div>
            </a>
          </div>
        </Fade>
      </ErrorBoundary>
    )
  }
}

ObjectPreview.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  quantiles: PropTypes.object.isRequired,
  rankCategory: PropTypes.string
}

export default (withStyles(styles)(ObjectPreview))
