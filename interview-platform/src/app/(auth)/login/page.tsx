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