import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Img from 'react-image'
import { Grid, Typography } from '@material-ui/core'
import LinesEllipsis from 'react-lines-ellipsis'
import { levelColors } from '../../utils/colors'
import Fade from '@material-ui/core/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { trimURL, getFavicon } from '../../utils/url'
import axios from 'axios'

const { DEFAULT_POST_IMAGE, BACKEND_API } = process.env

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
    overflowY: 'hidden',
    height: '8rem',
    [theme.breakpoints.down('xs')]: {
      height: '9rem'
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
    aspectRatio: '1 / 1',
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
      width: '4.5rem',
      height: '4.5rem'
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
    fontWeight: 500,
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    color: theme.palette.M100,
    opacity: 0.9,
    width: '400px',
    [theme.breakpoints.down('xs')]: {
      width: '60vw'
    }
  },
  description: {
    position: 'relative',
    fontSize: '0.7rem',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
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
    marginTop: 0,
    [theme.breakpoints.down('xs')]: {
      width: '30vw'
    }
  },
  previewData: {
    position: 'relative',
    textAlign: 'left',
    zIndex: 5,
    background: '',
    padding: '4% 6%'
  },
  favicon: {
    height: 30,
    width: 30,
    marginRight: '0rem',
    border: 'none',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      height: 18,
      width: 18
    }
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
      alt='fallback'
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
  async resetImgLink () {
    const { caption } = this.props
    const res = await axios.post(`${BACKEND_API}/posts/linkpreview/`, { url: caption })
    return res.data.previewData.img
  }

  render () {
    const { image, title, description, url, caption, classes, quantiles, rankCategory } = this.props
    let faviconURL = null
    if (url != null) {
      faviconURL = getFavicon(url)
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
                    <Grid item
                      xs={1}
                      sm={2}
                    >
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
                      xs={6}
                      sm={8}
                      style={{ margin: 'auto 0px' }}
                    >
                      <Typography variant='h5'>
                        <LinesEllipsis
                          basedOn='letters'
                          ellipsis='...'
                          maxLine='1'
                          text={title && title.split('|', 1)}
                          trimRight
                        />
                      </Typography>
                      <Typography variant='body2'>
                        <LinesEllipsis
                          basedOn='letters'
                          ellipsis='...'
                          maxLine='3'
                          text={description || caption}
                          trimRight
                          style={{ paddingTop: '5px' }}
                        />
                      </Typography>
                    </Grid>
                    <Grid item
                      xs={1}
                    >
                      <Img
                        align='right'
                        href={url}
                        src={faviconURL}
                        className={classes.favicon}
                        target='_blank'
                      />
                    </Grid>
                  </Grid>
                  <p className={classes.url}>{url && trimURL(url)}</p>
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
