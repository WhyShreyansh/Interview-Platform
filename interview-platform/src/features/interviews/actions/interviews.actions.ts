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