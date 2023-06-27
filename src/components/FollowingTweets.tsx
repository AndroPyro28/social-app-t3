import React from 'react'
import InfiniteTweetList from './InfiniteTweetList';
import { api } from '~/utils/api';

function FollowingTweets() {
    const tweets = api.tweet.infiniteTweet.useInfiniteQuery({
        onlyFollowing: true
    }, {
        getNextPageParam: (lastpage) => lastpage.nextCursor
      });
  
    return (
      <InfiniteTweetList 
      tweets={tweets?.data?.pages.flatMap(pages => pages.tweet)!}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage!}
      fetchNewTweets={tweets.fetchNextPage}
       />
    )
}

export default FollowingTweets