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