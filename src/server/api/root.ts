import { createTRPCRouter } from "~/server/api/trpc";
import { tweetRouter } from "~/server/api/routers/tweet";
import { profileRouter } from "./routers/profile";
import { Server } from "socket.io"
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tweet: tweetRouter,
  profile: profileRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

// const server = require('http').createServer(appRouter);
// server.listen(5000, () => console.info(`server listening on port - ${5000}`)) 

// const io = new Server(server, { // we will use this later
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST", "DELETE", "PUT", "PATCH"]
//     }
// })

// console.log(io)

// io.on('connection', (socket) => {
//   console.log('connected socket-------------------------------------------')

//   socket.on('hello', () => {
//     console.log('hello world')
//     socket.emit('hello_back')
//   })
//   socket.on('disconnect', () => {
//     console.log('disconnected')
//   })
// })