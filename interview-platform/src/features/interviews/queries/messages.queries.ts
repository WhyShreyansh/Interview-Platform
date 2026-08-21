import { prisma } from "@/lib/prisma";

export async function getRoomMessages(roomId: string) {
  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true } } },
  });