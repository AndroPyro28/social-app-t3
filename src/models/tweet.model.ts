import { infiniteTweetSchema } from '~/server/api/routers/dto/getTweet.dto';
import { tweet } from './root'
import { Prisma } from '@prisma/client';

class Tweet {
    
    constructor() {}

    public async createOne(content: string, userId: string) {
        return await tweet.create({
            data: {
                content,
                userId
            },
            include: {
                user: true
            }
        })
    }

    public async inifiniteTweet (input: infiniteTweetSchema, whereClause: Prisma.TweetWhereInput | undefined,userId: string | null,) {
        const {limit=10, cursor} = input;
           return await tweet.findMany({
                take: limit + 1,
                cursor: cursor ? { createdAt_id: cursor} : undefined,
                orderBy: [
                    {
                        createdAt:'desc'
                    },
                    {
                        id: 'desc'
                    }
                ],
                where: whereClause,
                select: {
                    id:true,
                    content:true,
                    createdAt: true,
                    _count: {select: {
                        likes: true
                    }},
                    likes: userId == null ? false : {where: {userId}},
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            })
    }

    public async findById(id: string) {
        return await tweet.findUnique({
            where: {
                id
            }
        });
    }
}
export default Object.freeze( new Tweet() )