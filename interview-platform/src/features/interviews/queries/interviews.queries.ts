import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types/next-auth";

const interviewSelect = {
  id: true,
  title: true,
  date: true,
  duration: true,
  roomId: true,
  status: true,
  interviewer: { select: { id: true, name: true, email: true } },
  candidate: { select: { id: true, name: true, email: true } },
} as const;

export async function getMyInterviews(userId: string, role: UserRole) {
  const where = role === "INTERVIEWER" ? { interviewerId: userId } : { candidateId: userId };
  return prisma.interview.findMany({ where, select: interviewSelect, orderBy: { date: "asc" } });
}

export async function getInterviewByRoomId(roomId: string) {
  return prisma.interview.findUnique({ where: { roomId }, select: interviewSelect });
}