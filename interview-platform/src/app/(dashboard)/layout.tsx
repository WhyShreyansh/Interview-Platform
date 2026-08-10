import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const isInterviewer = session.user.role === "INTERVIEWER";

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary font-mono text-xs text-primary-foreground">
              {">_"}
            </span>
            Interview Platform
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <Badge variant="outline" className="font-mono">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: `hsl(var(--role-${isInterviewer ? "interviewer" : "candidate"}))`,
                }}
              />
              {session.user.role}
            </Badge>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
