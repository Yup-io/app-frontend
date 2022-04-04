import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Fade from '@material-ui/core/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Typography from '@material-ui/core/Typography'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import ReactPlayer from 'react-player'
import axios from 'axios'
import { ConditionalLinkWrapper } from '../Miscellaneous'
import { getFavicon } from '../../utils/url'

const nftPattern = new RegExp('^(app.rarible.com|www.app.rarible.com|http://app.rarible.com|https://app.rarible.com|http://www.app.rarible.com|https://www.app.rarible.com|rarible.com/token/|www.rarible.com/token/|http://rarible.com/token/|https://rarible.com/*/|opensea.io/assets/|www.opensea.io/assets/|http://opensea.io/assets/|https://opensea.io/assets/|superrare.co/|www.superrare.co/|http://superrare.co/|https://superrare.co/|foundation.app/*/|www.foundation.app/*/|http://foundation.app/*/|https://foundation.app/*/|zora.co/|www.zora.co/|http://zora.co/|https://zora.co/)')
const collectionPattern = new RegExp('^(app.yup.io/collections/|www.app.yup.io/collections/|http://app.yup.io/collections/|https://app.yup.io/collections/)')
const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(Math.random() * 5) + 1}.png`

const { AUDIUS_EMBED, BACKEND_API } = process.env
const isMobile = window.innerWidth <= 600

const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      margin: '2px 0px'
    }
  },
  image: {
    width: '60px',
    maxWidth: '100%',
    height: 'auto',
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    objectFit: 'cover',
    [theme.breakpoints.down('md')]: {
      width: '50px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '35px'
    }
  },
  nftArt: {
    maxWidth: '60px',
    maxHeight: '60px',
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '20%',
    objectFit: 'cover',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      maxHeight: '35px',
      maxWidth: '35px'

    }
  },
  caption: {
    textAlign: 'left',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  rank: {
    fontSize: '18px',
    [theme.breakpoints.down('md')]: {
      padding: ' 0px 10px 0px 5px',
      fontSize: '16px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  audiusPost: {
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0
    }
  }
})

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

class ListPreview extends Component {
  state = {
    faviconURL: DEFAULT_IMG,
    faviconURLFallback: DEFAULT_IMG,
    postBroken: false,
    collectionImg: DEFAULT_IMG
  }

  componentDidMount () {
    const { previewData } = this.props
    if (previewData && previewData.url !== null) {
      let url = getFavicon(previewData.url)
      this.setState({
        faviconURL: url
      })
    }
  }

  addDefaultVid = (e) => {
    e.target.onerror = null
    this.setState({
      postBroken: true
    })
  }

  addDefaultSrc = (e) => {
    e.target.onerror = null
    e.target.src = this.state.faviconURL || this.state.faviconURLFallback
    e.target.style = {
      border: 'none !important',
      maxWidth: '50px',
      maxHeight: '50px'
    }
  }

  addCollectionImg = async (url) => {
    const collection = url.split('/')
    const name = collection[4]
    const id = collection[5]

    const res = (await axios.get(`${BACKEND_API}/collections/${name}/${id}`)).data
    const collectionImg = res.posts[0] && res.posts[0].previewData && res.posts[0].previewData.img
    const collectionImgFallback = res.posts[1] && res.posts[1].previewData && res.posts[1].previewData.img

    this.setState({
      collectionImg: collectionImg || collectionImgFallback
    })
  }

  render () {
    const { previewData, url, image, title, classes, rank } = this.props
    const { faviconURL, faviconURLFallback, postBroken, collectionImg } = this.state

    const AudiusComp = () => (
      <div className={classes.audiusPost}>
        <iframe src={`${AUDIUS_EMBED}?id=${previewData.trackId}&ownerId=${previewData.ownerId}&flavor=compact`}
          allow='encrypted-media'
          width='100%'
          height='120'
          style={{ border: 'none' }}
        />
      </div>
    )

    // TODO: Adjust this for Yup lists, should only get quantile for category and website being compared
    const isNftArt = url && url.match(nftPattern)
    const isCollection = url && url.match(collectionPattern)
    if (isCollection && collectionImg === DEFAULT_IMG) {
      this.addCollectionImg(url)
    }
    const isAudiusPost = previewData && (previewData.trackId && previewData.ownerId)

    return (
      <ErrorBoundary>
        <Fade in
          timeout={1000}
        >
          <Grid
            container
            direction='row'
            justify='flex-start'
            alignItems='center'
            className={classes.container}
            spacing={isMobile ? 2 : 3}
          >
            <Grid item
              xs={1}
            >
              <Typography
                variant='h5'
                className={classes.rank}
              >
                {rank}
              </Typography>
            </Grid>
            {isAudiusPost &&
            <Grid item
              sm={11}
            >
              <AudiusComp />
            </Grid>
              }
            {previewData && (previewData.url) && !isAudiusPost &&
            <>
              <Grid item
                xs={2}
              >
                {(image && image.includes('nft.mp4'))
                    ? <ReactPlayer
                      className={classes.nftArt}
                      target='_blank'
                      url={image}
                      playing
                      muted
                      loop
                      playsinline
                      light={postBroken ? (faviconURL || faviconURLFallback) : ''}
                      onError={this.addDefaultVid}
                      />
                    : <img src={isCollection ? (collectionImg || DEFAULT_IMG) : (image || faviconURL || faviconURLFallback)}
                      className={(isNftArt || isCollection) ? classes.nftArt : classes.image}
                      onError={this.addDefaultSrc}
                      alt='favicon'
                      />
                  }
              </Grid>
              <Grid item
                xs={9}
                sm={9}
              >
                <ConditionalLinkWrapper
                  href={previewData.url}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography variant='h5'
                    className={classes.caption}
                  >
                    <ResponsiveEllipsis
                      basedOn='letters'
                      ellipsis='...'
                      maxLine='1'
                      text={title || previewData.url}
                      trimRight
                    />
                  </Typography>
                </ConditionalLinkWrapper>
              </Grid>
            </>
              }
          </Grid>
        </Fade>
      </ErrorBoundary>
    )
  }
}

ListPreview.propTypes = {
  previewData: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  rank: PropTypes.number
}

export default (withStyles(styles)(ListPreview))
