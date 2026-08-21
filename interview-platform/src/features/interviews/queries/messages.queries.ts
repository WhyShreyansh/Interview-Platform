import { prisma } from "@/lib/prisma";

export async function getRoomMessages(roomId: string) {
  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true } } },
  });

  type MessageRow = (typeof messages)[number];

  return messages.map((m: MessageRow) => ({
    id: m.id,
    roomId: m.roomId,
    senderId: m.senderId,
    senderName: m.sender.name,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  }));
}