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

  useEffect(() => {
    if (!running || remaining === null || remaining <= 0) return;
    const interval = setInterval(() => setRemaining((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  const start = () => socket?.emit("timer:start", { roomId, durationSeconds: durationMinutes * 60, startedAt: Date.now() });
  const stop = () => socket?.emit("timer:stop", { roomId });

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className={`font-mono text-sm tabular-nums ${remaining !== null && remaining <= 60 ? "text-destructive" : ""}`}>
        {remaining !== null ? formatTime(remaining) : `${durationMinutes}:00`}
      </span>
      {canControl && (
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={running ? stop : start}>
          {running ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
      )}
    </div>
  );
}

