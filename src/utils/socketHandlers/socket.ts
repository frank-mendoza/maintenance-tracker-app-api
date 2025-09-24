// src/socket.ts
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

let io: Server;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.WEB_APP_ROUTE, // Your Next.js frontend
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized. Call initSocket(server) first."
    );
  }
  return io;
};

/**
 * Emit a socket event dynamically
 * @param eventName - The name of the socket event
 * @param payload - The data to send
 */
export const emitSocketEvent = async (eventName: string, payload: any) => {
  if (!io) {
    console.error("Socket.io not initialized. Event not sent:", eventName);
    return;
  }
  io.emit(eventName, payload);
};
