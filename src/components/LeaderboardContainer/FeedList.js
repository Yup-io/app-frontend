import React, { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import flatten from 'lodash/flatten';
import InfiniteScroll from 'react-infinite-scroll-component';
import { REACT_QUERY_KEYS } from '../../constants/enum';
import { apiGetLists } from '../../apis/lists';
import { useFilters } from './LeaderboardContainer';
import { calc2dArrayItems } from '../../utils/helpers';
import ListSkeleton from '../ListSkeleton';
import { FeedListRoot } from './styles';
import LeaderboardItem from '../LeaderboardItem';
import { Container } from '@mui/material';

const LIST_PAGE_SIZE = 20;

const FeedList = () => {
  const { selectedPlatform, selectedSubject } = useFilters();
  const { data, hasNextPage, status, fetchNextPage } = useInfiniteQuery(
    [REACT_QUERY_KEYS.YUP_LIST, selectedPlatform, selectedSubject],
    ({ pageParam = 0, queryKey }) => {
      const [_, platform, subject] = queryKey;

      return apiGetLists({
        start: pageParam,
        limit: LIST_PAGE_SIZE - 1, // Just adjustment for api call since API returns +1 rows.
        category: 'overall',
        subject: 'posts',
        list: `${platform}:${subject}`,
        order: 1
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.length) return undefined;

        return calc2dArrayItems(allPages);
      }
    }
  );

  const posts = useMemo(() => {
    if (!data) return [];

    return flatten(data.pages).filter((item) => !!item.previewData?.title);
  }, [data]);

  if (status === 'loading') {
    return (
      <Container>
        <ListSkeleton />
      </Container>
    );
  }

  return (
    <FeedListRoot id="leaderboard-feeds">
      <InfiniteScroll
        dataLength={calc2dArrayItems(data.pages)}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <Container>
            <ListSkeleton />
          </Container>
        }
        scrollableTarget="leaderboard-feeds"
      >
        {posts.map((feed, index) => (
          <Container>
            <LeaderboardItem
              key={feed._id.postid}
              data={feed}
              rank={index + 1}
            />
          </Container>
        ))}
      </InfiniteScroll>
    </FeedListRoot>
  );
};

export default FeedList;
