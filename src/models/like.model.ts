import { infiniteTweetSchema } from '~/server/api/routers/dto/getTweet.dto';
import { like } from './root'

class Like {
    
    constructor() {}

    public async createOne(tweetId: string, userId: string) {
        return await like.create({
            data: {tweetId, userId}
        })
    }

    public async findById(tweetId: string, userId: string) {
        return await like.findUnique({
            where: {
                userId_tweetId: {userId, tweetId}
            }
        })
    }

    public async deleteOne(tweetId: string, userId: string) {
        return await like.delete({
            where: {
                userId_tweetId: {userId, tweetId}
            }
        })
    }
}

export default Object.freeze(new Like())