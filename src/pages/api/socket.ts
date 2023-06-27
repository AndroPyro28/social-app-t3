import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type {
  NextApiResponseWithSocket,
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../types/socket_custom.types";

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(
        res.socket.server
      );
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    

    io.on("connection", (socket) => {
        console.log('hello world')
      socket.broadcast.emit("userServerConnection");
      socket.on("hello", (msg) => {
        socket.emit("hello", msg);
      });
      socket.on("disconnect", () => {
        console.log("A user disconnected");
        socket.broadcast.emit("userServerDisconnection", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    // console.log("socket.io already running");
    io.on("connection", (socket) => {

      socket.on("hello", (msg) => {
        socket.emit("hello", msg);
      });
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;