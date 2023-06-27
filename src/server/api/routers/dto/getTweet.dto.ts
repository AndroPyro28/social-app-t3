import { z } from "zod";

export const infiniteTweetDto = z.object({
  onlyFollowing: z.boolean().optional(),
    limit: z.number().optional(),
    cursor: z.object({id: z.string(), createdAt: z.date()}).optional()
  })

  export const infiniteProfileTweetDto = z.object({
      userId: z.string(),
      limit: z.number().optional(),
      cursor: z.object({id: z.string(), createdAt: z.date()}).optional()
    })

  export type infiniteProfileTweetSchema = z.infer<typeof infiniteProfileTweetDto>;

  export type infiniteTweetSchema = z.infer<typeof infiniteTweetDto>;