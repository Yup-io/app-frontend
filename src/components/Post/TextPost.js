import React, { memo } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Linkify from 'react-linkify';
import LinkPreview from '../LinkPreview/LinkPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    background: theme.palette.M800,
    padding: '3%',
    alignItems: 'center'
  },
  postUrl: {
    fontFamily: '"Gilroy", sans-serif',
    fontSize: '20px',
    fontWeight: '200',
    lineHeight: 'normal',
    padding: '16px 16px',
    wordBreak: 'break-word',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px'
    },
    [theme.breakpoints.up('1700')]: {
      fontSize: '34px'
    }
  }
});

function TextPost(props) {
  const { url, classes, previewData, postHOC: PostHOC } = props;

  const PreviewData = (_props) =>
    previewData ? (
      <LinkPreview
        description={previewData.description || ''}
        image={previewData.img}
        title={previewData.title}
        url={url}
      />
    ) : null;
  const TextComp = (_props) => (
    <div className={classes.postContainer}>
      <Typography align="left" variant="h6" className={classes.postUrl}>
        <Linkify
          properties={{
            style: {
              color: '#fff',
              fontWeight: '500',
              '&:visited': {
                color: '#fff'
              }
            }
          }}
        >
          {url}
        </Linkify>
        <PreviewData />
      </Typography>
    </div>
  );

  return (
    <ErrorBoundary>
      <PostHOC component={TextComp} {...props} />
    </ErrorBoundary>
  );
}

TextPost.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  previewData: PropTypes.object,
  postHOC: PropTypes.element.isRequired
};

export default memo(withStyles(styles)(TextPost));
