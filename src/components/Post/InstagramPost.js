import React, { PureComponent } from 'react'
import InstagramEmbed from 'react-instagram-embed'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LinkPreviewPost from './LinkPreviewPost'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  EmbeddedIG: {
    color: 'white',
    backgroundColor: '#191717',
    fontFamily: '"Gilroy", sans-serif'
  },
  Footer: {
    display: 'none'
  }
})

class InstagramPost extends PureComponent {
  state = {
    hasError: false
  }

  handleError = () => {
    this.setState({ hasError: true })
  }

  render () {
    const { classes, previewData, postHOC: PostHOC } = this.props

    if (this.state.hasError) {
      // eslint-disable-next-line react/jsx-indent
      return <LinkPreviewPost previewData={previewData}
        {...this.props}
             />
    }

    const InstagramComp = (_props) => (
      <div className={classes.postContainer}>
        <InstagramEmbed
          className={classes.EmbeddedIG}
          containerTagName='div'
          hideCaption
          injectScript
          maxWidth='600px'
          onAfterRender={() => {}}
          onFailure={this.handleError}
          onLoading={() => {}}
          onSuccess={() => {}}
          protocol=''
          style={{ width: '600px' }}
          url={this.props.caption}
        />
      </div>
    )

    return (
      <ErrorBoundary>
        <PostHOC component={InstagramComp}
          {...this.props}
        />
      </ErrorBoundary>
    )
  }
}

InstagramPost.propTypes = {
  previewData: PropTypes.object,
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InstagramPost)
