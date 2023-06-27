import { Prisma } from '@prisma/client'
import {user} from './root'

class User {
    constructor() {}

    public async findUniqueId(userId: string) {
        
        return await user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                        follows: true,
                        tweets: true
                    }
                },
                followers:userId == null ? undefined: {
                    where: {
                        id: userId
                    }
                } 
            }
        })
    }
    
    public async findByUserIdWithCurrentUserId(userId: string, currentUserId: string) {
        return await user.findFirst({
            where: {
                id: userId,
                followers: {some: {
                    id: currentUserId
                }}
            }
        });
    }

    public async followUser(userIdToFollow: string, currentUserId: string) {
        return await user.update({
            where: {
                id: userIdToFollow
            },
            data: {
                followers: {
                    connect: {
                        id: currentUserId
                    }
                }
            }
        })
    }

    public async unFollowUser(userIdToFollow: string, currentUserId: string) {
        return await user.update({
            where: {
                id: userIdToFollow
            },
            data: {
                followers: {
                    disconnect: {
                        id: currentUserId
                    }
                }
            }
        })
    }

}


export default Object.freeze(new User());