import React from 'react'
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next'
import useHeader from '~/hooks/useHeader'
import { useRouter } from 'next/router'
import { ssgHelper } from '~/helper/ssgHelper'
import { api } from '~/utils/api'
import ErrorPage from 'next/error'
import Link from 'next/link'
import IconHoverEffect from '~/components/IconHoverEffect'
import { VscArrowLeft } from 'react-icons/vsc'
import ProfileImage from '~/components/ProfileImage'
import InfiniteTweetList from '~/components/InfiniteTweetList'
import FollowButton from '~/components/FollowButton'

const ProfileDetail: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({id,}) => {

  const {query} = useRouter()

  const {data: profile, isLoading} = api.profile.getById.useQuery({id});
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery({userId: id}, {
    getNextPageParam: (lastpage) => lastpage.nextCursor
  });

  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess:({addedFollow}) => {
      
    }
  });

  useHeader(`Profile - ${profile?.name}`)

  if(!profile) return <ErrorPage statusCode={404} />

  return (
    <>
      <header className='sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2'>
        <Link href={'#'} className='mr-2'>
          <IconHoverEffect>
            <VscArrowLeft className='h-6 w-6'/>
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className='flex-shrink-0' />
        <div className='ml-2 flex-grow'>
          <h1 className='text-lg font-bold'>{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount} {getPlural(profile.tweetsCount, 'Tweet', 'Tweets')} {" - "}
            {profile.followersCount} {getPlural(profile.followersCount, 'Follower', 'Followers')} {" - "}
            {profile.followsCount} Follows
            </div>
        </div>
            <FollowButton {...
            {
              isFollowing: profile.isFollowing,
              userId: id,
              isLoading: toggleFollow.isLoading,
              onClick:() => toggleFollow.mutate({userId: id})
            }
            } />
      </header>
      <main>
          <InfiniteTweetList
            tweets={tweets?.data?.pages.flatMap(pages => pages.tweet)!}
            isError={tweets.isError}
            isLoading={tweets.isLoading}
            hasMore={tweets.hasNextPage!}
            fetchNewTweets={tweets.fetchNextPage}
          />
        </main>
    </>
  )
}

const getPlural = (number:number, singular: string, plural: string) => {
const pluralRules = new Intl.PluralRules();
  return pluralRules.select(number) === 'one' ? singular : plural;
}

export default ProfileDetail

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = async (context: GetStaticPropsContext<{id: string}>) => {
    
    const id = context.params?.id;

    if(id == null) {
      return {
        redirect: {
          destination: '/'
        }
      }
    }

    const ssg = ssgHelper()
    await ssg.profile.getById.prefetch({id})
  return {
    props : {
      id,
      trpcState: ssg.dehydrate()
    }
  }
}