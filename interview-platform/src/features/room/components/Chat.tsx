"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents, ChatMessage } from "@/features/room/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function Chat({
  socket, roomId, currentUserId, currentUserName, initialMessages,
}: {
  socket: AppSocket | null;
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: ChatMessage) => setMessages((prev) => [...prev, msg]);
    socket.on("chat:message", handleMessage);
    return () => { socket.off("chat:message", handleMessage); };
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed || !socket) return;
    socket.emit("chat:send", { roomId, senderId: currentUserId, senderName: currentUserName, message: trimmed });
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No messages yet.</p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
              <span className="text-xs text-muted-foreground">
                {msg.senderName} · {format(new Date(msg.createdAt), "p")}
              </span>
              <div className={`max-w-[85%] rounded-lg px-3 py-1.5 text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>