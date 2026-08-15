import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import type {
  ClientToServerEvents, ServerToClientEvents, CodeState, PresenceUser,
} from "../src/features/room/types/events";

const prisma = new PrismaClient();
const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 4000;

const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000", methods: ["GET", "POST"] },
});

type RoomState = { code: CodeState; participants: Map<string, PresenceUser> };
const rooms = new Map<string, RoomState>();

function getOrCreateRoom(roomId: string): RoomState {
  let room = rooms.get(roomId);
  if (!room) {
    room = { code: { code: "// Start coding here\n", language: "javascript" }, participants: new Map() };
    rooms.set(roomId, room);
  }
  return room;
}

io.on("connection", (socket) => {
  let joinedRoomId: string | null = null;

  socket.on("room:join", ({ roomId, userId, name }) => {
    joinedRoomId = roomId;
    socket.join(roomId);
    const room = getOrCreateRoom(roomId);
    room.participants.set(socket.id, { userId, name });
    socket.emit("room:state", { code: room.code, participants: Array.from(room.participants.values()) });
    io.to(roomId).emit("presence:update", { participants: Array.from(room.participants.values()) });
  });

  socket.on("code:change", ({ roomId, code }) => {
    const room = getOrCreateRoom(roomId);
    room.code.code = code;
    socket.to(roomId).emit("code:change", { code });
  });

  socket.on("code:language", ({ roomId, language }) => {
    const room = getOrCreateRoom(roomId);
    room.code.language = language;
    socket.to(roomId).emit("code:language", { language });
  });

  socket.on("whiteboard:update", ({ roomId, elements, appState }) => {
    socket.to(roomId).emit("whiteboard:update", { elements, appState });
  });

  socket.on("chat:send", async ({ roomId, senderId, senderName, message }) => {
    try {
      const saved = await prisma.message.create({ data: { roomId, senderId, message } });
      io.to(roomId).emit("chat:message", {
        id: saved.id, roomId, senderId, senderName, message: saved.message,
        createdAt: saved.createdAt.toISOString(),
      });
    } catch (err) {
      console.error("Failed to persist chat message:", err);
    }
  });

  socket.on("timer:start", ({ roomId, durationSeconds, startedAt }) => {
    io.to(roomId).emit("timer:start", { durationSeconds, startedAt });
  });

  socket.on("timer:stop", ({ roomId }) => {
    io.to(roomId).emit("timer:stop");
  });