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

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-semibold">{title}</h1>
          <Badge variant={isConnected ? "live" : "secondary"}>
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-[hsl(var(--status-live))] animate-pulse" : "bg-muted-foreground"}`} />
            {isConnected ? "Live" : "Connecting"}
          </Badge>
          <span className="flex items-center gap-1 font-mono text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {participants.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Timer socket={socket} roomId={roomId} durationMinutes={durationMinutes} canControl={currentUser.role === "INTERVIEWER"} />
          <Button variant="destructive" size="sm" onClick={() => router.push("/dashboard")}>
            <PhoneOff className="mr-2 h-4 w-4" />
            Leave
          </Button>
        </div>

        </header>

      <div className="grid flex-1 grid-cols-[280px_1fr_320px] overflow-hidden">
        <aside className="border-r">
          <VideoRoom roomId={roomId} />
        </aside>

        <main className="overflow-hidden">
          <Tabs defaultValue="editor" className="flex h-full flex-col">
            <div className="border-b px-2 pt-2">
              <TabsList>
                <TabsTrigger value="editor">Code Editor</TabsTrigger>
                <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="editor" className="flex-1 overflow-hidden">
              <CodeEditor socket={socket} roomId={roomId} />
            </TabsContent>
            <TabsContent value="whiteboard" className="flex-1 overflow-hidden">
              <Whiteboard socket={socket} roomId={roomId} />
            </TabsContent>
          </Tabs>
        </main>