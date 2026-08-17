"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/features/room/types/events";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

function throttle<Args extends unknown[]>(fn: (...args: Args) => void, waitMs: number) {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: Args | null = null;

  const invoke = (args: Args) => {
    lastCall = Date.now();
    fn(...args);
  };