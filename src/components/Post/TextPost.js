import React, { memo } from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Linkify from 'react-linkify'
import LinkPreview from '../LinkPreview/LinkPreview'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  postContainer: {
    display: 'flex',
    background: theme.palette.M800,
    padding: '3%',
    alignItems: 'center'
  },
  postCaption: {
    fontFamily: '"Gilroy", sans-serif',
    fontSize: '20px',
    fontWeight: '200',
    lineHeight: 'normal',
    padding: '16px 16px',
    wordBreak: 'break-word',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: '24px'
    },
    [theme.breakpoints.up('1700')]: {
      fontSize: '34px'
    }
  }
})

function TextPost (props) {
  const { caption, classes, previewData, postHOC: PostHOC } = props

  const PreviewData = (_props) => (
    previewData
    ? <LinkPreview description={previewData.description || ''}
      image={previewData.img}
      title={previewData.title}
      url={previewData.url}
      />
    : null
  )
  const TextComp = (_props) => (
    <div className={classes.postContainer}>
      <Typography align='left'
        variant='h6'
        className={classes.postCaption}
      >
        <Linkify properties={{
        style: {
          color: '#fff',
          fontWeight: '500',
          '&:visited': {
            color: '#fff'
          }
        }
      }}
        >
          {caption}
        </Linkify>
        <PreviewData />
      </Typography>
    </div>
  )

    return (
      <ErrorBoundary>
        <PostHOC
          component={TextComp}
          {...props}
        />
      </ErrorBoundary>
    )
}

TextPost.propTypes = {
  classes: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  previewData: PropTypes.object,
  postHOC: PropTypes.element.isRequired
}

export default memo(withStyles(styles)(TextPost))
