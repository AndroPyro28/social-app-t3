import { TRPCError, inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import Tweet from "~/models/tweet.model";
import Like from "~/models/like.model";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";
import { createTweetDto } from "./dto/createTweet.dto";
import { infiniteProfileTweetDto, infiniteTweetDto } from "./dto/getTweet.dto";
import { Prisma } from "@prisma/client";

export const tweetRouter = createTRPCRouter({

  infiniteProfileFeed: publicProcedure.input(infiniteProfileTweetDto).query(async ({ctx, input}) => {
    const whereClause = {
       userId: input.userId 
    } as Prisma.TweetWhereInput | undefined
    return await getInfiniteTweets({ ctx, ...input, whereClause})
  }),

  infiniteTweet: publicProcedure.input(infiniteTweetDto).query(async ({input, ctx}) => {
    const userId = ctx.session?.user.id;

    const whereClause = userId == null || !input.onlyFollowing ? undefined : {
      user:{
        followers: {some: { id: userId }}
      }
    } as Prisma.TweetWhereInput | undefined

    return await getInfiniteTweets({ ctx, ...input, whereClause})
  }),
  // create tweet
  create: protectedProcedure.input(createTweetDto).mutation(async ({ input, ctx }) => {
      const tweet = await Tweet.createOne(
        input.content,
        ctx.session.user.id
      );
      if (!tweet) throw new TRPCError({ code: "BAD_REQUEST" });
      return tweet;
    }),

  // toggle like tweet
  toggleLike: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input: {id}}) => {
    const existingTweet = await Like.findById(id, ctx.session.user.id);
    if(!existingTweet) {
      await Like.createOne(id, ctx.session.user.id);
      return {addedLike: true}
    } else {
      await Like.deleteOne(id, ctx.session.user.id);
      return {addedLike: false}
    }
  })
    
});

async function getInfiniteTweets(input: {
  whereClause?:Prisma.TweetWhereInput | undefined ,
  limit?: number | undefined,
  onlyFollowing?: boolean | undefined,
  cursor?: {id: string, createdAt: Date} | undefined,
  ctx:inferAsyncReturnType<typeof createTRPCContext>
}) {
  const {limit=10, cursor, onlyFollowing=false, ctx, whereClause} = input;
  const userId = ctx.session?.user.id;

    const tweet = await Tweet.inifiniteTweet({limit, cursor, }, whereClause, userId ?? null);

    let nextCursor: typeof input.cursor | undefined;
    
    if(limit && tweet && tweet?.length > limit) {
      const nextItem = tweet.pop()!;
      nextCursor = {
        id: nextItem?.id, createdAt: nextItem?.createdAt
      }
    }

    return {
      tweet: tweet?.map((t)=> ({
        id: t.id,
        content: t.content,
        createdAt: t.createdAt,
        likeCount: t._count.likes,
        user: t.user,
        likedByMe: t.likes?.length > 0,
      }))
      , nextCursor}

}