"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { Socket } from "socket.io-client";
import { Play, Loader2, X } from "lucide-react";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  CodeState,
} from "@/features/room/types/events";
import { runCode, type RunResult } from "@/features/room/lib/run-code";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const LANGUAGES: { value: CodeState["language"]; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
];