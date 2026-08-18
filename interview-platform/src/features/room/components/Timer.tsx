"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/features/room/types/events";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square } from "lucide-react";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

function formatTime(totalSeconds: number) {
  const m = Math.floor(Math.max(0, totalSeconds) / 60);
  const s = Math.max(0, totalSeconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Timer({
  socket, roomId, durationMinutes, canControl,
}: { socket: AppSocket | null; roomId: string; durationMinutes: number; canControl: boolean }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const handleStart = ({ durationSeconds, startedAt }: { durationSeconds: number; startedAt: number }) => {
      setRunning(true);
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(durationSeconds - elapsed);
    };
  }, [socket]);
