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