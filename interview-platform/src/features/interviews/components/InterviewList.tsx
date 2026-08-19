import Link from "next/link";
import { format, isPast } from "date-fns";
import { Calendar, Clock, User, Video, CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/next-auth";

type InterviewListItem = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  roomId: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  interviewer: { id: string; name: string; email: string };
  candidate: { id: string; name: string; email: string };
};

const STATUS_CONFIG = {
  SCHEDULED: {
    rail: "bg-[hsl(var(--status-scheduled))]",
    text: "text-[hsl(var(--status-scheduled))]",
    label: "Scheduled",
    pulse: false,
  },
  IN_PROGRESS: {
    rail: "bg-[hsl(var(--status-live))]",
    text: "text-[hsl(var(--status-live))]",
    label: "Live",
    pulse: true,
  },
  COMPLETED: {
    rail: "bg-[hsl(var(--status-completed))]",
    text: "text-[hsl(var(--status-completed))]",
    label: "Completed",
    pulse: false,
  },
  CANCELLED: {
    rail: "bg-[hsl(var(--status-cancelled))]",
    text: "text-[hsl(var(--status-cancelled))]",
    label: "Cancelled",
    pulse: false,
  },
} as const;

export function InterviewList({
  interviews,
  currentRole,
}: {
  interviews: InterviewListItem[];
  currentRole: UserRole;
}) {
  if (interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <CalendarPlus className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium">No interviews yet</p>
          <p className="text-sm text-muted-foreground">
            {currentRole === "INTERVIEWER"
              ? "Schedule your first interview to generate a room link."
              : "Interviews an interviewer schedules with you will show up here."}
          </p>
        </div>
      </div>
    );
  }