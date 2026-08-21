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