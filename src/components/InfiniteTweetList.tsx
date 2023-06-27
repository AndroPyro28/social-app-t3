import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { RouterOutputs, api } from "~/utils/api";
import ProfileImage from "./ProfileImage";
import { useSession } from "next-auth/react";
import { VscHeartFilled, VscHeart } from "react-icons/vsc";
import IconHoverEffect from "./IconHoverEffect";
import LoadingSpinner from "./LoadingSpinner";

export type InfiniteTweet = RouterOutputs["tweet"]["infiniteTweet"];

type Tweet = InfiniteTweet["tweet"][number];

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets: Tweet[];
};

function InfiniteTweetList({
  tweets,
  hasMore,
  isError,
  isLoading,
  fetchNewTweets,
}: InfiniteTweetListProps) {

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <h1 className="my-4 text-center text-2xl text-gray-500">error...</h1>;

  if (tweets === null || tweets?.length === 0)
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </ul>
  );
}

export default InfiniteTweetList;

const dateTimeFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});
const TweetCard = ({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Tweet) => {

  const context = api.useContext();

  const {mutate: mutateToggleLike, isLoading} = api.tweet.toggleLike.useMutation({
    onSuccess: ({addedLike}) => {

        const updateData: Parameters<typeof context.tweet.infiniteTweet.setInfiniteData>[1] = (oldData) => {
          if(oldData == null) return;

          const countModifier = addedLike ? 1 : -1;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({...page, tweet: page.tweet.map((t) => {
              if(t.id === id) {
                return {...t,
                  likeCount: t.likeCount + countModifier,
                  likedByMe: addedLike
                }
              }
              return t;
            })}))
          }
        }
      context.tweet.infiniteTweet.setInfiniteData({}, updateData)
      context.tweet.infiniteTweet.setInfiniteData({onlyFollowing:true}, updateData)
      context.tweet.infiniteProfileFeed.setInfiniteData({userId: user.id}, updateData)
    }
  });

  const handleToggleLike = (tweetId: string) =>{
    mutateToggleLike({id: tweetId});
  }

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap"> {content}</p>
        <HeartButton  {...{ likeCount, likedByMe, isLoading, onClick: () => handleToggleLike(id) }} />
      </div>
    </li>
  );
};

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
  onClick: () => void;
  isLoading: boolean;
};

const HeartButton = ({ likedByMe, likeCount, onClick, isLoading }: HeartButtonProps) => {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated")
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );

  return (
    <button onClick={onClick}
      className={`group flex -ml-2 items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
      disabled={isLoading}
    >

      <IconHoverEffect red>
      <HeartIcon
        className={`transition-colors duration-200 ${
          likedByMe
          ? "fill-red-500"
          : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
        }`}
        />
        </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
};
