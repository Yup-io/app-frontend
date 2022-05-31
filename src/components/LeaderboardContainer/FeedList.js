import React, { useEffect, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query'
import flatten from 'lodash/flatten';
import InfiniteScroll from 'react-infinite-scroll-component';
import { REACT_QUERY_KEYS } from '../../constants/enum'
import { apiGetLists } from '../../apis/lists'
import { useFilters } from './LeaderboardContainer'
import { calc2dArrayItems } from '../../utils/helpers'
import YupListPostController from '../YupLeaderboard/YupListPostController'
import ListSkeleton from '../ListSkeleton'
import { useRouter } from 'next/router'
import { FeedListRoot } from './styles'

const LIST_PAGE_SIZE = 20;

const FeedList = () => {
  const { query } = useRouter();
  const { selectedPlatform, selectedSubject, selectedCategory } = useFilters();
  const {
    data,
    hasNextPage,
    status,
    fetchNextPage
  } = useInfiniteQuery(
    [REACT_QUERY_KEYS.YUP_LIST, selectedPlatform, selectedSubject, selectedCategory],
    ({ pageParam = 0, queryKey }) => {
      const [_, platform, subject, category] = queryKey;

      return apiGetLists({
        start: pageParam,
        limit: (LIST_PAGE_SIZE - 1), // Just adjustment for api call since API returns +1 rows.
        category: category,
        subject: 'posts',
        list: `${platform}:${subject}`,
        order: 1
      })
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.length) return undefined;

        return calc2dArrayItems(allPages);
      }
    }
  );
  const { category } = query;

  const posts = useMemo(() => data ? flatten(data.pages) : [], [data]);

  if (status === 'loading') {
    return <ListSkeleton />;
  }

  return (
    <FeedListRoot id="leaderboard-feeds">
      <InfiniteScroll
        dataLength={calc2dArrayItems(data.pages)}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<ListSkeleton />}
        scrollableTarget="leaderboard-feeds"
      >
        {posts.map((feed, index) => (
          <YupListPostController
            key={feed._id.postid}
            post={feed}
            rank={index + 1}
            rankCategory={category}
          />
        ))}
      </InfiniteScroll>
    </FeedListRoot>
  );
};

export default FeedList;
