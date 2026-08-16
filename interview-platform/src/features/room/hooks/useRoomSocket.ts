"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents, PresenceUser } from "@/features/room/types/events";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useRoomSocket({ roomId, userId, name }: { roomId: string; userId: string; name: string }) {
  const socketRef = useRef<AppSocket | null>(null);
  const [socket, setSocket] = useState<AppSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<PresenceUser[]>([]);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";
    const instance: AppSocket = io(socketUrl, { transports: ["websocket"] });
    socketRef.current = instance;
    setSocket(instance);

    instance.on("connect", () => {
      setIsConnected(true);
      instance.emit("room:join", { roomId, userId, name });
    });
    instance.on("disconnect", () => setIsConnected(false));
    instance.on("presence:update", ({ participants }) => setParticipants(participants));
    instance.on("room:state", ({ participants }) => setParticipants(participants));

    return () => {
      instance.disconnect();
      socketRef.current = null;
      setSocket(null);
    };

  }, [roomId, userId, name]);

  return { socket, isConnected, participants };
}

