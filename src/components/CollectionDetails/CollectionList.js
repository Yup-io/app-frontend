import { Suspense } from 'react';
import { FlexBox } from '../styles';
import PostController from '../Post/PostController';
import RecommendationList from './RecommendationList';
import LoadingSpin from '../LoadingSpin';
import { PostWrapper, RecommendationWrapper } from './styles';
import { Typography } from '@mui/material';

const CollectionList = ({ collection, recommendationVisible, onScroll }) => {
  const { posts } = collection;

  return (
    <>
      <FlexBox
        flexDirection="column"
        overflow="auto"
        textAlign="center"
        onScroll={onScroll}
      >
        {posts.map((post) => (
          <PostWrapper center={!recommendationVisible}>
            <PostController
              key={post._id.postid}
              post={post}
              hideInteractions
              renderObjects
            />
          </PostWrapper>
        ))}
      </FlexBox>
      {recommendationVisible && (
        <RecommendationWrapper>
          <Typography variant="h5">Recommended</Typography>
          <Suspense fallback={<LoadingSpin />}>
            <RecommendationList collection={collection} />
          </Suspense>
        </RecommendationWrapper>
      )}
    </>
  );
};

export default CollectionList;
