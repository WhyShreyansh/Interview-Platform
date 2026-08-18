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

  return (...args: Args) => {
    const now = Date.now();
    const remaining = waitMs - (now - lastCall);
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      invoke(args);
    } else {
      pendingArgs = args;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          if (pendingArgs) invoke(pendingArgs);
        }, remaining);
      }
    }
  };
}

export function Whiteboard({ socket, roomId }: { socket: AppSocket | null; roomId: string }) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const suppressNextChange = useRef(false);
  const [ready, setReady] = useState(false);

  const throttledEmit = useMemo(
    () =>
      throttle((elements: unknown) => {
        socket?.emit("whiteboard:update", { roomId, elements });
      }, 150),
    [socket, roomId]
  );

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = ({ elements }: { elements: unknown }) => {
      if (!apiRef.current) return;
      suppressNextChange.current = true;
      apiRef.current.updateScene({ elements: elements as never });
    };

    socket.on("whiteboard:update", handleUpdate);
    return () => {
      socket.off("whiteboard:update", handleUpdate);
    };
  }, [socket]);