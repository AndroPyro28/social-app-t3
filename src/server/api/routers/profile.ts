// import { TRPCError, inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
// import Tweet from "~/models/tweet.model";
// import Like from "~/models/like.model";
import User from "~/models/user.model";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getById: publicProcedure.input(z.object({
        id: z.string()
    }))
    .query(async ({input: {id}, ctx}) => {
        const userId = ctx.session?.user.id;
        const profile = await User.findUniqueId(userId as string)

        if(!profile) return;

        return {
            name: profile.name,
            image: profile.image,
            followersCount: profile._count.followers,
            followsCount: profile._count.follows,
            tweetsCount: profile._count.tweets,
            isFollowing: profile.followers.length > 0,
        }
    }),

    toggleFollow: protectedProcedure.input(z.object({
        userId: z.string()
    }))
    .mutation(async ({ctx, input: {userId}}) => {
        const currentUserId = ctx.session.user.id;
        const existingFollowedUser = await User.findByUserIdWithCurrentUserId(userId, currentUserId);
        let addedFollow: boolean;
        if(!existingFollowedUser) { // connect the currentUser to a user
            await User.followUser(userId, currentUserId);
            addedFollow = true
        }
        else { // disconnect the currentUser to a user
            await User.unFollowUser(userId, currentUserId);
            addedFollow = false
        }

        //revalidation
        return { addedFollow }
    })
})