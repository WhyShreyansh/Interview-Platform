"use client";

import { useRouter } from "next/navigation";
import { useRoomSocket } from "@/features/room/hooks/useRoomSocket";
import { CodeEditor } from "@/features/room/components/CodeEditor";
import { Whiteboard } from "@/features/room/components/Whiteboard";
import { Chat } from "@/features/room/components/Chat";
import { Timer } from "@/features/room/components/Timer";
import { VideoRoom } from "@/features/room/components/VideoRoom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneOff, Users } from "lucide-react";
import type { ChatMessage } from "@/features/room/types/events";
import type { UserRole } from "@/types/next-auth";

export function RoomClient({
  roomId, title, durationMinutes, currentUser, initialMessages,
}: {
  roomId: string;
  title: string;
  durationMinutes: number;
  currentUser: { id: string; name: string; role: UserRole };
  initialMessages: ChatMessage[];
}) {
  const router = useRouter();
  const { socket, isConnected, participants } = useRoomSocket({
    roomId, userId: currentUser.id, name: currentUser.name,
  });