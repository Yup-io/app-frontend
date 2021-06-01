import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ReactPlayer from 'react-player'
import PropTypes from 'prop-types'
import Img from 'react-image'
import { Grid, Tooltip } from '@material-ui/core'
import LinesEllipsis from 'react-lines-ellipsis'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'

const { DEFAULT_POST_IMAGE, RARIBLE_API } = process.env

// TODO: Simplify regex, put in utils file
const RARIBLE_URL = new RegExp('^(app.rarible.com|www.app.rarible.com|http://app.rarible.com|https://app.rarible.com|http://www.app.rarible.com|https://www.app.rarible.com|rarible.com|www.rarible.com|http://rarible.com|https://rarible.com|http://www.rarible.com|https://www.rarible.com)', 'i')
const SUPERRARE_URL = new RegExp('^(superrare.co|www.superrare.co|http://superrare.co|https://superrare.co|http://www.superrare.co|https://www.superrare.co)', 'i')
const FOUNDATION_URL = new RegExp('^(foundation.app|www.foundation.app|http://foundation.app|https://foundation.app|http://www.foundation.app|https://www.foundation.app)', 'i')
const ZORA_URL = new RegExp('^(zora.co|www.zora.co|http://zora.co|https://zora.co|http://www.zora.co|https://www.zora.co)', 'i')
const KNOWN_ORIGIN_URL = new RegExp('^((http:|https:)([/][/]))?(www.)?knownorigin.io/gallery/[^/]*[/]?$', 'i')

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px'
    }
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
    background: 'linear-gradient(0deg,#1b1b1b,#ffffff00,#ffffff00)',
    objectPosition: '50% 50%',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    position: 'relative',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0px'
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
    fontSize: '20px',
    fontWeight: 500,
    textShadow: '0px 0px 5px rgba(20, 20, 20, 0.5)',
    [theme.breakpoints.down('md')]: {
      width: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  description: {
    position: 'relative',
    fontSize: '12px',
    textShadow: '0px 0px 5px rgba(20, 20, 20, 0.3)',
    fontWeight: 300,
    lineHeight: 1.3,
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  },
  credits: {
    position: 'relative',
    fontSize: '14px',
    textShadow: '0px 0px 5px rgba(20, 20, 20, 0.3)',
    fontWeight: 400,
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
    marginTop: '0px',
    display: 'none'
  },
  previewData: {
    position: 'absolute',
    bottom: '0',
    textAlign: 'left',
    width: '96%',
    zIndex: 5,
    background: 'linear-gradient(rgba(26, 26, 26,0), rgba(40, 26, 26,0.2), rgba(26, 26, 26, 0.55), rgba(26, 26, 26, 0.75), rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.95), rgba(26, 26, 26,0.99), rgb(26, 26, 26))',
    padding: '1% 3%'
  }
})

class NFTPreview extends Component {
  state = {
    creator: '',
    owners: []
  }

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
    if (link == null) { return '' }
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
    if (link == null) { return '' }
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

  async getCreatorAndOwners () {
    await this.getCreator()
    await this.getOwners()
  }

  async getCreator () {
    const { previewData } = this.props
    const raribleNFT = previewData.url.match(RARIBLE_URL)
    const superrareNFT = previewData.url.match(SUPERRARE_URL)
    const foundationNFT = previewData.url.match(FOUNDATION_URL)
    const zoraNFT = previewData.url.match(ZORA_URL)
    const knownOriginNFT = previewData.url.match(KNOWN_ORIGIN_URL)

    if (raribleNFT && previewData[0] && previewData[0].item) {
      const res = await axios.get(`${RARIBLE_API}/${previewData[0].item.creator}`)
      this.setState({
        creator: res.data.username
      })
    } else if (superrareNFT && previewData.createdBy) {
      this.setState({
        creator: previewData.createdBy
      })
    } else if ((foundationNFT || zoraNFT || knownOriginNFT) && previewData.creator) {
      this.setState({
        creator: previewData.creator
      })
    }
  }

  async getOwners () {
    const { previewData } = this.props
    const raribleNFT = previewData.url.match(RARIBLE_URL)
    const foundationNFT = previewData.url.match(FOUNDATION_URL)
    const zoraNFT = previewData.url.match(ZORA_URL)

    if (raribleNFT && previewData[0].item) {
      previewData[0].item.owners.forEach(async owner => {
        const res = await axios.get(`${RARIBLE_API}/${owner}`)
        if (res.data.username && res.data.username !== this.state.creator) {
          this.setState({
            owners: [...this.state.owners, res.data.username]
          })
        }
      })
    } else if ((foundationNFT || zoraNFT) && previewData.owner) {
      if (previewData.owner !== this.state.creator) {
        this.setState({
          owners: [...this.state.owners, previewData.owner]
        })
      }
    }
  }

  componentDidMount () {
    this.getCreatorAndOwners()
  }

  render () {
    const { image, title, description, url, classes, caption, mimeType } = this.props

    let faviconURL
    let faviconURLFallback

    if (url != null) {
      faviconURL = 'https://api.faviconkit.com/' + this.trimURLStart(this.trimURLEnd(url)) + '64'
      faviconURLFallback = this.trimURLEnd(url) + 'favicon.ico'
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
              {((image && image.includes('nft.mp4')) || (mimeType && mimeType.includes('video')))
              ? <ReactPlayer
                className={classes.linkImg}
                style={{ overFlow: 'hidden', maxHeight: '1000px' }}
                url={image}
                height='auto'
                width='100%'
                playing
                muted
                loop
                playsinline
                />
            : <Img alt={title}
              className={classes.linkImg}
              src={[image, DEFAULT_POST_IMAGE]}
              target='_blank'
              loader={<img src={DEFAULT_POST_IMAGE} />}
              />
            }
              <div className={classes.previewData}>
                <Grid
                  container
                  direction='column'
                  spacing={1}
                  justify='center'
                >
                  <Grid item>
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
                          style={{ height: 30, width: 30, marginRight: '0.5rem', border: 'none' }}
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
                  </Grid>
                  {(this.state.creator || this.state.owners.length > 0) &&
                    <Grid item>
                      <Grid
                        justify='left'
                        container
                        direction='row'
                        alignItems='left'
                        spacing={0}
                        style={{ height: '30px' }}
                      >
                        {this.state.creator &&
                        <Grid item
                          xs={this.state.owners.length > 0 ? 3 : 6}
                        >
                          <Tooltip title='Creator'
                            placement='top'
                            arrow
                            disableTouchListener
                          >
                            <div className={classes.credits}>
                              <LinesEllipsis
                                basedOn='letters'
                                ellipsis='...'
                                maxLine='1'
                                text={`🧑‍🎨` + `\u00A0` + ` ${this.state.creator}`}
                                trimRight
                              />
                            </div>
                          </Tooltip>
                        </Grid>
                        }
                        {this.state.owners.length > 0 &&
                        <Grid item
                          xs={this.state.creator ? 6 : 4}
                        >
                          <Tooltip title='Owner'
                            placement='top'
                            arrow
                            disableTouchListener
                          >
                            <div className={classes.credits}>
                              <LinesEllipsis
                                basedOn='letters'
                                ellipsis='...'
                                maxLine='1'
                                text={`🗝` + `\u00A0\u00A0` + `${this.state.owners.join(', ')}`}
                                trimRight
                              />
                            </div>
                          </Tooltip>
                        </Grid>
                    }
                      </Grid>
                    </Grid>
                }
                  <Grid item>
                    <div className={classes.description}>
                      <LinesEllipsis
                        basedOn='letters'
                        ellipsis='...'
                        maxLine='2'
                        text={description || caption}
                        trimRight
                      />
                    </div>
                    <p className={classes.url}>{url && this.cutUrl(url)}</p>
                  </Grid>
                </Grid>
              </div>
            </div>
          </a>
        </div>
      </ErrorBoundary>
    )
  }
}

NFTPreview.propTypes = {
  previewData: PropTypes.object,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default (withStyles(styles)(NFTPreview))
