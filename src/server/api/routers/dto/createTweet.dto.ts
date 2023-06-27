import { z } from "zod";

export const createTweetDto = z.object({ content: z.string()});

export type createTweetSchema = z.infer<typeof createTweetDto>