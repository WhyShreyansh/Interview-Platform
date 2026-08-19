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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => {
        const otherParty = currentRole === "INTERVIEWER" ? interview.candidate : interview.interviewer;
        const otherRole = currentRole === "INTERVIEWER" ? "candidate" : "interviewer";
        const status = STATUS_CONFIG[interview.status];
        const canJoin = interview.status !== "CANCELLED" && interview.status !== "COMPLETED";
        const isOverdue = isPast(interview.date) && interview.status === "SCHEDULED";

        return (
          <div
            key={interview.id}
            className="group relative flex overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className={`w-1 shrink-0 ${status.rail}`} />

            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold leading-tight">{interview.title}</h3>
                <span className={`flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wide ${status.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.rail} ${status.pulse ? "animate-pulse" : ""}`} />
                  {status.label}
                </span>
              </div>