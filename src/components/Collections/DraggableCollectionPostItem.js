import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { Img } from 'react-image';
import { Draggable } from 'react-beautiful-dnd';

const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${
  Math.floor(Math.random() * 5) + 1
}.png`;

const styles = (theme) => ({
  collectionImg: {
    height: '60px',
    width: '60px',
    objectFit: 'cover',
    borderRadius: '5px',
    [theme.breakpoints.down('lg')]: {
      height: '50px',
      width: '50px'
    }
  },
  collectionContainer: {
    borderRadius: 10,
    margin: 0,
    '&:hover': {
      background: `${theme.palette.M200}05`
    }
  },
  draggingListItem: {
    background: `${theme.palette.M200}05`,
    [theme.breakpoints.down('sm')]: {
      height: '40px',
      width: '40px',
      marginTop: '5px'
    }
  }
});

const DraggableCollectionPostItem = ({ classes, post, index }) => {
  if (!post) return null;
  const { _id, previewData } = post;

  return (
    <Draggable draggableId={_id.postid} index={index}>
      {(provided, snapshot) => (
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          className={[
            classes.collectionContainer,
            snapshot.isDragging ? classes.draggingListItem : ''
          ]}
          spacing={2}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Grid item xs={2} lg={3} xl={2}>
            <Img
              src={[previewData ? previewData.img : DEFAULT_IMG, DEFAULT_IMG]}
              alt="thumbnail"
              className={classes.collectionImg}
            />
          </Grid>
          <Grid item xs={10} lg={9} xl={10}>
            <Typography variant="h5">{previewData.title}</Typography>
          </Grid>
        </Grid>
      )}
    </Draggable>
  );
};

DraggableCollectionPostItem.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default memo(withStyles(styles)(DraggableCollectionPostItem));
