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