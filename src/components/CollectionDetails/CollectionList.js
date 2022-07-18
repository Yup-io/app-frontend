import { Suspense } from 'react';
import { FlexBox } from '../styles';
import PostController from '../Post/PostController';
import RecommendationList from './RecommendationList';
import LoadingSpin from '../LoadingSpin';
import { Grid, Typography } from '@mui/material';

const CollectionList = ({ collection, recommendationVisible, onScroll, headerMinimized }) => {
  const { posts } = collection;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={7} xl={6}>
        <FlexBox
          flexDirection="column"
          overflow="auto"
          textAlign="center"
          onScroll={onScroll}
          className="Tour-CollectionPosts"
          sx={{
            height: `calc(100vh - ${headerMinimized ? 140 : 190}px)`
          }}
        >
          {posts
            .filter((p) => p?._id)
            .map((post) => (
            <PostController
              key={post?._id.postid}
              post={post}
              hideInteractions
              renderObjects
            />
          ))}
        </FlexBox>
      </Grid>
      {recommendationVisible && (
        <Grid item xs={12} lg={5} xl={6}>
          <Typography variant="h5">Recommended</Typography>
          <Suspense fallback={<LoadingSpin />}>
            <RecommendationList collection={collection} />
          </Suspense>
        </Grid>
      )}
    </Grid>
  );
};

export default CollectionList;
