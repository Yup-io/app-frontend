import React, { memo } from 'react';
import PropTypes from 'prop-types';
import LinkPreview from '../LinkPreview/LinkPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    padding: '0% 0% 2% 0%',
    alignItems: 'center'
  }
});

function LinkPreviewPost(props) {
  const { previewData, caption, classes, postHOC: PostHOC } = props;
  const PreviewComp = (_props) => (
    <div className={classes.postContainer}>
      <LinkPreview
        description={previewData && previewData.description}
        image={previewData && previewData.img}
        title={previewData && previewData.title}
        url={previewData && previewData.url}
        caption={caption}
      />
    </div>
  );

  return (
    <ErrorBoundary>
      <PostHOC component={PreviewComp} {...props} />
    </ErrorBoundary>
  );
}

LinkPreviewPost.propTypes = {
  previewData: PropTypes.object,
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired
};

export default memo(withStyles(styles)(LinkPreviewPost));
