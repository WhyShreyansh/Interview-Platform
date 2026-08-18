"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createInterviewSchema,
  type CreateInterviewInput,
} from "@/features/interviews/schemas/interview.schema";

type ActionResult =
  | { success: true; roomId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createInterview(input: CreateInterviewInput): Promise<ActionResult> {
  const session = await auth();

  if (!session) {
    return { success: false, error: "Your session has expired. Please sign out and sign back in." };
  }

  if (session.user.role !== "INTERVIEWER") {
    return { success: false, error: "Only interviewers can schedule interviews" };
  }

  const parsed = createInterviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { title, candidateEmail, date, duration } = parsed.data;

  const candidate = await prisma.user.findUnique({ where: { email: candidateEmail } });

  if (!candidate) {
    return {
      success: false,
      error: "No account found with that email",
      fieldErrors: { candidateEmail: ["No account found with that email"] },
    };
  }

  if (candidate.role !== "CANDIDATE") {
    return {
      success: false,
      error: "That email belongs to an interviewer, not a candidate",
      fieldErrors: { candidateEmail: ["That email belongs to an interviewer, not a candidate"] },
    };
  }

  const interview = await prisma.interview.create({
    data: {
      title,
      date: new Date(date),
      duration,
      interviewerId: session.user.id,
      candidateId: candidate.id,
    },
  });

  revalidatePath("/dashboard");

  return { success: true, roomId: interview.roomId };
}