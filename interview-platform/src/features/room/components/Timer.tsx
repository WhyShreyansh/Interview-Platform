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