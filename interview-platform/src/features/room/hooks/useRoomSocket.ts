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