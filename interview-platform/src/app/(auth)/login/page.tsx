import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-foreground/15 font-mono text-sm">
            {">_"}
          </span>
          Interview Platform
        </div>
        <div className="max-w-sm space-y-3">
          <p className="font-display text-2xl font-medium leading-snug">
            Run the whole technical interview from one room.
          </p>
          <p className="font-mono text-xs text-primary-foreground/70">
            // video · collaborative editor · whiteboard · chat
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm border-none shadow-none lg:border lg:shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-xl">Sign in</CardTitle>
            <CardDescription>Access your interviews as a candidate or interviewer.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}