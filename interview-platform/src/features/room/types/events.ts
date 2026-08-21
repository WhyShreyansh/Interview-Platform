export type ChatMessage = {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
};

export type PresenceUser = { userId: string; name: string };

export type CodeState = {
  code: string;
  language: "javascript" | "typescript" | "python";
};

export interface ClientToServerEvents {
  "room:join": (payload: { roomId: string; userId: string; name: string }) => void;
  "code:change": (payload: { roomId: string; code: string }) => void;
  "code:language": (payload: { roomId: string; language: CodeState["language"] }) => void;
  "whiteboard:update": (payload: { roomId: string; elements: unknown; appState?: unknown }) => void;
  "chat:send": (payload: { roomId: string; senderId: string; senderName: string; message: string }) => void;
  "timer:start": (payload: { roomId: string; durationSeconds: number; startedAt: number }) => void;
  "timer:stop": (payload: { roomId: string }) => void;
}