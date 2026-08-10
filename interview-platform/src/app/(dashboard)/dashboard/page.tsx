import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMyInterviews } from "@/features/interviews/queries/interviews.queries";
import { InterviewList } from "@/features/interviews/components/InterviewList";
import { CreateInterviewDialog } from "@/features/interviews/components/CreateInterviewDialog";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const interviews = await getMyInterviews(session.user.id, session.user.role);
  const isInterviewer = session.user.role === "INTERVIEWER";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 font-mono text-xs text-muted-foreground">
            // {isInterviewer ? "interviews.manage" : "interviews.upcoming"}
          </p>
          <h1 className="font-display text-2xl font-semibold">
            {isInterviewer ? "Your interviews" : "Your upcoming interviews"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isInterviewer
              ? "Schedule new interviews and join existing ones."
              : "Join an interview once it's time using the button below."}
          </p>
        </div>
        {isInterviewer && <CreateInterviewDialog />}
      </div>