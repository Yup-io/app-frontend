import { useUserPosts } from '../../hooks/queries';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListSkeleton from '../ListSkeleton/ListSkeleton';
import { useMemo } from 'react';
import flatten from 'lodash/flatten';
import PostController from '../Post/PostController';
import { Typography } from '@mui/material';

const UserPosts = ({ userId }) => {
  const { data, hasNextPage, status, fetchNextPage } = useUserPosts(userId);

  const posts = useMemo(() => {
    if (!data) return [];

    return flatten(data.pages.map((page) => page.posts)).filter((item) => item?._id.postid);
  }, [data]);

  if (status === 'loading') {
    return <ListSkeleton />;
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<ListSkeleton />}
      endMessage={
        <Typography>
          End of Feed
        </Typography>
      }
    >
      {posts.map((post) => (
        <PostController
          key={post._id.postid}
          post={post}
          renderObjects
          hideInteractions={false}
        />
      ))}
    </InfiniteScroll>
  );
};

export default UserPosts;
